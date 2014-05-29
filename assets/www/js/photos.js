
var currentPhoto 	= null;
var latitude 		= null;
var longitude 		= null;
var altitude 		= null;
var watchID 		= null;

function onPhotosLoad() {
	navigator.camera.getPicture(onPhotoLoadSuccess, onFail, {
		quality : 50,
		encodingType : Camera.EncodingType.JPEG,
		destinationType : navigator.camera.DestinationType.FILE_URI,
		sourceType: navigator.camera.PictureSourceType.CAMERA
	});
	isTypeOf = 1;
}

function onPhotoLoadSuccess(photoUri) {
	// store current photo for saving later
	currentPhoto = photoUri;
	getLocation();
}

function getLocation(){
	var options = { maximumAge : 3000, timeout: 5000, enableHighAccuracy: true };
	navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
	//watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
}

function onFail(message) {
	alert('Error : ' + message);
}

function savePhoto() {

	if (currentPhoto == null) {
		alert("Debe tomar foto primero");
		return;
	}

	//$.mobile.showPageLoadingMsg();
	$.mobile.changePage("#page5",{transition : 'slide'});
	$("#mensajeTxt").val("<b>Enviado Datos...</b>");
	var uploadOptions = new FileUploadOptions();
	uploadOptions.fileKey = "file";
	uploadOptions.fileName = currentPhoto.substr(currentPhoto.lastIndexOf('/') + 1);
	//uploadOptions.mimeType = "image/png";
	uploadOptions.mimeType="image/jpeg";
	uploadOptions.chunkedMode = false;
	var wait = 33;
	if(latitude === null || longitude === null){
		//getLocation();
		wait = 5000;
	}

	//setTimeout(function() {
		var params = {
				descripcion	: $("#descripciontxt").val(),
				latitude	: latitude,
				longitude	: longitude,
				altitude	: altitude,
				obra        : window.id_obra,
				tipo 		: isTypeOf
			  };
		
		uploadOptions.params = params;

		var fileTransfer = new FileTransfer();
		// Be sure to update the URL below to your site
		fileTransfer.upload(currentPhoto,
							"http://controlviewsystem.com/controlview/api/obra/registrar",
							uploadSuccess,
							uploadFail,
							uploadOptions);

	//}, wait);
}

function uploadSuccess(result) {
	var jsno = JSON.parse(result.response);
	//$.mobile.hidePageLoadingMsg();
	if (jsno.success == 1) {
		navigator.notification.vibrate(500);
		navigator.notification.beep(2);
		alert("Registro de posicion exitoso");
		currentPhoto = null;
		loaded = false;
		$("#descripciontxt").val("");
		$("#mensajeTxt").val("<b>Datos Enviados</b>");
	}else{
		alert('La obra ha sido finalizada')
	}
}

function uploadFail(error) {
	//$.mobile.hidePageLoadingMsg();
	$("#mensajeTxt").val("<b>Datos No Enviados</b>");
	alert("Error uploading file: " + error.code);
}

function onSuccess(position) {
   	latitude = position.coords.latitude;
	longitude = position.coords.longitude;
	altitude = position.coords.altitude;
};

// onError Callback receives a PositionError object
//
function onError(error) {
	$.mobile.hidePageLoadingMsg();
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

