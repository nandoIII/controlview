
var fileArch = null;

function captureVideo() {
	var options = { limit: 1, mode:'video/3gpp' };
	fileArch = null;
	navigator.device.capture.captureVideo(captureSuccess, captureError, options);
	isTypeOf = 2;
}

function captureSuccess(files) {
	// more than 1 file might be returned
	// so perform a loop and upload all of them
	for (var i = 0; i < files.length; i++) {
		//uploadMediaFile(files[i]);
		fileArch = files[i];
	}
	getLocation();
}

function captureError(error) {
	alert("Error during capture = " + error.code);
}

function uploadMediaFile() {
	if (fileArch == null) {
		alert("Debe tomar un video primero");
		return;
	}
	//$.mobile.showPageLoadingMsg();
	$.mobile.changePage("#page5",{transition : 'slide'});
	$("#mensajeTxt").val("<b>Enviado Datos...</b>");
	var uploadOptions			= new FileUploadOptions();
	uploadOptions.fileKey		= "file";
	uploadOptions.fileName		= fileArch.name;
	uploadOptions.mimeType		="video/3gpp";
	uploadOptions.chunkedMode	= false;

	var params = {
			descripcion	: $("#descripciontxt").val(),
			latitude	:  latitude,
			longitude	: longitude,
			altitude	:	altitude,
			tipo 		: isTypeOf
		  };

	uploadOptions.params = params;

	var fileTransfer = new FileTransfer();
	var path = fileArch.fullPath;
	fileTransfer.upload(path,
						"http://controlviewsystem.com/controlview/api/obra/registrar",
						uploadSuccess, uploadFail, uploadOptions);

}

function uploadSuccessVideo(result) {
	//$.mobile.hidePageLoadingMsg();
	alert("Successfully transferred " + result.bytesSent + "bytes");
}

function uploadFail(error) {
	//$.mobile.hidePageLoadingMsg();
	$("#mensajeTxt").val("<b>Datos No Enviados</b>");
	alert("Error uploading file: " + error.code);
}