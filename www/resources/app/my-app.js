var $$ = Dom7;
window.COM_TIMEFORMAT = 'YYYY-MM-DD HH:mm:ss';
window.COM_TIMEFORMAT2 = 'YYYY-MM-DDTHH:mm:ss';

var s;
const ip = '192.168.1.1';
const port = 10080;
var connection_id;

// API ADRESS URL
const LOCAL_ADRESS = 'http://192.168.1.1/';
const API_COMMON_VIDEO_LIST = LOCAL_ADRESS + 'ini.htm?cmd=commonvideolist';
const API_ALARM_VIDEO_LIST = LOCAL_ADRESS + 'ini.htm?cmd=alarmvideolist';
const API_GET_GPS_POSITION = LOCAL_ADRESS + 'ini.htm?cmd=gpsdatalist';
const API_LIVE_STREAM = LOCAL_ADRESS + 'livesubstream.h264';
const API_DOWNLOAD = LOCAL_ADRESS + 'DCIM/';

//const URL_USERGUIDE = 'https://support.rv-eye.co/manual/app-user-guide.pdf';
const URL_USERGUIDE = 'http://sinopacificukraine.com/app/DC100-user-guide.pdf';

//var MapTrack = null;
var PHOTOLIST = {};
var VIDEOLIST = {};

var validWiFi = false;

window.PosMarker = {};
var App = new Framework7({
    swipeBackPage: false,
    material: true,
    allowDuplicateUrls: true,
    sortable: false,
    precompileTemplates: true,
    template7Pages: true,
    tapHold: false, //enable tap hold events
	theme: 'auto',
    root: '#app',
    name: 'QT DashCam',
    id: 'com.quiktrak.dashcam',
	  touch: {
		tapHold: true //enable tap hold events
	  },
    panel: {
        swipe: 'left',
        leftBreakpoint: 768,
    },
    routes: routes,
	// App root data
    data: function () {
    },
    on: {
        init: function() {
			App.methods.popupIMEI();
			//App.dialog.alert('Please ');
            // console.log('App initialized');
        },
        pageInit: function() {
            // console.log('Page initialized');
        },
		photoBrowser: {
			type: 'popup',
		  }
    },
	methods: {     
		popupIMEI: function(){
			// Create dynamic Popup
			var currentHintState = App.methods.getFromStorage("setIMEI");
			
			/*App.methods.setInStorage({name: 'currentResolution', data: '1080p'});	
			App.methods.setInStorage({name: 'settingSoundOn', data: 'on'});	
			App.methods.setInStorage({name: 'settingVoiceAlarm', data: 'on'});	
			App.methods.setInStorage({name: 'settingVoiceGesture', data: 'on'});	
			App.methods.setInStorage({name: 'settingVoiceParking', data: 'on'});	
			App.methods.setInStorage({name: 'settingSurveillance', data: 'off'});	
			App.methods.setInStorage({name: 'currentSensitivity', data: 'medium'});	*/
				
				/*WifiWizard.listNetworks(function(a){								
					for (var i = 1; i <= a.length; i++) {
						var pattern = /AUTO-VOX/i;
						var pattern1 = /M-/i;
						
						if (pattern.test(a[i])) {
							
						}
					}
				}, function(e){});;*/
						
				//if(!currentHintState.length){
					
					var dynamicPopup = App.popup.create({
					  content: '<div class="page open-dashcam-page popup">'+
							'<div class="navbar">'+
							'	<div class="navbar-inner">'+
							'		<div class="title">QT DashCam</div>'+
							'	</div>'+
							'</div>'+										
						   ' <div class="toolbar toolbar-bottom">'+
							'    <div class="toolbar-inner">'+
							 '       <a class="btn-cs" href="#" id="connectCam">'+
							  '          Ok'+
							   '     </a>'+
							   ' </div>'+
							'</div>'+/*
							'<div class="toolbar toolbar-bottom">'+ popup-close
							'	<div class="toolbar-inner item-title open-title">'+
							'		<a class="link popup-close " href="#">'+
							'			Ok'+
							'		</a>'+
							'	</div>'+
							'</div>'+*/
							'<div class="page-content">'+
							'	<div class="block" align="center">'+
							'		<img src="resources/images/qr.png" width="140px">'+							
								'</div>'+
								'<div class="list-block media-list inline-labels no-hairlines-md no-hairlines-between no-hairlines sliding active arrow-up">'+
								/*'	<ul>'+
								'		<li class="item-content">'+
								'			<div class="item-inner ">'+
								'				<div class="item-title label">Please enter your IMEI number:</div>'+
								
								'  </div>'+
								
								'		</li>'+
								'	</ul>'+		*/
								'	<ul>'+	
								'		<li>'+	
								'  <div class="item-inner">'+ 
								'  <div class="item-media">'+	
								//'	<i class="icon demo-list-icon"></i>'+	
								'  </div>'+	
								'	<div class="item-title item-label">IMEI</div>'+
								'	<div class="item-input-wrap scan-imei-block">'+
								'	  <input type="text" placeholder="IMEI" name="IMEI" value="" maxlength="200">'+
								'					<img src="resources/images/barcode.svg" class="barcode-icon scanBarCode">'+
								//'	  <span class="input-clear-button"></span>'+
								'	</div>'+
								'  </div>'+
	  
								/*'				<div class="item-input scan-imei-block">'+
								'					<input type="text" placeholder="IMEI" name="IMEI" value="" maxlength="200" class="">'+
								'					<img src="resources/images/barcode.svg" class="barcode-icon scanBarCode">'+
								'				</div>'+*/
								//'			</div>'+
								'		</li>'+
								'	</ul>'+								
								'</div>'+
							'</div>'+
						'</div>',
					  
					  // Events
					  on: {
						open: function (popup) {
						  console.log('Popup open');
						  
						  $$('body').on('click', '#connectCam', function() {
							let imei = $$('.open-dashcam-page input').val();
							
							if(imei.length){
								App.methods.setInStorage({name: 'setIMEI', data: imei});
								
								App.methods.sendCmd("WIFI,ON").then(response => {
									if(response == '000'){
										dynamicPopup.close();
									}
								}, error => {
									App.dialog.alert('Connection failed');	
								});
								
								
							}else{
								App.dialog.alert('Please, fill in IMEI field');							
							}
						  });
						  
						  WifiWizard2.getConnectedSSID().then(response => {	
							//App.dialog.alert(JSON.stringify(response));	

							let mySSID = JSON.stringify(response).substr(1,mySSID.length -2);							
							
							var pattern = /[0-9]/;
							if (pattern.test(mySSID)) {
								$$('.open-dashcam-page input').val(mySSID);
							}
							
							/*var pattern1 = /M-/i;
							var pattern2 = /ATGA/i;
							
							if ((pattern.test(mySSID) || pattern1.test(mySSID) || pattern2.test(mySSID))) {	
								self.$setState({
									CamName: mySSID.substr(1,mySSID.length -2),
								});			
							}else{
								self.$app.preloader.show();
								setTimeout(function () { // Prepend new list element	
									self.$app.preloader.hide();							
									self.$app.dialog.alert('Something wrong.');
									self.$app.methods.openCam();					
								 }, 2000);
								//	
							}*/					
						});	
						  
						  $$('body').on('click', '.scanBarCode', function() {
							let input = $$(this).siblings('input');

							let permissions = cordova.plugins.permissions;
							if (!permissions) {
								App.dialog.alert('plugin not supported')
							} else {
								permissions.hasPermission(permissions.CAMERA, function(status) {
									// App.dialog.alert(JSON.stringify(status))

									if (status.hasPermission) {
										openBarCodeReader(input);
									} else {
										permissions.requestPermission(permissions.CAMERA, success, error);

										function error() {
											App.dialog.alert('Camera permission is not turned on');
										}

										function success(status1) {
											openBarCodeReader(input);
											if (!status1.hasPermission) error();
										}
									}
								});

							}
						});

						function openBarCodeReader(input) {
							//console.log(input);
							if (window.device && cordova.plugins && cordova.plugins.barcodeScanner) {
								cordova.plugins.barcodeScanner.scan(
									function(result) {
										/*alert("We got a barcode\n" +
											  "Result: " + result.text + "\n" +
											  "Format: " + result.format + "\n" +
											  "Cancelled: " + result.cancelled);*/
										if (result && result.text) {
											input.val(result.text);					
											
											input.change(); // fix to trigger onchange / oninput event listener
										}

									},
									function(error) {
										alert("Scanning failed: " + error);
									}, {
										//preferFrontCamera : true, // iOS and Android
										showFlipCameraButton: true, // iOS and Android
										showTorchButton: true, // iOS and Android
										torchOn: true, // Android, launch with the torch switched on (if available)
										//saveHistory: true, // Android, save scan history (default false)
										prompt: "Place a barcode inside the scan area", // Android
										resultDisplayDuration: 0, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
										//formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
										//orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
										//disableAnimations : true, // iOS
										//disableSuccessBeep: false // iOS and Android
									}
								);
							} else {
								App.dialog.alert('Your device does not support this function');
							}
						}
	
						},
						opened: function (popup) {
						  console.log('Popup opened');
						},
					  }
					});
					
					dynamicPopup.open();					
			 
				//}
		},
        capitalize: function(s) {
            if (typeof s !== 'string') return ''
            return s.charAt(0).toUpperCase() + s.slice(1)
        },
        isJsonString: function(str){
            try{var ret=JSON.parse(str);}catch(e){return false;}return ret;
        },
        findObjectByKey: function(array, key, value) {           
            for (var i = 0; i < array.length; i++) {
                if (array[i][key] == value) {
                    return array[i];
                }
            }
            return null;
        },
        isObjEmpty: function(obj) {
            for (var key in obj) {
                return false;
            }
            return true;
        },
        reverseArry: function(arry){
            var newArry = [];
            var i = null;
            for (i = arry.length - 1; i >= 0; i -= 1)
            {
                newArry.push(arry[i]);
            }
            return newArry;
        },		
		sendCmd: function(myCMD, resolve, reject){	 
                var imei = App.methods.getFromStorage("setIMEI");
				
				let data = {
						"Majortoken": "a5b4a26a-053b-4fd8-9b90-19f4c6588146",
						"minortoken": "5f23466a-407c-4b0b-97aa-0914b9e46360",
						"imei": imei,
						"cmd": myCMD,
				}
				
				let url = "https://api.m2mglobaltech.com/Quiktrak/V1/Device/GprsCommand";
				return new Promise((resolve, reject) => {
				App.request.post(
					url, 
					data, 
					function (result) {
						console.log(result);
						if(result.MajorCode == '000'){
							resolve(result.MajorCode);
						}else{
							App.dialog.alert('IMEI number is incorrect');
							reject();
							//App.methods.popupIMEI();
						}
					}, 
					function(e){
						console.log('error = ' + e);
						App.dialog.alert('Something went wrong');
						reject();
					}, 
					'json'
					);
				});
		},
        getFromStorage: function(name){
            var ret = [];
            var str = '';
            if (name) {
                switch (name){
                    case 'setIMEI':
                        str = localStorage.getItem("COM.QUIKTRAK.DASHCAM.SETIMEI");
                        if(str) {
                            ret = JSON.parse(str);
                        }
                    break; 
                    case 'settingSurveillance':
                        str = localStorage.getItem("COM.QUIKTRAK.DASHCAM.SETTINGSURVEILLANCE");
                        if(str) {
                            ret = JSON.parse(str);
                        }
                    break; 
                    case 'settingSoundOn':
                        str = localStorage.getItem("COM.QUIKTRAK.DASHCAM.SETTINGSOUNDON");
                        if(str) {
                            ret = JSON.parse(str);
                        }
                    break; 
                    case 'settingVoiceParking':
                        str = localStorage.getItem("COM.QUIKTRAK.DASHCAM.SETTINGVOICEPARKING");
                        if(str) {
                            ret = JSON.parse(str);
                        }
                    break; 
                    case 'settingVoiceAlarm':
                        str = localStorage.getItem("COM.QUIKTRAK.DASHCAM.SETTINGVOICEALARM");
                        if(str) {
                            ret = JSON.parse(str);
                        }
                    break; 
                    case 'settingVoiceGesture':
                        str = localStorage.getItem("COM.QUIKTRAK.DASHCAM.SETTINGVOICEGESTURE");
                        if(str) {
                            ret = JSON.parse(str);
                        }
                    break; 
                    case 'currentSensitivity':
                        str = localStorage.getItem("COM.QUIKTRAK.DASHCAM.CURRENTSENSITIVITY");
                        if(str) {
                            ret = JSON.parse(str);
                        }
                    break; 
                    case 'currentGestureInduction':
                        str = localStorage.getItem("COM.QUIKTRAK.DASHCAM.CURRENTGESTUREINDUCTION");
                        if(str) {
                            ret = JSON.parse(str);
                        }
                    break; 
                    case 'currentLanguage':
                        str = localStorage.getItem("COM.QUIKTRAK.DASHCAM.CURRENTLANGUAGE");
                        if(str) {
                            ret = JSON.parse(str);
                        }
                    break; 
                    case 'currentResolution':
                        str = localStorage.getItem("COM.QUIKTRAK.DASHCAM.CURRENTRESOLUTION");
                        if(str) {
                            ret = JSON.parse(str);
                        }
                    break; 
                    case 'currentCamera':
                        str = localStorage.getItem("COM.QUIKTRAK.DASHCAM.CURRENTCAMERA");
                        if(str) {
                            ret = JSON.parse(str);
                        }
                    break; 
					case 'deletedCameras':
                        str = localStorage.getItem("COM.QUIKTRAK.DASHCAM.DELETEDCAMERAS");
                        if(str) {
                            ret = JSON.parse(str);
                        }
                    break; 
                    case 'alarmPhotoList':
                        str = localStorage.getItem("COM.QUIKTRAK.DASHCAM.ALARMPHOTOLIST");
                        if(str) {
                            ret = JSON.parse(str);
                        }
                    break;  
                    case 'gesturePhotoList':
                        str = localStorage.getItem("COM.QUIKTRAK.DASHCAM.GESTUREPHOTOLIST");
                        if(str) {
                            ret = JSON.parse(str);
                        }
                    break;  
                    case 'parkingPhotoList':
                        str = localStorage.getItem("COM.QUIKTRAK.DASHCAM.PARKINGPHOTOLIST");
                        if(str) {
                            ret = JSON.parse(str);
                        }
                    break;   
					case 'videoList':
						str = localStorage.getItem("COM.QUIKTRAK.DASHCAM.VIDEOLIST");
                        if(str) {
                            ret = JSON.parse(str);
                        }
					break;  
					case 'normalList':
						str = localStorage.getItem("COM.QUIKTRAK.DASHCAM.NORMALLIST");
                        if(str) {
                            ret = JSON.parse(str);
                        }
					break;  
					case 'eventList':
						str = localStorage.getItem("COM.QUIKTRAK.DASHCAM.EVENTLIST");
                        if(str) {
                            ret = JSON.parse(str);
                        }
					break;  
					case 'mediaVideoList':
						str = localStorage.getItem("COM.QUIKTRAK.DASHCAM.MEDIAVIDEOLIST");
                        if(str) {
                            ret = JSON.parse(str);
                        }
					break; 
					default:
                        App.dialog.alert('There is no item saved with such name - '+name);
                }
            }else{
                App.dialog.alert('Wrong query parameters!');
            }
            return ret;
		},
		
        setInStorage: function(params){
            let self = this;
            if (typeof(params) == 'object' && params.name && params.data) {
                switch (params.name){
                    case 'setIMEI':
                        localStorage.setItem("COM.QUIKTRAK.DASHCAM.SETIMEI", JSON.stringify(params.data));
                    break; 
                    case 'settingSurveillance':
                        localStorage.setItem("COM.QUIKTRAK.DASHCAM.SETTINGSURVEILLANCE", JSON.stringify(params.data));
                    break; 
                    case 'settingSoundOn':
                        localStorage.setItem("COM.QUIKTRAK.DASHCAM.SETTINGSOUNDON", JSON.stringify(params.data));
                    break; 
                    case 'settingVoiceParking':
                        localStorage.setItem("COM.QUIKTRAK.DASHCAM.SETTINGVOICEPARKING", JSON.stringify(params.data));
                    break; 
                    case 'settingVoiceAlarm':
                        localStorage.setItem("COM.QUIKTRAK.DASHCAM.SETTINGVOICEALARM", JSON.stringify(params.data));
                    break; 
                    case 'settingVoiceGesture':
                        localStorage.setItem("COM.QUIKTRAK.DASHCAM.SETTINGVOICEGESTURE", JSON.stringify(params.data));
                    break; 
                    case 'currentGestureInduction':
                        localStorage.setItem("COM.QUIKTRAK.DASHCAM.CURRENTGESTUREINDUCTION", JSON.stringify(params.data));
                    break; 
                    case 'currentLanguage':
                        localStorage.setItem("COM.QUIKTRAK.DASHCAM.CURRENTLANGUAGE", JSON.stringify(params.data));
                    break; 
                    case 'currentResolution':
                        localStorage.setItem("COM.QUIKTRAK.DASHCAM.CURRENTRESOLUTION", JSON.stringify(params.data));
                    break; 
                    case 'currentSensitivity':
                        localStorage.setItem("COM.QUIKTRAK.DASHCAM.CURRENTSENSITIVITY", JSON.stringify(params.data));
                    break; 
                    case 'currentCamera':
                        localStorage.setItem("COM.QUIKTRAK.DASHCAM.CURRENTCAMERA", JSON.stringify(params.data));
                    break; 
					case 'deletedCameras':
                        localStorage.setItem("COM.QUIKTRAK.DASHCAM.DELETEDCAMERAS", JSON.stringify(params.data));
                    break;     
                    case 'normalList':
                        localStorage.setItem("COM.QUIKTRAK.DASHCAM.NORMALLIST", JSON.stringify(params.data));
                    break; 
                    case 'alarmPhotoList':
                        localStorage.setItem("COM.QUIKTRAK.DASHCAM.ALARMPHOTOLIST", JSON.stringify(params.data));
                    break;  
                    case 'gesturePhotoList':
                        localStorage.setItem("COM.QUIKTRAK.DASHCAM.GESTUREPHOTOLIST", JSON.stringify(params.data));
                    break; 
                    case 'parkingPhotoList':
                        localStorage.setItem("COM.QUIKTRAK.DASHCAM.PARKINGPHOTOLIST", JSON.stringify(params.data));
                    break;      
                    case 'videoList':
                        localStorage.setItem("COM.QUIKTRAK.DASHCAM.VIDEOLIST", JSON.stringify(params.data));
                    break;     
                    case 'eventList':
                        localStorage.setItem("COM.QUIKTRAK.DASHCAM.EVENTLIST", JSON.stringify(params.data));
                    break;             
                    case 'mediaVideoList':
                        localStorage.setItem("COM.QUIKTRAK.DASHCAM.MEDIAVIDEOLIST", JSON.stringify(params.data));
                    break;              
                    default:
                        App.dialog.alert('There is no function associated with this name - '+params.name);
                }   
            }else{
                App.dialog.alert('Wrong query parameters!');
            }
        },
		/*requestStoragePermission: function(data=false, callback) {
			let self = this;

			let success = function (status) {
				if ( !status.hasPermission ) {
					window.permissions.requestPermission(window.permissions.WRITE_EXTERNAL_STORAGE, function() {
						//alert('[OK] Permission accepted');
						if (data){
							callback(data);
						}
					}, function(error) {
						alert('[WARN] Permission not accepted')
						// Handle permission not accepted
					});
				}
			};
			let error = function (e) { alert('Something went wrong:' + e); };
			window.permissions.hasPermission(window.permissions.WRITE_EXTERNAL_STORAGE, success, error);
		},*/
		downloadMedia: function(date, type, resolve, reject){ 		
			
			var folderDate = date.substr(0, 10);
			var folder = type + "_" + folderDate;
			var fileName = date;			
			
			return new Promise((resolve, reject) => {
				
				window.cordova.plugin.ftp.connect('192.168.43.1:10011', 'admin', 'admin', function(ok) {
						
						var permissions = cordova.plugins.permissions;
						
						permissions.hasPermission(permissions.MANAGE_EXTERNAL_STORAGE, 
							function(status) {
								downloadMediaFile();
							}, 
							function() {
								permissions.requestPermission(permissions.MANAGE_EXTERNAL_STORAGE, function(b) {
									downloadMediaFile();
								});
							}
						);
						
						function downloadMediaFile(){
							var networkState = navigator.connection.type;
							if (networkState == Connection.NONE) {
								return;
							} else {
								
								window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

								function fileSystemSuccess(fileSystem) {
									/*var directoryEntry = fileSystem.root;										
									directoryEntry.getDirectory(folder, { create: true, exclusive: false }, onDirectorySuccess, onDirectoryFail); */
									
									var rootdir = fileSystem.root;
									var fp = rootdir.toURL(); 
									
									
									var lp = "file:///data/user/0/com.quiktrak.quiktrak_dashcam/files/" + fileName;//'file:///storage/emulated/0/Download/' + fileName;'file:///data/user/0/com.quiktrak.quiktrak_dashcam/files/files/' + folder + '/' + fileName;
									
									var rp = '/storage/sdcard1/DVRMEDIA/CarRecorder/'+type+'/'+folderDate+'/'+fileName;
									
									window.cordova.plugin.ftp.download(lp, rp, function(result) {												
										$$('.view-main #demo-inline-progressbar').removeClass('display-none');
										//$$('.view-main #demo-inline-progressbar').attr('data-progress', parseInt((result * 100), 10).toString(10));
										
										var pcnt = +result * 100;
										
										App.progressbar.set('#demo-inline-progressbar', pcnt);
										
										if (result == 1) {
											resolve(fileName);
										} else {
											//App.dialog.alert("ftp: dwnl=" + result * 100 + "%");
										}
									}, function(error) {
										console.error("ftp: ls error=" + error);									
										App.dialog.alert("Something went wrong");
									});
								}

								function onDirectorySuccess(parent) {
									// Directory created successfuly
									//App.dialog.alert('dir success');
								}

								function onDirectoryFail(error) {
									//Error while creating directory
									App.dialog.alert("Unable to create new directory: " + error.code);
								}

								function fileSystemFail(evt) {
									//Unable to access file system
									App.dialog.alert(evt.target.error.code);
								}
							}
						}
						
						console.info("ftp: connect ok=" + ok);
							

					}, function(error) {
						console.error("ftp: connect error=" + error);
						App.dialog.alert("ftp: connect error=" + error);
					});				
				});   			
		},
		
		getRecordVideoList: function(date, type, resolve, reject){ 		
			return new Promise((resolve, reject) => {
				
				window.cordova.plugin.ftp.connect('192.168.43.1:10011', 'admin', 'admin', function(ok) {
						//window.cordova.plugin.ftp.connect('192.168.43.1:10011', '357730090913204', '99999999', function(ok) {
						//window.cordova.plugin.ftp.connect('quiktrak.ftp.tools', 'quiktrak_biletskiy', '4eBcgg9S1N5I', function(ok) {
						
							console.info("ftp: connect ok=" + ok);
							
							// You can do any ftp actions from now on...
							
							// /storage/sdcard0/DVRMEDIA/Remote/PHOTO
							window.cordova.plugin.ftp.ls('/storage/sdcard1/DVRMEDIA/CarRecorder/'+type+'/'+date, function(result) {
								//App.dialog.alert(JSON.stringify(result));
								//App.dialog.alert('/storage/sdcard1/DVRMEDIA/CarRecorder/'+type+'/'+date);
								
								resolve(result);
							}, function(error) {
								//App.dialog.alert('error: ' + JSON.stringify(error));
								console.error("ftp: ls error=" + error);
							});
							/*window.cordova.plugin.ftp.upload('/localPath/localFile', '/remotePath/remoteFile', function(percent) {
								if (percent == 1) {
									console.info("ftp: upload finish");
								} else {
									console.debug("ftp: upload percent=" + percent * 100 + "%");
								}
							}, function(error) {
								console.error("ftp: upload error=" + error);
							});*/

						}, function(error) {
							console.error("ftp: connect error=" + error);
							//App.dialog.alert("ftp: connect error=" + error);
						});
				
			});   			
		},
		getRecordPhoto: function(resolve, reject){ 		
			return new Promise((resolve, reject) => {
				
				window.cordova.plugin.ftp.connect('192.168.43.1:10011', 'admin', 'admin', function(ok) {
						//window.cordova.plugin.ftp.connect('192.168.43.1:10011', '357730090913204', '99999999', function(ok) {
						//window.cordova.plugin.ftp.connect('quiktrak.ftp.tools', 'quiktrak_biletskiy', '4eBcgg9S1N5I', function(ok) {
						
							console.info("ftp: connect ok=" + ok);
							
							// You can do any ftp actions from now on...
							
							// /storage/sdcard0/DVRMEDIA/Remote/PHOTO
							window.cordova.plugin.ftp.ls('/storage/sdcard1/DVRMEDIA/CarRecorder/GENERAL/', function(result) {
								//self.$app.dialog.alert(JSON.stringify(data));
								resolve(result);
								if (data == 1) {
									//console.info("ftp: upload finish");
								} else {
									//console.debug("ftp: upload percent=" + percent * 100 + "%");
								}
							}, function(error) {
								self.$app.dialog.alert('error: ' + JSON.stringify(error));
								console.error("ftp: ls error=" + error);
							});
							/*window.cordova.plugin.ftp.upload('/localPath/localFile', '/remotePath/remoteFile', function(percent) {
								if (percent == 1) {
									console.info("ftp: upload finish");
								} else {
									console.debug("ftp: upload percent=" + percent * 100 + "%");
								}
							}, function(error) {
								console.error("ftp: upload error=" + error);
							});*/

						}, function(error) {
							console.error("ftp: connect error=" + error);
							self.$app.dialog.alert("ftp: connect error=" + error);
						});
				
			});   			
		},
		getVRecordPhoto: function(resolve, reject){ 			
			return new Promise((resolve, reject) => {
				let url = 'http://192.168.1.1/DCIM/104snap/';
				let params = {};
				let headers = {};
				let newArr = [];
				cordova.plugin.http.get(url, 
					params, headers, (response) => {
						//App.dialog.alert('rec_good');
						var arrParse = response.data.split('</a>');
						arrParse.forEach(function(value, index) {
							var valParse = value.split('>');						
							if(index > 0 && index < arrParse.length - 1){
								newArr.push(valParse[1]);					
							}
						});
						
						//console.log(newArr);					
						resolve(newArr);
				}, function(response) {
						//App.dialog.alert(response.error);
				  console.error(response.error);
				  reject();
				});	
			});				
		},
		getRecordVideo: function (resolve, reject) {	
			return new Promise((resolve, reject) => {
				
				window.cordova.plugin.ftp.connect('192.168.43.1:10011', 'admin', 'admin', function(ok) {
						//window.cordova.plugin.ftp.connect('192.168.43.1:10011', '357730090913204', '99999999', function(ok) {
						//window.cordova.plugin.ftp.connect('quiktrak.ftp.tools', 'quiktrak_biletskiy', '4eBcgg9S1N5I', function(ok) {
						
							console.info("ftp: connect ok=" + ok);
							
							// You can do any ftp actions from now on...
							
							// /storage/sdcard0/DVRMEDIA/Remote/PHOTO
							window.cordova.plugin.ftp.ls('/storage/sdcard1/DVRMEDIA/CarRecorder/USB/', function(result) {
								//self.$app.dialog.alert(JSON.stringify(data));
								resolve(result);
								if (data == 1) {
									//console.info("ftp: upload finish");
								} else {
									//console.debug("ftp: upload percent=" + percent * 100 + "%");
								}
							}, function(error) {
								self.$app.dialog.alert('error: ' + JSON.stringify(error));
								console.error("ftp: ls error=" + error);
							});
							/*window.cordova.plugin.ftp.upload('/localPath/localFile', '/remotePath/remoteFile', function(percent) {
								if (percent == 1) {
									console.info("ftp: upload finish");
								} else {
									console.debug("ftp: upload percent=" + percent * 100 + "%");
								}
							}, function(error) {
								console.error("ftp: upload error=" + error);
							});*/

						}, function(error) {
							console.error("ftp: connect error=" + error);
							self.$app.dialog.alert("ftp: connect error=" + error);
						});
						
				/*$.ajax({
					   type: "GET",
				   dataType: "json", 
						/dataFilter: function(raw, type) {
						console.log(raw, type);
						return JSON.parse(raw);
						{ 
					"filename": "20190523121307_180_720p.MP4", 
					"duration": 180, 
					"filesize": 94716138, 
					"title": "20190523121307.JPG", 
					"titlesize": 5817, 
					"thumb": "20190523121307.TGZ", 
					"thumbsize": 36302, 
					"time": "20190523121307" 
				 }
					},/
					  jsonp: false,
					  //jsonpCallback: "onJsonP",
						url: 'http://192.168.1.1/ini.htm?cmd=commonvideolist',
					  async: true,           
						crossDomain: true, 
					  cache: false,
					success: function (result) {    
						//console.log('res', result, 'ault');
						//data = result;
						resolve(result);
					},
					error: function(XMLHttpRequest, textStatus, errorThrown){ 
					   console.log(textStatus,'error');
					}
				});	*/	
			});     
		},		
		getRecordEvent: function (resolve, reject) {	
			return new Promise((resolve, reject) => {
				
				window.cordova.plugin.ftp.connect('192.168.43.1:10011', 'admin', 'admin', function(ok) {
						//window.cordova.plugin.ftp.connect('192.168.43.1:10011', '357730090913204', '99999999', function(ok) {
						//window.cordova.plugin.ftp.connect('quiktrak.ftp.tools', 'quiktrak_biletskiy', '4eBcgg9S1N5I', function(ok) {
						
							console.info("ftp: connect ok=" + ok);
							
							// You can do any ftp actions from now on...
							
							// /storage/sdcard0/DVRMEDIA/Remote/PHOTO
							window.cordova.plugin.ftp.ls('/storage/sdcard1/DVRMEDIA/CarRecorder/EVENT/', function(result) {
								//self.$app.dialog.alert(JSON.stringify(data));
								resolve(result);
								if (data == 1) {
									//console.info("ftp: upload finish");
								} else {
									//console.debug("ftp: upload percent=" + percent * 100 + "%");
								}
							}, function(error) {
								self.$app.dialog.alert('error: ' + JSON.stringify(error));
								console.error("ftp: ls error=" + error);
							});
							/*window.cordova.plugin.ftp.upload('/localPath/localFile', '/remotePath/remoteFile', function(percent) {
								if (percent == 1) {
									console.info("ftp: upload finish");
								} else {
									console.debug("ftp: upload percent=" + percent * 100 + "%");
								}
							}, function(error) {
								console.error("ftp: upload error=" + error);
							});*/

						}, function(error) {
							console.error("ftp: connect error=" + error);
							self.$app.dialog.alert("ftp: connect error=" + error);
						});
						
				/*$.ajax({
					   type: "GET",
				   dataType: "json", 
						/dataFilter: function(raw, type) {
						console.log(raw, type);
						return JSON.parse(raw);
						{ 
					"filename": "20190523121307_180_720p.MP4", 
					"duration": 180, 
					"filesize": 94716138, 
					"title": "20190523121307.JPG", 
					"titlesize": 5817, 
					"thumb": "20190523121307.TGZ", 
					"thumbsize": 36302, 
					"time": "20190523121307" 
				 }
					},/
					  jsonp: false,
					  //jsonpCallback: "onJsonP",
						url: 'http://192.168.1.1/ini.htm?cmd=commonvideolist',
					  async: true,           
						crossDomain: true, 
					  cache: false,
					success: function (result) {    
						//console.log('res', result, 'ault');
						//data = result;
						resolve(result);
					},
					error: function(XMLHttpRequest, textStatus, errorThrown){ 
					   console.log(textStatus,'error');
					}
				});	*/	
			});     
		},		
        sortParseDatePhoto: function(data){
			let dataObj = data;
			let dateArr = [];
			for (let i = dataObj.length - 1; i >= 0; i--) {
				let dataArr = [];
				let timeArr = dataObj[i].split('.');
				//console.log(timeArr);
				let filename = timeArr[0];
				let time = timeArr[0].substring(1, 15);
								
				let newDate = (time.substring(0, 8)).substring(0, 4) + '/' + (time.substring(0, 8)).substring(4, 6) + '/' + (time.substring(0, 8)).substring(6, 9);
					
				let index = dateArr.findIndex(item => item.title === newDate);
				
				if(index == -1){
					dataArr.push(dataObj[i]);
					dateArr.push({
						title: (time.substring(0, 8)).substring(0, 4) + '/' + (time.substring(0, 8)).substring(4, 6) + '/' + (time.substring(0, 8)).substring(6, 9),
						data: dataArr
					});
				}else{
					dateArr[index].data.push(dataObj[i]);
				}
			}
			
			
			return dateArr;
		},
        sortDatePhoto: function(data){
			let dataObj = data;
			let dateArr = [];
			
			// info array push
			for (let i = 0; i < dataObj.length; i++) {
				let dataArr = [];
				
				let newDate = (dataObj[i].time.substring(0, 8)).substring(0, 4) + '/' + (dataObj[i].time.substring(0, 8)).substring(4, 6) + '/' + (dataObj[i].time.substring(0, 8)).substring(6, 9);
					
				let index = dateArr.findIndex(item => item.title === newDate);
				
				if(index == -1){
					dataArr.push(dataObj[i]);
					dateArr.push({
						title: (dataObj[i].time.substring(0, 8)).substring(0, 4) + '/' + (dataObj[i].time.substring(0, 8)).substring(4, 6) + '/' + (dataObj[i].time.substring(0, 8)).substring(6, 9),
						data: dataArr
					});
				}else{
					dateArr[index].data.push(dataObj[i]);
				}
			}
			
			return dateArr;
		},		
		openPlayer: function(url){
			VideoPlayer.play(url);			
		},
		downloadFiles: function(arr = []){
			if(arr.length){					
				arr.forEach(function(value, index) {
					if(value.url.length > 0 && value.dir.length > 0 && value.name.length > 0){
						$$('.view-main .progressbar-infinite').removeClass('display-none');
						DownloadFile(value.url, value.dir, value.name);
					}else{						
						App.dialog.alert('Can not download this file');
					}
				});
			}else{
				App.dialog.alert('Please choose files');
			}				
		},
		openCamList: function(){
			loadListPage();		
		},
		openCam: function(){
			loadCarcamPage();		
		},
		hexToDec: function (hex) {	
		  var result = 0, digitValue;
		  hex = hex.toLowerCase();
		  for (var i = 0; i < hex.length; i++) {
			digitValue = '0123456789abcdef'.indexOf(hex[ i ]);
			result = result * 16 + digitValue;
		  }
		  return result;
		},
		pad: function (str, max) {
		  str = str.toString();
		  return str.length < max ? pad("0" + str, max) : str;
		},
		changePassword: function (data) {	
			//return new Promise((resolve, reject) => {
				let url = 'http://192.168.1.1/ini.htm?cmd=setwifipasswd&passwd=' + data;				
				let params = {};
				let headers = {};
				
				cordova.plugin.http.get(url, 
					params, headers, (response) => {
						App.dialog.alert('Set successfully. Please power cycle the DC100 before it takes effect.');
						console.log(response);
				}, function(response) {
						App.dialog.alert('Can not change password');
						console.error(response.error);
				});	
				 
		}, 
	}
});


document.addEventListener("deviceready", onDeviceReady, false ); 
 
function encodeHex(str){
    str = encodeURIComponent(str).split('%').join('');
    return str.toLowerCase();
	/*var result = "";
    for (i=0; i<str.length; i++) {
        hex = str.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-2);
    }
	return result;*/
}

function onDeviceReady(){
	loadCarcamPage();
	console.log('ready');
	//App.dialog.alert(UInt64("0x0000000077232000"));	
	//var num2 = ctypes.UInt64("-0x1234567890ABCDEF");
}

	
var mainView = App.views.create('.view-main');

/*start download file*/

//First step check parameters mismatch and checking network connection if available call    download function
function DownloadFile(URL, Folder_Name, File_Name) {
	//Parameters mismatch check
	if (URL == null && Folder_Name == null && File_Name == null) {
		return;
	}
	else {
		//checking Internet connection availablity
		var networkState = navigator.connection.type;
		if (networkState == Connection.NONE) {
			return;
		} else {
			download(URL, Folder_Name, File_Name); //If available download function call
		}
	}
}


function filetransfer(download_link, fp) {	
	var fileTransfer = new FileTransfer();
	// File download function with URL and local path
	fileTransfer.download(download_link, fp,
		function (entry) {
			//alert("download complete: " + entry.fullPath);
			window.plugins.scanmedia.scanFile(fp, function (msg) {				
				$$('.view-main .progressbar-infinite').addClass('display-none');
				App.dialog.alert("File uploaded");
			}, function (err) {
				$$('.view-main .progressbar-infinite').addClass('display-none');
				App.dialog.alert("File not uploaded");
			})
		},
		function (error) {		
			App.preloader.hide(); 
			App.dialog.alert('Please try once more');
		}
    );
}

function download(URL, Folder_Name, File_Name) {
//step to request a file system 
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

	function fileSystemSuccess(fileSystem) {
		var download_link = encodeURI(URL);
		ext = download_link.substr(download_link.lastIndexOf('.') + 1); //Get extension of URL

		var directoryEntry = fileSystem.root; // to get root path of directory
		directoryEntry.getDirectory(Folder_Name, { create: true, exclusive: false }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
		var rootdir = fileSystem.root;
		var fp = rootdir.toURL(); 
		//var fp = cordova.file.dataDirectory;
		//App.dialog.alert(rootdir + '..' + rootdir.toURL());// Returns Fulpath of local directory
		//var fp = "file:///storage/sdcard0'";
		//fp = 'file:///data/user/0/com.sinopacific.dashcamtest/files/' + Folder_Name + "/" + File_Name + "." + ext;
		fp = fp + "/" + Folder_Name + "/" + File_Name;// + "." + ext; // fullpath and name of the file which we want to give
		// download function call
		filetransfer(download_link, fp);
	}

	function onDirectorySuccess(parent) {
		// Directory created successfuly
	}

	function onDirectoryFail(error) {
		//Error while creating directory
		App.dialog.alert("Unable to create new directory: " + error.code);
	}

	function fileSystemFail(evt) {
		//Unable to access file system
		App.dialog.alert(evt.target.error.code);
	}
}

/*end download file*/



$$('#mainMenu li').on('click', menuList)

function menuList() {		
	//if(validWiFi){		
		let listId = $$(this).attr('id');
		let activePage = mainView.activePage;
		
		if (listId) {
			switch (listId) {
				case 'carcam':
					loadCarcamPage();
					App.panel.close($$('.panel-left'), true);
					break;
				case 'delete.cam':
					if (typeof(activePage) == 'undefined' || (activePage && activePage.name != "delete.cam")) {
						loadDeleteCamPage();
						console.log('open del');
						App.panel.close($$('.panel-left'), true);
					}
					break;
				case 'gallery':
					if (typeof(activePage) == 'undefined' || (activePage && activePage.name != "gallery")) {
						loadGalleryPage();
						App.panel.close($$('.panel-left'), true);
					}
					break;
				case 'videos':
					if (typeof(activePage) == 'undefined' || (activePage && activePage.name != "videos")) {
						loadVideosPage();
						App.panel.close($$('.panel-left'), true);
					}
					break;
				case 'info':
					if (typeof(activePage) == 'undefined' || (activePage && activePage.name != "info")) {
						loadInfoPage();
						App.panel.close($$('.panel-left'), true);
					}
					break;
				case 'list':
					if (typeof(activePage) == 'undefined' || (activePage && activePage.name != "list")) {
						loadListPage();
						App.panel.close($$('.panel-left'), true);
					}
					break;
				case 'settings':
					if (typeof(activePage) == 'undefined' || (activePage && activePage.name != "settings")) {
						loadSettingsPage();
						App.panel.close($$('.panel-left'), true);
					}
					break;
				case 'faq':
					if (typeof(activePage) == 'undefined' || (activePage && activePage.name != "faq")) {
						loadFAQPage();
						App.panel.close($$('.panel-left'), true);
					}
					break;
				case 'help':
					if (typeof(activePage) == 'undefined' || (activePage && activePage.name != "help")) {
						loadHintsPage();
						App.panel.close($$('.panel-left'), true);
					}
					break;
				case 'swiper':
					if (typeof(activePage) == 'undefined' || (activePage && activePage.name != "swiper")) {
						loadSwiperPage();
						App.panel.close($$('.panel-left'), true);
					}
					break;
				default:
					console.log('No Found list menu');
			}
		}
}

/*file viewing start*/
function showUserGuide(){
	
    //var href = URL_USERGUIDE;
    
	/*WifiWizard2.getConnectedSSID().then(response => {	
								let mySSID = JSON.stringify(response);
								var pattern = /AUTO-VOX/i;
								var pattern1 = /M-/i;
								var pattern2 = /ATGA/i;
								
								//self.$app.preloader.hide();		
								if ((pattern.test(mySSID) || pattern1.test(mySSID) || pattern2.test(mySSID))) {										
									App.dialog.alert('In order to access the user guide please disconnect from the DC100 and try again');									
								}else{					
									if (typeof navigator !== "undefined" && navigator.app) {                
										navigator.app.loadUrl(href, {openExternal: true}); 
									} else {
										window.open(href,'_blank');
									}								
								}					
							}).catch((error) => {
								//self.$app.preloader.hide();		
								App.dialog.alert('Something wrong');						
							});*/

//$$(document).on('click', '.getManual', function(){
    var fullPathToFilePrivate = cordova.file.applicationDirectory + 'www/resources/manual/DC100-user-guide.pdf';
    var externalDirEntry;
    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function success(dirEntry) {
        externalDirEntry = dirEntry;
    },function (e) {
        alert('error dir '+JSON.stringify(e));
    });

    window.resolveLocalFileSystemURL(fullPathToFilePrivate, function onSuccess(fileEntry)
    {
        fileEntry.copyTo(externalDirEntry, 'DC100-user-guide.pdf',
            function(e)
            {
                viewDocument(e.nativeURL);
            },
            function()
            {
                alert('copying FAILED');
            });
    }, function (e) { alert(JSON.stringify(e)); });
//});
}


function viewDocument(url) {
    if (cordova && cordova.plugins.fileOpener2) {
        cordova.plugins.fileOpener2.open(
            url, // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Downloads/starwars.pdf
            'application/pdf',
            {
                error: function (e) {
                    alert('Error status: ' + e.status + ' - Error message: ' + e.message);
                },
                success: function () {
                    console.log('file opened successfully');
                }
            }
        );
    }
}
/*file viewing end*/

function loadSwiperPage() {
	mainView.router.navigate('/my-swiper/');
}

function loadCarcamPage() {
	mainView.router.navigate('/my-home/');
}

function loadListPage() {
	mainView.router.navigate('/my-list/');
}

// GALLERY
function loadGalleryPage() {
	mainView.router.navigate('/my-gallery/');
}

// GALLERY
function loadVideosPage() {
	mainView.router.navigate('/my-videos/');
}

// HINTS
function loadHintsPage() {
	mainView.router.navigate('/my-hints/');
}

// FAQ
function loadFAQPage() {
	//mainView.router.navigate('/my-faq/');
	//mainView.router.navigate('/my-info/');
    mainView.router.load({
        url: 'resources/templates/info.html',
        context: {
        }
    });
}
// INFO
function loadInfoPage() {	
	//mainView.router.navigate('/my-info/');
    mainView.router.load({
        url: 'resources/templates/info.html',
        context: {
        }
    });
}

// SETTINGS
function loadSettingsPage() {	
	mainView.router.navigate('/my-settings/');
}

function loadDeleteCamPage() {
	mainView.router.navigate('/my-delete-cam/');
}

