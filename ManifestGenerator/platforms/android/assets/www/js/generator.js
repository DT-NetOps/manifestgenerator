//app initialization
var myApp = new Framework7({
    modalTitle: 'Manifest Generator',
    template7Pages: true
});

//map initialization
document.addEventListener('deviceready', function() {
	var map = plugin.google.maps.Map.getMap();
	map.addEventListener(plugin.google.maps.event.MAP_READY, onMapInit);
	cordova.plugins.email.addAlias('gmail', 'com.google.android.gm');
}, false);

function onMapInit(map) {}

//exports selector engine for dynamic popups
var $$ = Dom7;

//adds main view
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true, 
    domCache: true
});

//loads client data from LS, if empty then creates new table
var clientData = localStorage.persistentData ? JSON.parse(localStorage.persistentData) : [];

//adds open-client on click to the app with popup-client for the new client
$$('.open-client').on('click', function () {
  myApp.popup('.popup-client');
});

//adds popup-client on open to the with-popup into the body for the new client
$$('.popup-client').on('open', function () {
    $$('body').addClass('with-popup');
});

//calls client input and sets focus after popup initialization
$$('.popup-client').on('opened', function () {
    $$(this).find('input[name="firstname"]').focus();
});

//cleans popup-client after close
$$('.popup-client').on('close', function () {
    $$('body').removeClass('with-popup');
    $$(this).find('input[name="firstname"]').blur().val('');
    $$(this).find('input[name="surname"]').blur().val('');
    $$(this).find('input[name="email"]').blur().val('');
    $$(this).find('input[name="phone"]').blur().val('');
    $$(this).find('input[name="address1"]').blur().val('');
    $$(this).find('input[name="address2"]').blur().val('');
    $$(this).find('input[name="address3"]').blur().val('');
    $$(this).find('input[name="address4"]').blur().val('');
    $$(this).find('input[name="address5"]').blur().val('');
    $$(this).find('input[name="comments"]').blur().val('');
});

//adds popup-container on open to the with-popup into the body for new container
$$('.popup-container').on('open', function () {
    $$('body').addClass('with-popup');
});

//calls popup-container on open for new container, binds listeners and sets focus
$$('.popup-container').on('opened', function () {
    $$(this).find('input[name="containerid"]').focus();
	var popup = $$(this);
	$$('.scan-id').on('click', function () {
		cordova.plugins.barcodeScanner.scan(
			function (result) {
				if (!result.cancelled){
					popup.find('input[name="containerid"]').blur().val(result.text);
					console.log("scaned barcode " + result.text);
				}
				//alert("We got a barcode\n" + "Result: " + result.text + "\n" + "Format: " + result.format + "\n" + "Cancelled: " + result.cancelled);
			}, 
			function (error) {
				alert("Scanning failed: " + error);
			}
		);
		//popup.find('input[name="containerid"]').blur().val('344543334');
		console.log("scanid click");
	});
});

//clears popup-container after close
$$('.popup-container').on('close', function () {
    $$('body').removeClass('with-popup');
    $$(this).find('input[name="containerid"]').blur().val('');
    $$(this).find('input[name="location1"]').blur().val('');
    $$(this).find('input[name="location2"]').blur().val('');
    $$(this).find('input[name="comments"]').blur().val('');
});

//adds new client to popup via add-client button
$$('.popup .add-client').on('click', function () {
    var firstname = $$('.popup input[name="firstname"]').val().trim();
    if (firstname.length === 0) {
        return;
    }
    var surname = $$('.popup input[name="surname"]').val().trim();
    if (surname.length === 0) {
        return;
    }
    
    var email = $$('.popup input[name="email"]').val().trim();
    if (email.length === 0) {
        return;
    }
    
    var phone = $$('.popup input[name="phone"]').val().trim();
    if (phone.length === 0) {
        return;
    }
    
    var address1 = $$('.popup input[name="address1"]').val().trim();
    if (address1.length === 0) {
        return;
    }
    
    var address2 = $$('.popup input[name="address2"]').val().trim();
    var address3 = $$('.popup input[name="address3"]').val().trim();
    var address4 = $$('.popup input[name="address4"]').val().trim();
    var address5 = $$('.popup input[name="address5"]').val().trim();
    var comments = $$('.popup input[name="comments"]').val().trim();
    
	//adds object to table
    clientData.push({
		firstname: firstname,
		surname: surname,
		email: email,
		phone: phone,
		address1: address1,
		address2: address2,
		address3: address3,
		address4: address4,
		address5: address5,
		comments: comments,
		id: (new Date()).getTime(),
		containers: []
    });
	
	//saves client data to table
    localStorage.persistentData = JSON.stringify(clientData);
	
	//displays updated list of clients
    buildClientListHtml();
	
	//closes popup-client for the app
    myApp.closeModal('.popup-client');
});

//adds new container
$$('.popup .add-container').on('click', function () {
	
	//gets client id
    var clientid = $$('input[name="clientid"]').val() * 1;
    
	//gets input for container id
    var containerid = $$('.popup input[name="containerid"]').val().trim();
    if (containerid.length === 0) {
        return;
    }
	
    var location1 = $$('.popup input[name="location1"]').val().trim();   
    var location2 = $$('.popup input[name="location2"]').val().trim();
    var comments = $$('.popup input[name="comments"]').val().trim();
    
    for (var i = 0; i < clientData.length; i++) {
        if (clientData[i].id === clientid){
			
			if (clientData[i].containers  === undefined)
				clientData[i].containers = [];
			
			//adds container to the client data
			clientData[i].containers.push({
				containerid: containerid,
				location1: location1,
				location2: location2,
				comments: comments,
				items: []
			});
			
			//displays updated list of containers for the client
			buildContainerListHtml(clientData[i].containers);
        } 
    }
    
	//saves table of objects to LS
    localStorage.persistentData = JSON.stringify(clientData);
    myApp.closeModal('.popup-container');
});

//loads template of id element for client-item-template
var clientItemTemplateSource = $$('#client-item-template').html();
var clientItemTemplate = Template7.compile(clientItemTemplateSource);
function buildClientListHtml() {
	
	//displays list of clients in the client-items-list
    var renderedList = clientItemTemplate(clientData);
    $$('.client-items-list').html(renderedList);
}

//by default it displays updated list of clients
buildClientListHtml();

//displays list of updated containers in the container-item-template
var containerItemTemplateSource = $$('#container-item-template').html();
var containerItemTemplate = Template7.compile(containerItemTemplateSource);
function buildContainerListHtml(containerData) {
    var renderedList = containerItemTemplate(containerData);
    $$('.container-items-list').html(renderedList);
}

//displays list of containers during the pdf generation in the container-pdf-item-template
var containerPdfItemTemplateSource = $$('#container-pdf-item-template').html();
var containerPdfItemTemplate = Template7.compile(containerPdfItemTemplateSource);
function buildContainerPDFListHtml(containerData) {
    var renderedList = containerPdfItemTemplate(containerData);
    $$('.container-pdf-items-list').html(renderedList);
}

//displays updated list of items in the item-item-template
var itemItemTemplateSource = $$('#item-item-template').html();
var itemItemTemplate = Template7.compile(itemItemTemplateSource);
function buildItemsListHtml(itemData) {
    console.log(itemData);
    var renderedList = itemItemTemplate(itemData);
    $$('.items-items-list').html(renderedList);
}

//opens send pdf and loads context for client data via router in the pdfPageTemplate
function openSendPDF(clientid) {
	console.log("openSendPDF"+clientid);
	for (var i = 0; i < clientData.length; i++) {
        if (clientData[i].id === clientid){
            var compiledTemplate = Template7.compile($$('#pdfPageTemplate').html());
            var context = clientData[i];
			context.containersqty = context.containers.length;
			context.itemsqty = countClientItems(context);
            var html = compiledTemplate(context);
            mainView.router.loadContent(html);
		}
		buildContainerPDFListHtml(context.containers);
		$$('.send-pdf').on('click', function () {
			generatePDF(context);
		});
		
	}
}

//sends pdf to email as attachment
function sendPDF(email, attachment) {

	console.log(attachment);
	cordova.plugins.email.open({
		to:      email,
		subject: "Generated report",
		body:    "Generated report",
		isHtml:  false,
		attachments: attachment
	}, function () {}
	);

}

//generates pdf for each client
function generatePDF(client) {
	console.log("generatePDF");
	
	//checks the checkbox
	var val = $$('input[name="acknowledge"]').prop('checked');
	
	//initializes pdf and defines its structure
	if (!val)
		return;
	var doc = new jsPDF();
	
	var marigin_left = 15;
	var pos_top = 10;
	doc.setFontStyle("bold");
	doc.text(marigin_left, pos_top, client.firstname + " " + client.surname);
	doc.setFontStyle("normal");
	pos_top = nextPDFLine(doc, pos_top);
	doc.text(marigin_left, pos_top, client.email);
	pos_top = nextPDFLine(doc, pos_top);
	doc.text(marigin_left, pos_top, client.phone);
	pos_top = nextPDFLine(doc, pos_top);
	doc.text(marigin_left, pos_top, client.address1);
	pos_top = nextPDFLine(doc, pos_top);
	if (client.address2){
		doc.text(marigin_left, pos_top, client.address2);
		pos_top = nextPDFLine(doc, pos_top);
	}
	if (client.address3){
		doc.text(marigin_left, pos_top, client.address3);
		pos_top = nextPDFLine(doc, pos_top);
	}
	if (client.address4){
		doc.text(marigin_left, pos_top, client.address4);
		pos_top = nextPDFLine(doc, pos_top);
	}
	if (client.address5){
		doc.text(marigin_left, pos_top, client.address5);
		pos_top = nextPDFLine(doc, pos_top);
	}
	if (client.comments){
		doc.text(marigin_left, pos_top, client.comments);
		pos_top = nextPDFLine(doc, pos_top);
	}
	doc.text(marigin_left, pos_top, "Containers");
	pos_top = nextPDFLine(doc, pos_top);
	
	pos_top = nextPDFLine(doc, pos_top);
	for (var i=0; i < client.containers.length; i++){
		pos_top = addContainerToPDF(doc, client.containers[i], marigin_left+10, pos_top);
		pos_top = nextPDFLine(doc, pos_top);
		pos_top = nextPDFLine(doc, pos_top);
	}
	
	
	doc.text(marigin_left, pos_top, "Container(s) QTY:"+client.containers.length);
	pos_top = nextPDFLine(doc, pos_top);
	doc.text(marigin_left, pos_top, "Item(s) QTY:"+countClientItems(client));
	pos_top = nextPDFLine(doc, pos_top);	
	
	var pdfOutput = doc.output();
	var uristring = doc.output('datauristring');
	var uristringparts = uristring.split(',');
	uristringparts[0] = "base64:" + escape('raport.pdf') + "//";

	var moddeduristring =  uristringparts.join("");


	sendPDF(client.email, moddeduristring);
}

//adds container to pdf
function addContainerToPDF(doc, container, marigin_left, pos_top){
	doc.setFontStyle("bold");
	doc.text(marigin_left, pos_top, container.containerid);
	pos_top = nextPDFLine(doc, pos_top);
	doc.setFontStyle("normal");
	if (container.location1){
		doc.text(marigin_left, pos_top, container.location1);
		pos_top = nextPDFLine(doc, pos_top);
	}
	if (container.location2){
		doc.text(marigin_left, pos_top, container.location2);
		pos_top = nextPDFLine(doc, pos_top);
	}
	if (container.comment){
		doc.text(marigin_left, pos_top, container.comment);
		pos_top = nextPDFLine(doc, pos_top);
	}
	doc.text(marigin_left, pos_top, "Items:");
	pos_top = nextPDFLine(doc, pos_top);
	pos_top = addItemsToPDF(doc, container, marigin_left+10, pos_top);
	return pos_top;
}

//adds items to pdf
function addItemsToPDF(doc, container, marigin_left, pos_top){
	for (var i = 0; i < container.items.length; i++){
		doc.text(marigin_left, pos_top, container.items[i]);
		pos_top = nextPDFLine(doc, pos_top);
	}
	return pos_top;
}

//moves to next line in pdf or it adds next page
function nextPDFLine(doc, pos_top){
	pos_top += 10;
	if (pos_top>250){
		doc.addPage();
		pos_top = 10;
	}
	return pos_top;
}

//returns count of items for the client
function countClientItems(client){
	var ret = 0;
	for (var i = 0; i < client.containers.length; i++){
		ret = ret + client.containers[i].items.length;
	}
	return ret;
}

//shows the route to the client location on Google Maps
function showClientLocation(clientid){
	console.log("showClientLocation");
	var map = plugin.google.maps.Map.getMap();
	var myLocation = null;
	
	var to = null;
	for (var i = 0; i < clientData.length; i++) {
		if (clientData[i].id === clientid){
			to = clientData[i].address1
			if (clientData[i].address2)
				to = to + ", " + clientData[i].address2;
			if (clientData[i].address3)
				to = to + ", " + clientData[i].address3;
			if (clientData[i].address4)
				to = to + ", " + clientData[i].address4;
			if (clientData[i].address5)
				to = to + ", " + clientData[i].address5;
		}
	}
	console.log(myLocation);
	console.log(to);
	
	
	map.getMyLocation(function(location) {
		console.log("getMyLocation");
		myLocation = location.latLng;
		plugin.google.maps.external.launchNavigation({
			"from": myLocation,
			"to": to
		});
	});
}

//displays the client view in the clientPageTemplate
function createClientPage(client){
	var compiledTemplate = Template7.compile($$('#clientPageTemplate').html());
	var context = client;
	var html = compiledTemplate(context);
	mainView.router.loadContent(html);
	
	//binds event listeners
	$$('.open-container').on('click', function () {
		myApp.popup('.popup-container');
	});
	
	$$('.open-client').on('click', function () {
		myApp.popup('.');
	});
	
	$$('.open-send').on('click', function () {
		console.log("open send");
		var clientid = $$('input[name="clientid"]').val() * 1;
		openSendPDF(clientid);
	});
	
	$$('.show-client-location').on('click', function () {
		console.log("show location");
		var clientid = $$('input[name="clientid"]').val() * 1;
		showClientLocation(clientid);
	});
	
	//displays list of containers
	buildContainerListHtml(client.containers);
	$$('.container-items-list').on('click', '.item-inner', function () {
		var input = $$(this);
		openContainer(input);		
	});
}

//displays the view for the containers
function openContainer(input){
	var clientid = $$('input[name="clientid"]').val() * 1;
	console.log("container-items-list " + clientid);
	
	var item = input.parents('li');
	var containerid = item.attr('data-id');
	console.log("container-items-list " + containerid);
	for (var i = 0; i < clientData.length; i++) {
		if (clientData[i].id === clientid){
			var clientindex = i;
			console.log("client found ");
			for (var i2 = 0; i2 < clientData[i].containers.length; i2++) {
				console.log("container "+clientData[i].containers[i2].containerid);
				if (clientData[i].containers[i2].containerid === containerid){
					var containerindex = i2;
					var compiledTemplate = Template7.compile($$('#containerPageTemplate').html());
					var context = {
						clientid: clientid,
						containerid: containerid, 
						location1: clientData[i].containers[i2].location1,
						location2: clientData[i].containers[i2].location2,
						comments: clientData[i].containers[i2].comments,
					};
					var html = compiledTemplate(context);
					mainView.router.loadContent(html);
					$$('.open-item').on('click', function () {
						addItem(clientindex, containerindex);							
					});
					buildItemsListHtml(clientData[i].containers[i2].items);
				}
			}			
		}      
	}
}

//adds item
function addItem(clientindex, containerindex){
	
	cordova.plugins.barcodeScanner.scan(
		function (result) {
			if (!result.cancelled){
				clientData[clientindex].containers[containerindex].items.push(result.text);
				buildItemsListHtml(clientData[clientindex].containers[containerindex].items);
				localStorage.persistentData = JSON.stringify(clientData);
			}
			//alert("We got a barcode\n" + "Result: " + result.text + "\n" + "Format: " + result.format + "\n" + "Cancelled: " + result.cancelled);
		}, 
		function (error) {
			alert("Scanning failed: " + error);
		}
	);	
}

//runs on click in client-items-list from client list
$$('.client-items-list').on('click', '.item-inner', function () {
  
    var input = $$(this);
    var item = input.parents('li');
    var id = item.attr('data-id') * 1;
    for (var i = 0; i < clientData.length; i++) {
        if (clientData[i].id === id){
            createClientPage(clientData[i]);
        }      
    }
});

//removes data-id attribute on delete with swipeout in client-item-template, container-item-template and container-pdf-item-template
$$('.client-items-list').on('delete', '.swipeout', function () {
    var id = $$(this).attr('data-id') * 1;
    var index;
    for (var i = 0; i < clientData.length; i++) {
        if (clientData[i].id === id) index = i;
    }
    if (typeof(index) !== 'undefined') {
        clientData.splice(index, 1);
        localStorage.persistentData = JSON.stringify(clientData);
    }
});