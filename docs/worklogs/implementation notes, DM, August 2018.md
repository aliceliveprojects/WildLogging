# Notes on the Urban Wild 

## WildLogging application

There's only boilerplate documentation in here.

No mention of how to run the system - this is presumed by an ionic/angular tag-team

- okay, so it's just static files served from a HTTP server 

- go into www folder
- `http-server .'
- (browse to [localhost:8080](http://localhost:8080/))

- map - hard to find how to get there, but probably because home pages etc are blank
- buttons on map do not work
- not sure if the map is not showing anything because of a bug, or because there is nothing to show in the online data source
- looks like there's no way to add anything to the map either


- don't forget any comments will be publicly visible as part of the basic app

2018-07-26 11:24

[API Module](https://trello.com/c/QBoB8Axu/5-025-api-module) - presumption of knowledge of what 'structure' means. I'm assuming it means lay out boilerplate code and hook in to the HTML wrapper for the application, which I did.

useful command: 
`http-server -o -c-1` (opens a server from a directory and serves content, the -c-1 is critical: otherwise it caches content. this tripped me up.)

Issue: Many service calls depend on the test server running SSL. The `-S` parameter will enable SSL, but we need to create keys and certificates for this.

`mkdir ../../ssl-keys-testing` (from `www` folder)

~~`ssl genrsa -des3 -out ../../ssl-keys-testing/localhost.key 1024` (then `1234` for passphrase)~~
~~`openssl req -new -key ../../ssl-keys-testing/localhost.key -out ../../ssl-keys-testing/localhost.csr` (then `gb`,`England`, `Manchester`, `MMU`, `Digital Labs`, `localhost`, `digitallabs@mmu.ac.uk`)~~
~~`openssl x509 -req -days 3650 -in ../../ssl-keys-testing/localhost.csr -signkey ../../ssl-keys-testing/localhost.key -out ../../ssl-keys-testing/localhost.crt`~~

`openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout ../../ssl-keys-testing/key.pem -out ../../ssl-keys-testing/cert.pem` 

then run

`http-server -o -c-1 -S -C ../../ssl-keys-testing/cert.pem -K ../../ssl-keys-testing/key.pem`

https://trello.com/c/en5CdmgU/66-locations-service - I'm confused by **throws** here. Throws *what*?!?!

## Restlet security and public repositories

Restlet seems to require an authenticated user account to post data to the API. 

The free tier only allows a single user.

This means exposing Restlet credentials in a public Github repository, which is a no-no. 

The simple work around has been to introduce a file, `credentials.js`, which sets the credentials as part of the window object. This can then be read by the relevant services in Angular. 

The reason this is in a single JS file, isolated from any other content, is so that it can be added to the `.gitignore` list and later abstracted into a service that determines if the file (by way of the properties) is missing, and present some kind of error condition if so. For now, just the git isolation is enough.

The file contents are:

```javascript
window.urbanwildcredentials={
  restlet: {
    "user": "****@gmail.com",
    "pass": "****"
  }
}
```

Okay. Restlet has specified I used a method to authenticate that does not exist.

`theurbanwild.configureGlobalBasicAuthentication(user,pass)` seems to be correct. The `.myApi.configureHttpBasicAuthentication` tells you to use a non-existent method. 

Okay. this is making no sense to me at all. I have wasted most of the day trying to get this to work with restlet. the auto-generated documentation seems to tell me to use methods that don't exist, and I am constantly given error messages about authentication. The documentation on the site is spartan and seems to conflict with the code and exports I have generated from restlet. This is frustrating and creating a major bottleneck.

### Sightings service

so it seems 'sightings' are on Restlet as 'events' (species were 'things'). I could only work this out by matching the method fingerprints in the api.service and module.js against the [Sightings Service Trello card](https://trello.com/c/yVA6jcuW/65-sightings-service).

Maybe some of the terms could coincide better.

Looking at the queries around 'getSightings', I'm struck that there's not standardisation imposed by the database, nor a clear model of data going in. It would make sense for two types of data to be normalised:

* Dates - Epoch integers, rather than as strings (this seems to be the case but is implied in the trello boards, as far as I can see - it's only explicit in restlet studio)
* Postcodes - how best to store these?

There's some mismatch between the signature of `getSightings` as defined in Trello and what's implemented in Restlet.

Restlet has a 'date' field. `getSightings` has a `dateFrom` and `dateTo` field.
Restlet has `lat` and `lon` fields. `getSightings` has neither.

Added a 'sanitisePostcode' hook, which currently does nothing, designed to standardise postcode storage in the database (likely to just remove spaces, capitalise text)

There's some inconsistency in lat/*long* and lat/*lon*. This needs review, but the Restlet API uses *lon* and leaflet and usual mapping interfaces seem to use *long*; the sensible thing would be to change the Restlet definitions, but I'm fearful of this.

## Autocomplete has been a bugger

Postcodes are looking up, being passed back to the controller, but the list isn't appearing; when we hardcode a return in the controller, it appears. This may be to do with promises and the autocomplete list.

The return from the ITIS lookup has been hairy, though. 

The animals being returned sometimes don't match at all - or possibly it's matching part of the latinate name. I rewrote this code, so if the return from `"https://www.itis.gov/ITISWebService/jsonservice/searchForAnyMatch?srchKey=brown`'s .data.anyMatchlist object is assigned to `var x` and the following run on it, 

```javascript
console.log(
	x.anyMatchList.map(function(item,index){
		return(item.commonNameList.commonNames.map(
			function(commonname,indextrose){
				return(commonname.commonName);
			}));
	}) 
	.reduce(function(flat,toFlatten){
		return flat.concat(toFlatten)
	},[])
	.filter(function(name, index, self){
		return( ( name!== null ) && ( index === self.indexOf(name) ) )
	})
);
```

we get a set back, but there's a couple of complications:

'DeKay\'s Brownsnake'
'Brown Snake'
'Dekay\'s Brown Snake`

We also have

'Brown Bear'
'brown bear'

in the list.

Are these the same animals?

---

Home screen:

Validation is provided by the UIB-typeahead's combination of 'ng-required' of 'true' and 'typeahead-editable' of 'false'. This makes `homeForm.species.$valid` false or true (also `homeForm.postcode.$valid`) when something is picked from a list, rather than typed (typing makes it invalid)

### Errors and alerts

Using the 'AngularJS-Toaster', which apparently exists, and isn't a typo from Stuart.

[AngularJS-Toaster](https://github.com/jirikavi/AngularJS-Toaster)

hard to intercept and cancel the click on leaflet clusters - so we just had a hover event instead and let the click expand the child elements

leaflet markers can have arbitrary properties added when creating a marker by adding an argument on creation in an object; these are accessible from the `options` property of the marker.

# Busy spinners

These are implemented as pure CSS and HTML and the parent element simply sets `ng-hide` to watch the busy/show state of each.

# View filters

Issue around date filtering of events; there is no server-side ways to specify > and < with dates, so this implies client-side management, which (realistically) requires a new service to manage this data and the controller to talk to it instead. this may also help if we add a 'postcodes in view' service, which may be messier due to the postcode API not wanting to give us all the postcodes for the UK at once, which could happen in we zoom out enough.