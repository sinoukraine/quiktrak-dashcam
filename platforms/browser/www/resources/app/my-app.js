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
    name: 'DashCam',
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
			// Create dynamic Popup
			var currentHintState = App.methods.getFromStorage("downloadPlayer");
			
			App.methods.setInStorage({name: 'currentResolution', data: '1080p'});	
			App.methods.setInStorage({name: 'settingSoundOn', data: 'on'});	
			App.methods.setInStorage({name: 'settingVoiceAlarm', data: 'on'});	
			App.methods.setInStorage({name: 'settingVoiceGesture', data: 'on'});	
			App.methods.setInStorage({name: 'settingVoiceParking', data: 'on'});	
			App.methods.setInStorage({name: 'settingSurveillance', data: 'off'});	
			App.methods.setInStorage({name: 'currentSensitivity', data: 'medium'});	
				
				if(currentHintState != '1'){
					
					var dynamicPopup = App.popup.create({
					  content: '<div class="page open-dashcam-page popup">'+
							'<div class="navbar">'+
							'	<div class="navbar-inner">'+
							/*'		<div class="left">'+
							'			<a class="panel-open" href="#">'+
							'				<i class="f7-icons icon-menu"></i>'+
							'			</a>'+
							'		</div>'+
							*/'		<div class="title">ATGA DC100</div>'+
							'	</div>'+
							'</div>'+

							'<div class="toolbar toolbar-bottom">'+
							'	<div class="toolbar-inner item-title open-title">'+
							'		<a class="link popup-close " href="#">'+
							'			Ok, I understand'+
							'		</a>'+
							'	</div>'+
							'</div>'+

							'<div class="page-content">'+
							'	<div class="block">'+
							'		<p class="item-title open-title">'+
							'			Please download either of the media players below to live view and view historical images and video'+
							'		</p><p class="item-title open-title"><img class="main-bg" src="./resources/images/mx.png" width="50" alt="main"></p><p class="item-title open-title"><b>MX Player</b></p><p class="item-title open-title"><img class="main-bg" src="./resources/images/kmp.png" width="50" alt="main"></p><p class="item-title open-title"><b>KM Player</b></p><p class="item-title open-title">Thanks you</p>'+
							'	</div>'+
							'	<div class="list virtual-list open-cam-list no-hairlines">'+
							'	</div>'+
							'</div>'+
						'</div>',
					  
					  /*content: '<div class="popup">'+
								  '<div class="block">'+
									'<p>Popup created dynamically.</p>'+
									'<p><a href="#" class="link popup-close">Close me</a></p>'+
								  '</div>'+
								'</div>',*/
					  // Events
					  on: {
						open: function (popup) {
						  console.log('Popup open');
						  
						  App.methods.setInStorage({name: 'downloadPlayer', data: '1'});	
						},
						opened: function (popup) {
						  console.log('Popup opened');
						},
					  }
					});
					
					 dynamicPopup.open();
			 
				}
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
        getFromStorage: function(name){
            var ret = [];
            var str = '';
            if (name) {
                switch (name){
                    case 'downloadPlayer':
                        str = localStorage.getItem("COM.QUIKTRAK.DASHCAM.DOWNLOADPLAYER");
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
                    case 'downloadPlayer':
                        localStorage.setItem("COM.QUIKTRAK.DASHCAM.DOWNLOADPLAYER", JSON.stringify(params.data));
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
		getRecordVideoList: function(resolve, reject){ 		
			return new Promise((resolve, reject) => {
				
				window.cordova.plugin.ftp.connect('192.168.43.1:10011', 'admin', 'admin', function(ok) {
						//window.cordova.plugin.ftp.connect('192.168.43.1:10011', '357730090913204', '99999999', function(ok) {
						//window.cordova.plugin.ftp.connect('quiktrak.ftp.tools', 'quiktrak_biletskiy', '4eBcgg9S1N5I', function(ok) {
						
							console.info("ftp: connect ok=" + ok);
							
							// You can do any ftp actions from now on...
							
							// /storage/sdcard0/DVRMEDIA/Remote/PHOTO
							window.cordova.plugin.ftp.ls('/storage/sdcard1/DVRMEDIA/CarRecorder/GENERAL/2020_03_16', function(result) {
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

