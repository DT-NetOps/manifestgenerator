# manifestgenerator

HYBRID ANDROID APP in CORDOVA

PURPOSE
This is a hybrid application build in Cordova 6.1.1 for Android 5.1.1 platform with list of clients and their details which include container(s) + item(s) based on barcodes scanned with the camera and stored data in the HTML5 local storage.
It allows to create pdf file with all scanned container(s) + item(s), total quantities of each as well as client details such as Name, Address, Email, Phone and Comment which will be send via email.
It also uses Google Maps to locate the client on the map and allow the user to find the route via navigation.

SCREENS
Mobile app will includes screens such as:
1.	Main screen – shows clients, allows adding new customers.
2.	Add Client screen – allows to add client details.
3.	Client Details screen – shows client, its container(s) and details, allows adding new container(s), facilitates use of navigation.
4.	Add Container screen – allows adding container with barcode and its details.
5.	Container details screen – allows to view container details and adding more items with barcode as well as its details.
6.	Report Details screen – displays details of the report and allows sending an email with pdf file.

HTML5
We have used Framework 7 (F7) to design the User Experience (UX) of the hybrid app and to give it an Android native look.
The main approach of F7 is to give a possibility to create iOS and Android with HTML, CSS and JavaScript. It is not compatible with all platforms and it mainly focuses on iOS and Google material design what brings the best quality and simplicity to the project.
http://framework7.io
Selector engine was used to manipulate DOM for dynamic popups of myApp variable in the main view:
http://framework7.io/docs/dom.html
F7 Templates Auto Compilation was used to automatically compile templates to generate the pages and the lists in the script tags with below ids:
•	client-item-template: loads template of id element for swipeout
•	container-item-template: displays list of updated containers
•	container-pdf-item-template: displays list of containers during the pdf generation
•	item-item-template: displays updated list of items
•	clientPageTemplate: displays the client view
•	pdfPageTemplate: loads context for client data
•	containerPageTemplate: displays the view for the containers
http://framework7.io/docs/template7-auto-compilation.html
Router API was used to navigate between below pages:
•	pdfPageTemplate loaded into page view with content for the for the client data
•	clientPageTemplate loaded into page view with content of the client view
•	containerPageTemplate laded into page view with content of the container
http://framework7.io/docs/router-api.html

Library called jsPDF was used as HTML5 client-side solution to generate a PDF file for the report.
https://github.com/MrRio/jsPDF

PLUGINS
Plugins responsible for main functionalities are implemented with native technology via Java classes and these are:
•	Barcode Scanner (ver. 4.1.0) – uses camera to read barcodes for creation of the report, based on ZXing library (phonegap-plugin-barcodescanner).
https://github.com/phonegap/phonegap-plugin-barcodescanner
•	Email Composer (ver. 0.8.3) – allows sending and editing of emails (cordova-plugin-email-composer).
https://github.com/katzer/cordova-plugin-email-composer
•	Google Maps Android SDK v2 (ver. 1.3.9) – facilitates the use of Goole Maps for navigation purposes (plugin.google.maps).
https://github.com/mapsplugin/cordova-plugin-googlemaps
Remaining plugins provide default functionalities of the native app with Cordova acting as a wrapper such as:
•	Cordova Compatibility Plugin (ver. 1.0.0) – provides backward compatibility on permission for plugins to support older versions of Cordova (cordova-plugin-compat).
•	Cordova Console Plugin (ver.1.0.3) – gets JavaScript logs as native logs after deviceready event by defining the global console object (cordova-plugin-console).
•	Cordova Device Plugin (ver.1.1.2) – gets device hardware and software information after deviceready event by defining the global device object (cordova-plugin-device).
•	Cordova File Plugin (ver. 4.2.0) – access to Android file system (cordova-plugin-file).
•	Cordova Network Whitelist Plugin (ver.1.2.2) – implements policy for the access to external sources in the app Webview via whitelist (cordova-plugin-whitelist).
