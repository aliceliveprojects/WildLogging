# Serving working directory as HTTPS

### Software required

You will need 

* [OpenSSL](https://github.com/openssl/openssl). 
	* Prebuilt binaries are listed on the [OpenSSL Wiki](https://wiki.openssl.org/index.php/Binaries). 
		* MacOS binaries are pre-installed.
		* Linux binaries can be installed using `apt-get install openssl` or your system's package manager.
		* Windows binaries are [available from a community site](https://indy.fulgan.com/SSL/).
* [http-server](https://www.npmjs.com/package/http-server)
	* Build on NodeJS and installable through `npm`
		* `npm install http-server -g` (global installation, for all users)
			* (If this fails, you may need to run the command again as the root user - `sudo !!`)
		* alternately, `npm install http-server` for your *local* user account. 

### Directory layout

## Process

### Set the right starting path

This will all be relative to the `www` directory of your project; if you set your current working directory to this location, all the commands can be copy-and-pasted.

The project layout looks like the following:

```
├── investigations
├── production
├── ssl-keys-testing
└── your-project-name
    └── www
        ├── css
        ├── img
        ├── lib
        │   ├── angular
        │   ├── angular-ui-notification
        │   ├── angular-ui-router
        │   ├── angularjs-toaster
        │   ├── bootstrap
        │   ├── fonts
        │   ├── leaflet
        │   ├── leaflet.markercluster
        │   ├── ng-datalist
        │   └── theurbanwild.restlet
        └── scripts
            ├── directives
            ├── services
            └── states
```
The keys will be stored in a directory *above* your `www` directory, as a sibling of your project root directory.

### Create directory for the keys

Ensuring you are in your project `www` directory, issue the following command:

`mkdir ../../ssl-keys-testing` 

You can confirm this by performing `ls ../../`

### Create the keys

Again, from the project `www` directory, issues the open SSL key generation commands:

`openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout ../../ssl-keys-testing/key.pem -out ../../ssl-keys-testing/cert.pem`

You will be asked a number of questions. The answers don't really matter and won't be checked, but can help confirm you've not suffered an attack on your machine.

Some suggested answers:

Question          | Answer
------------------|-----------
Country Name      | GB
Locality Name     | Manchester
Organisation Name | MMU
Organisation Unit Name | *Your project team name*
Common Name | localhost
Email address | *your user name*@localhost

This creates two files, `key.pem` and `cert.pem` in the `ssl-keys-testing` directory.

### Start the server

From the `www` directory again, and with the certificate key files created, run the following command:

`http-server -o -c-1 -S -C ../../ssl-keys-testing/cert.pem -K ../../ssl-keys-testing/key.pem`

If you get an error like the following, check you do not have another process using port `8080` on your machine

```
events.js:160
      throw er; // Unhandled 'error' event
      ^

Error: listen EADDRINUSE 0.0.0.0:8080
```

You should have a browser launch on success, but the URL it visits may be mangled - in which case, enter the address `https://localhost:8080/` to ensure you are looking at your document root.

#### Using alternative ports

If you add a `-p` flag to the command, you can specify an alternative port to use, should `8080` be in use. A port higher than `1000` is recommended.

For example, to start the HTTP server listening on port `1234`, use the command

`http-server `**`-p 1234`**` -c-1 -S -C ../../ssl-keys-testing/cert.pem -K ../../ssl-keys-testing/key.pem`

### Stopping the server

In the terminal, press the `CTRL` and `C` keys together to end the server and return the shell to its interactive state.
