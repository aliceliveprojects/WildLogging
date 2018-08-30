## Taming the Urban Wild

A post-mortem of an implementation exercise

## There's only one way to ruin a good plan and that's to put it into practice.

Over the last few weeks, I've gone in cold on a DigitalLabs-style project, documented and laid out on Trello. It was put designed quickly in December 2017 as an exemplar to show some of the most regular elements of the toolchain here, including

* Restlet
* Angular
* Ionic
* GitHub

The aim was two-fold; first, to confirm the planning and documentation model was suitable for this purpose - to hand it over to someone without any prior exposure and for it to be realised - and second, to identify any flaws in the design and methodology before rolling it out on a wider basis.

## In at the deep end - filling in the things so obvious they weren't worth writing down

Pulling down the repository is a good first step. Running the application is clearly the next good step. There's a set of HTML-and-related documents, which should just neatly drag-and-drop into a browser window?

Well, no. It's an Angular application, which is built on a wild stack of JavaScript and HTML templating - it's like a web page held together with  JavaScript HTTP requests. Luckily, NodeJS comes with an easy-to-deploy HTTP server - `http-server` - which can be run from a command line and feeds out a directory tree as though it were sat behind a properly-managed HTTP server.

However, this only gets us so far. The project's first implementation tasks, after setting up the file system layout and elements, is to implement the core services the application will depend on, which talk to [Restlet](https://restlet.com/). Checking our JavaScript console, and operating in our security-minded online space, every single XHR request is denied by the browser - we need to host our development documents somewhere they can be served over SSL. `http-server` to the rescue! We need to create a self-signed certificate, which thankfully [someone on stackoverflow walks us through](https://stackoverflow.com/a/10176685), and then restart `http-server` to use these keys. 

From our project's `www` directory, we run

`mkdir ../../ssl-keys-testing`
`openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout ../../ssl-keys-testing/key.pem -out ../../ssl-keys-testing/cert.pem`

… answering a number of easy questions to generate your unauthenticated secure certificate.

To fire up a HTTPS server on localhost using the keys you created, just run `http-server` with the following command line (again, operating from the project `www` directory)

`http-server -o -c-1 -S -C ../../ssl-keys-testing/cert.pem -K ../../ssl-keys-testing/key.pem`

This is a useful technique when developing a platform that uses 3rd party cross-domain APIs for data services, which is the cornerstone of our rapid-development model at DigitalLabs (*unless we're building cordova applications, where a quick `cordova serve` hides all the complexity from us*).

## When you assume, donkey make a me out of u

We're developing an [MVP product](https://en.wikipedia.org/wiki/Minimum_viable_product) - just enough to run and use, without any optimisation or embellishments. This is why we're using tools like Restlet to design data storage and generate the APIs to talk to them. [Restlet even generates Angular-friendly code](https://restlet.com/modules/studio/) to drop directly into the project, which makes everything effortless.

Authentication became a little messy, however, which were needed by POST methods for creating objects in the data store. The Restlet documentation was a little thin on the ground and had suffered from [linkrot](https://en.wikipedia.org/wiki/Link_rot) so it took some hunting to locate the authentication information. At first, I assumed this would be the same as the account credentials for the web version, but it seems to be tucked away under the *Restlet Cloud* Account→Overview menu, as *Username* and *Secret Key*.

Out of paranoia that I'd need to put secret keys on the public web (or at least, in a Git repository exposed to the public) I put these keys in a separate file that was included in the Angular application and would set them as properties of the `window.` object, and add the file to the `.gitignore` list, so it would not join the repository; in the end, this was unnecessary as the credentials didn't expose anything important, and the file would have to enter the `docs` tree *anyway* to be published to GitHub pages.

### Convergent Terminology

The downside of using platform-as-a-service services as platforms is the overhead of unifying terminology. Descriptions of things and [services placed in the Trello Design board](https://trello.com/c/KOPeRLUa) didn't always correspond with how things were recorded at Restlet, creating a little ambiguity and - at least at first - causing a pause when moving across systems, to be sure the same things were being worked with. 

### Trellolololololololooooolo

DigitalLabs uses Trello as a vast set of interconnected hypermedia, linking cards defining [User Stories](https://trello.com/b/NE72yJ87/userstories) to their realisation in a [Design](https://trello.com/b/MLSRKRu2/design), breaking down the necessary [Features](https://trello.com/b/kt11GZlL/features) into [Discussions](https://trello.com/b/MBuUGKPx/discussions) and [Investigations](https://trello.com/b/QxX9dY1H/investigations), which ultimately leads to [Tasks](https://trello.com/b/QmXNmJnk/tasks) to implement.  

TheUrbanWild was delivered as a fully-realised set of boards, which broke down the whole functionality and design into discrete nuggets. Whilst this is incredibly useful and one of the only ways to organise this with teams, I felt a high-level overview of what the system was trying to do was missing; I could see distinct *flows* and what parts of a system would need producing (and from what) to realise it, but I sometimes couldn't see the thinking behind the system as a *whole*. Whilst this became evident as the implementation progressed, it could have reduced a few missteps on the way there by providing greater clarity behind some of the design decisions, and why they were the way they were.

## The unknown unknowns

Back in the old days, the world's most dangerous man was Donald Rumsfeld; what made him evil was deliberate behaviour, unlike modern  evil, which is permatanned-brownean motions of evil in an increasingly shrinking medium. While justifying sending future generations into a programme of mass slaughter at a distance for which he would never be held accountable, he did deliver one gem of wisdom: [that there are known knowns, known unknowns, but that the unknown unknowns were the true random factors involved in any programme](https://en.wikipedia.org/wiki/There_are_known_knowns), whether developing software or unleashing genocide on civilians. 

Sometimes these problems don't reveal themselves until there are enough operational parts to make the presumptions explicit - which is part of the *point* of implementing an MVP, making it clear where the issues are and possible to orient the project around these issues before they become intractable problems. With this caveat, the following are issues of this nature that implementation revealed.

### Just how many *species* there are!

To avoid free-form text entry for users (who, at some stage, will end up '*spotting*' a range of profanities, ugg boots adverts, and attempts at normalisation of fascist beliefs), we instead cross-reference with a 3rd party service and implement type-ahead autocompletion for matching candidates, ensuring that people can *only* spot species that are recognised by an authoritative source, namely [ITIS](https://www.itis.gov), the Integrated Taxonomic Information System, provided by the US government. ITIS provides an [API](https://www.itis.gov/ws_description.html) which can be used to suggest a list of species matching a provided text candidate.

What we didn't anticipate was how *many* species ITIS knows about, and the depth of information it has on each. Only when we started sending queries to it did we see the range of results, that some had language properties, and some results included both latinate species names as well as variations on common names. Without serious investigatory work, sometimes we'd be presented with a number of possible candidates that all *looked* the same, but would end in tears when presented to the general public without explanation. Sometimes, the things it returned would match on the species name, but show a common name that did not match in any way, which would cause some confusion.  

For example, these three species were returned in one result set: are they three distinct species or the same one, with only whitespace, capitalisation and attribution the variation?

1. DeKay's Brownsnake
2. Brown Snake
3. Dekay's Brown Snake

Only when you start using something are your presumptions exposed for all to see. For our MVP, we left this as a taxonomic exercise for the user.

### Property names speak as much as well-documented code

We tend not to think of it consciously, but property names are incredibly important. They tell of the perspective of the flow of data, their roles in invocations and explain the models they represent and relationships within them. Good variable and property names intuitively reflect what their roles are and augment and shape function signatures; they're the first-line of documentation in code.

In implementing the Urban Wild, sometimes distinct parts of the used slightly different language. This is understandable, as only through implementation do the names and terminology of the distinct parts become clear. This was sharpest in the interfaces between different systems, so while the browser has a location exposed in the properties `coords.latitude` and `coords.longitude`, leaflet has 'latlng.lat' and 'latlng.lng'. The scaffolding and test code for the implementation used `.lat` and `.long` as well, just to layer something half-way between one and the other. The system internally had three variations of *naming* the same data over four distinct elements.

 Property *(in English)*|Browser  |Postcodes.io  |Leaflet|Skeleton Implementation
 :--------------------|----------|-------------|-------|------------------------
 Latitude             |`.latitude` |`.latitude`    |`.lat`   |`.lat`
 Longitude            |`.longitude`|`.longitude`   |`.lng`   |`.long`

Whilst not wildly different, this incurs a certain amount of cognitive overhead and occasional rename-and-retry cycles where there was a `.longitude` where a `.lng` was needed; it added *friction* to what could have been a seamless and intuitive series of data exchanges, causing double-checks to take place that would not have been necessary had the properties been identically named and taking the developer *out of the zone*. This inevitably happens when connecting systems developed independently over which there is no control. 

Some other naming variations took place, which caused me to have to stop and think from time to time whilst implementing the system; were *sightings* and *events* the same thing? (...they were). The most complex, however, was the data returned by ITIS; not because it was *inconsisent*, but because of how incredibly *comprehensive* it was. Analysing this data exposed many of the shortcomings in our assumptions around how straightforward getting useful results from this data source would be, and opened up the second order questions we didn't realise we needed to address in our species name suggestion service.

### Postcodes *seem* to provide a nice granular grid... don't they?

Due to limitations in the queries that Heroku can operate (it looks a *little* like a DBMS-over-HTTP, but lacks comparison feature), a decision was made to quantise all location information to a postcode-based grid for storage purposes. This way, we could at least ask for all sightings in a postcode, (we could *not* ask for all sightings within an arbitrary geofenced region due to not having comparisons or geographic support in Restlet's API)

[Postcodes.io](https://postcodes.io) provides a free tier of usage for roundtripping latitude/longitude locations to postcodes, and back again, which seemed to be an ideal way to manage this otherwise expensive transformation process. We could implement all our data storage and lookup using free, externally-provided services - at least at the levels of usage we'd anticipate for a MVP.

The browser provides latitude/longitude information (if the user permits) and we convert this into a postcode when logging an item, ensuring the user is *in situ* when adding a sighting to the system. We also use this when initialising a view, turning the location into a postcode then querying the Heroku store for sightings at that location. All this works delightfully and cleanly, exactly as planned.

The devil, as always, is in the details, hiding a world of complexity and presumptions into a few innocent words. "[When the map changes scale or pans, or when the date pickers are changed, a new data process is started, and the map re-populated](https://trello.com/c/0c2xkGvN)". Identifying the geographic centroid and extent of the map is straightforward and provided by the running [Leaflet](https://leafletjs.com) instance - turning this into a set of postcodes, however, is a little hairier, despite seeming to be a straightforward lookup task for the Postcodes.io API.

At the free tier, there's a limit of 10 postcodes returned in response to a latitude/longitude lookup, and a they are within a maximum range of 2km. In an dense urban environment, this rapidly reaches a point at which the result set limit is saturated, making the follow-on query - finding the sightings at each postcode for plotting on a map - report there is nothing on the map, when in fact it can't even report the postcode set on the map in full. It's easy to accidentally zoom out to show a whole county or nation, at which stage - understandably - the postcode service will *not* return the set of all postcodes in the UK.

For our MVP, we don't keep state, simply using external services (Restlet and Postcodes.io) as though they were a local datasource - Angular, JavaScript and Swagger make this happen seamlessly, assuming you consider asynchronous data to not be a seam. In hindsight, this needs redesigning to build and maintain a local cache as a couple of [AngularJS services](https://docs.angularjs.org/guide/services), not just for performance reasons, but to deal with the ways the system will be used. As the map usage will likely involve looking at a localised region at multiple resolutions (as opposed to looking at a wide number of geographically disparate locations), it makes sense to cache the data  which maps locations to postcodes, and sightings at locations. The biggest benefit would be to work around the result cap limitations of the Postcodes.io service and mitigate the increasing number of lookups required to turn each sighting into a located and human-readable *species* popup on the map.

## Those things we're *glad* are no longer unknown

There are some positive aspects to this development methodology and toolchain, however. 

Trello makes a good '*single point of truth*' for the planning process, and a neat way to distill down to a [set of tasks for implementation in a structured order](https://trello.com/b/QmXNmJnk/tasks), which was the basis around which this implementation exercise was undertaken.

AngularJS is a well-designed and quick platform to work with, and the browser/JavaScript combination provides an incredibly rich and interactive development environment. AngularJS - we've stuck with the first version, for a number of reasons - provides a huge number of well developed component libraries, and has an extensive and open community of people who run into the same bugs and shortcomings *as you have* when dealing with issues in these extensions.

JavaScript's array methods .map, .reduce, and .filter were invaluable in distilling API responses down into the shape and structure our implementation wanted. This was particularly evident when working with ITIS's results, where species names were tucked inside objects inside arrays inside objects *ad nauseam*; a few nested `maps` and `reduces` whittled the data down to its essence in a fraction of the code loops would have demanded, even if they made debugging a little messier. To this end, a few 3rd party applications made this easier, from a desktop REST client which pretty-printed JSON responses to lightweight IDEs that provided [REPL](https://en.wikipedia.org/wiki/Read–eval–print_loop) interfaces for developing data distillation code (the JavaScript console in most browsers supports this, but sometimes something with a little more heft is useful).

HTML5 and CSS3 are an astounding combination. There are some incredibly useful features, like being able to specify animation and transformations as pure CSS,  making it possible to have loading spinners and feedback boxes without any code executing - and making it easy to re-use elements at a very high level. 

Finally, wireframes. Our original planner produced a number of treatments in [Pencil](http://pencil.evolus.vn), which provided the best version of a high-level overview; my only real complaint with them was that there weren't nearly *enough* of them to make the range of usage scenarios explicit. Annotations are extremely important with explanatory wireframes, making it clear a button isn't clickable because of an application state (as opposed to that branch of wireframe treatment hadn't, or wouldn't, be handled!).

Try the first iteration out at [Github Pages](https://theurbanwild.github.io/WildLogging/), view the boards at [Trello](https://trello.com/theurbanwild1), and see the code implementation at [github](https://github.com/TheUrbanWild/WildLogging).