var win = nw.Window.get();
/**
 * starts all functions in die file
 */
(function() {
  autoReloadPage();
  win.showDevTools();
  // console.log("test1");
  // setupMenu();
  // setupCfg();
  // setupKeyBindings();
})();

/**
 * sets global Variables and configuration parameters
 */

// function setupCfg() {
// if (global.cfg === undefined) global.cfg = {}; //short if
// if (global.mapLayers === undefined) global.mapLayers = {};
// if (global.mapFeatures === undefined) global.mapFeatures = {};

// if (localStorage.imuAccelCalX === undefined) localStorage.imuAccelCalX = 0;
// if (localStorage.imuAccelCalY === undefined) localStorage.imuAccelCalY = 0;
// if (localStorage.imuAntennaHeight === undefined) localStorage.imuAntennaHeight = 0;

// global.cfg.imuAccelCalX = parseFloat(localStorage.imuAccelCalX);
// global.cfg.imuAccelCalY = parseFloat(localStorage.imuAccelCalY);
// global.cfg.imuAntennaHeight = parseInt(localStorage.imuAntennaHeight);
// global.cfg.sensorConnected = false;

// global.win = gui.Window.get();
// global.pageReloaded = true; //shows if page is reloaded

// if (localStorage.mapProxyPath === undefined) localStorage.mapProxyPath = "";
// if (localStorage.mapProxyStartArgs === undefined) localStorage.mapProxyStartArgs = "";
// if (localStorage.mapProxyHost === undefined) localStorage.mapProxyHost = "192.168.1.104";
// if (localStorage.mapProxyPort === undefined) localStorage.mapProxyPort = 8080;

// global.cfg.mapProxyHost = localStorage.mapProxyHost;
// global.cfg.mapProxyHostPort = parseInt(localStorage.mapProxyPort);
// global.cfg.mapProxyPath = localStorage.mapProxyPath;
// global.cfg.mapProxyStartArgs = localStorage.mapProxyStartArgs.split(",");

// if (localStorage.rtklibPath === undefined) localStorage.rtklibPath = 'tools\\rtklib\\rtknavi_mkl.exe';
// if (localStorage.rtklibPort === undefined) localStorage.rtklibPort = 8000;
// if (localStorage.rtklibMonitorPort === undefined) localStorage.rtklibMonitorPort = 52001;
// if (localStorage.rtklibStartArgs === undefined) localStorage.rtklibStartArgs = "";

// global.cfg.rtklibPath = localStorage.rtklibPath;
// global.cfg.rtklibPort = parseInt(localStorage.rtklibPort);
// global.cfg.rtklibMonitorPort = parseInt(localStorage.rtklibMonitorPort);
// global.cfg.rtklibStartArgs = localStorage.rtklibStartArgs.split(",");
// global.cfg.rtklibStatus = 0; //0 = not running, 1 = running but not started, 2 = tcp-server started

// if (localStorage.sensorDevicePath === undefined) localStorage.sensorDevicePath = "/dev/serial/by-id/usb-FTDI_USB_Serial_Converter_FTFVL144-if00-port0"; // /dev/serial/by-id/usb-FTDI_USB_Serial_Converter_FTFVL144-if00-port0
// global.cfg.sensorDevicePath = localStorage.sensorDevicePath;
// if (localStorage.sensorControlerHost === undefined) localStorage.sensorControlerHost = "192.168.1.104"; // /dev/serial/by-id/usb-FTDI_USB_Serial_Converter_FTFVL144-if00-port0
// global.cfg.sensorControlerHost = localStorage.sensorControlerHost;
// if (localStorage.sensorControlerPort === undefined) localStorage.sensorControlerPort = 8010; // /dev/serial/by-id/usb-FTDI_USB_Serial_Converter_FTFVL144-if00-port0
// global.cfg.sensorControlerPort = localStorage.sensorControlerPort;
// if (localStorage.imuSensorSpeed === undefined) localStorage.imuSensorSpeed = 500;
// global.cfg.imuSensorSpeed = parseInt(localStorage.imuSensorSpeed);
// if (localStorage.ctrlEnableEcho === undefined) localStorage.ctrlEnableEcho = true;
// global.cfg.ctrlEnableEcho = JSON.parse(localStorage.ctrlEnableEcho);

// if (localStorage.hydroSpeed === undefined) localStorage.hydroSpeed = 500;
// global.cfg.hydroSpeed = parseInt(localStorage.hydroSpeed);
// if (localStorage.hydroDuration === undefined) localStorage.hydroDuration = 200;
// global.cfg.hydroDuration = parseInt(localStorage.hydroDuration);
// if (localStorage.hydroDevicePath === undefined) localStorage.hydroDevicePath = "/dev/serial/by-id/usb-Silicon_Labs_CP2102_USB_to_UART_Bridge_Controller_01286-if00-port0";
// global.cfg.hydroDevicePath = localStorage.hydroDevicePath;
// if (localStorage.hydroAutoSteer === undefined) localStorage.hydroAutoSteer = false;
// global.cfg.hydroAutoSteer = JSON.parse(localStorage.hydroAutoSteer);

// if (localStorage.gpsLowPass === undefined) localStorage.gpsLowPass = 1;
// global.cfg.gpsLowPass = parseInt(localStorage.gpsLowPass);
// if (localStorage.gpsHighPass === undefined) localStorage.gpsHighPass = 20;
// global.cfg.gpsHighPass = parseInt(localStorage.gpsHighPass);

// if(localStorage.distanceFilterVal === undefined) localStorage.distanceFilterVal = 0.1;
// global.cfg.distanceFilterVal = parseFloat(localStorage.distanceFilterVal);
// if(localStorage.useFilter === undefined) localStorage.useFilter = false;
// global.cfg.useFilter = JSON.parse(localStorage.useFilter);

// if (localStorage.gpsUseCompass === undefined) localStorage.gpsUseCompass = true;
// if (localStorage.compassLineLength === undefined) localStorage.compassLineLength = 15;
// if (localStorage.driveLineMoveSpacing === undefined) localStorage.driveLineMoveSpacing = 10;
// if (localStorage.driveLineSpacing === undefined) localStorage.driveLineSpacing = 130;
// global.cfg.gpsUseCompass = JSON.parse(localStorage.gpsUseCompass); //localstorage only stores strings, so we need JSON.parse to make a real bool out of the string
// global.cfg.compassLineLength = parseInt(localStorage.compassLineLength);
// global.cfg.driveLineMoveSpacing = parseInt(localStorage.driveLineMoveSpacing);
// global.cfg.driveLineSpacing = parseInt(localStorage.driveLineSpacing); //in cm

// if (localStorage.mapAutoCenter === undefined) localStorage.mapAutoCenter = true;
// if (localStorage.mapShowWMSLayer === undefined) localStorage.mapShowWMSLayer = false;
// global.cfg.mapAutoCenter = JSON.parse(localStorage.mapAutoCenter); //when reload, sets center of map to current point
// global.cfg.mapShowWMSLayer = JSON.parse(localStorage.mapShowWMSLayer); //if true shows wms layer

// if (global.mapFeatures.driveLineListLeft === undefined) global.mapFeatures.driveLineListLeft = [];
// if (global.mapFeatures.driveLineListRight === undefined) global.mapFeatures.driveLineListRight = [];

// if (global.cfg.driveLineListSide === undefined) global.cfg.driveLineListSide = 0;
// if (global.cfg.driveLineListIndexCurrent === undefined) global.cfg.driveLineListIndexCurrent = -1;

// if (localStorage.driveLineArea !== undefined) {
//     $('#statusHeader_driveLineArea').html(localStorage.driveLineArea);
// }

// global.win.x = -1920;
// global.win.y = 562;

// global.win.showDevTools();
// }

/**
 * auto reloads page in node-webkit everytime something is changed
 */

function autoReloadPage() {
  var fs = require("fs");

  fs.watch("./", [], function() {
    if (location) location.reload(false);
  });
}
/**
 * sets up keybindings for control over keyboard
 *
 * ctrl + r             reload page
 * ctrl + shift + r     reload application
 * ctrl + d             open devtool
 *
 * ctrl + b             move driveline left fast
 * ctrl + shift + b     move driveline left slow
 * ctrl + n             move driveline right fast
 * ctrl + shift + n     move driveline right slow
 * 
 * a                    switch active driveline left
 * s                    switch active driveline right
 * t                    make driveline longer
 * g                    make driveline shorter
 *
 * ctrl + shift + w     set driveLine startpoint gps
 * ctrl + shift + e     set driveLine endpoint gps
 *
 * o                    hydroDuration up 100ms
 * l                    hydroDuration down 100ms
 * 
 * 0                    singleSteer stop
 * 9                    singleSteer right
 * 8                    singleSteer left
 *
 * 5                    autoSteer
 * 4                    toggle kiosk mode
 * 3                    toogle compass
 * 2                    toggle showMap wms
 * 1                    toggle auto center
 */
// function setupKeyBindings() {
//     global.window.onkeypress = function(key) {
//         // var keyStr = "";
//         // if(key.ctrlKey) keyStr += "strg + ";
//         // if(key.shiftKey) keyStr += "shift + ";
//         // keyStr += String.fromCharCode(key.keyCode)+"|";
//         // keyStr += key.charCode;
//         // global.console.log(keyStr);
//         if (key.ctrlKey) {
//             switch (key.charCode) {
//                 case 18: // ctrl + r
//                     if (key.shiftKey) {
//                         global.win.reloadDev();
//                     } else {
//                         global.win.reload();
//                     }
//                     break;
//                 case 4: // ctrl + d open/close dev-tools
//                     if (global.win.isDevToolsOpen()) {
//                         global.win.closeDevTools();
//                     } else {
//                         global.win.showDevTools();
//                     }
//                     break;
//                 case 2: // ctrl + b move driveline left
//                     moveDriveLineLeft((key.shiftKey) ? 500 : 200); //if shift move faster
//                     break;
//                 case 14: // ctrl + n move driveline right
//                     moveDriveLineRight((key.shiftKey) ? 500 : 200);
//                     break;
//                 case 23: // ctrl + shift + w
//                     if (key.shiftKey) $('#btnGpsStartPoint').click();
//                     break;
//                 case 5: // ctrl + shift + e
//                     if (key.shiftKey) $('#btnGpsEndPoint').click();
//                     break;
//                 case 15: // ctrl+o hydroSpeed up
//                     $('#txtHydroSpeed').spinner('stepUp', 1);
//                     break;
//                 case 12: // ctrl+l hydroSpeed down
//                     $('#txtHydroSpeed').spinner('stepDown', 1);
//                     break;
//             }
//         } else {
//             switch (key.charCode) {
//                 case 97: // a switch active driveline left
//                     switchDriveLineLeft();
//                     break;
//                 case 50: // 2 toggle show wms map
//                     $('#btnToogleMapShowWMS').click();
//                     break;
//                 case 115: //s switch active driveline right
//                     switchDriveLineRight();
//                     break;
//                 case 49: //1 toggle autocenter
//                     $('#btnToogleMapAutoCenter').click();
//                     break;
//                 case 111: // o hydroduration up
//                     $('#txtHydroDuration').spinner('stepUp', 1);
//                     break;
//                 case 108: // l hydroduration down
//                     $('#txtHydroDuration').spinner('stepDown', 1);
//                     break;
//                 case 51: // 3 toggle compass
//                     $('#btnGpsUseCompass').click();
//                     break;
//                 case 52: //4 toggle kiosk mode
//                     global.win.toggleKioskMode();
//                     break;
//                 case 53: //5 toggle autoSteer
//                     $('#btnHydroAutoSteer').click();
//                     break;
//                 case 56: //8 singleSteer left
//                     $('#btnHydroSingleLeft').click();
//                     break;
//                 case 57: //9 singleSteer right
//                     $('#btnHydroSingleRight').click();
//                     break;
//                 case 48: //0 hydro stop
//                     $('#btnHydroStop').click();
//                     break;
//                 case 116: //t make driveline longer
//                     changeLengthDriveLine(10);
//                     break;
//                 case 103: //g make driveline shorter
//                     changeLengthDriveLine(-10);
//                     break;
//                 case 90: // shift + z lowPass up
//                     if(key.shiftKey)$('#txtLowPass').spinner('stepUp', 1);
//                     break;
//                 case 72: // shift + h lowPass down
//                     if(key.shiftKey)$('#txtLowPass').spinner('stepDown', 1);
//                     break;
//                 case 85: // shift + u highPass up
//                     if(key.shiftKey)$('#txtHighPass').spinner('stepUp', 1);
//                     break;
//                 case 74: // shift + j highPass down
//                     if(key.shiftKey)$('#txtHighPass').spinner('stepDown', 1);
//                     break;
//             }
//         }
//     };
// }
// function setupMenu() {
//     // Load native UI library
//     // Create an empty menu
//     var menu = new gui.Menu({
//         type: 'menubar'
//     });
//     var cp = require('child_process');
//     var child;
//     // starts child process from menu click
//     menu.append(new gui.MenuItem({
//             label: 'bla',
//             click: function() {
//                 if (child === undefined || child.killed) {
//                     child = cp.fork('F:\\gitProjects\\trakgui_win\\js\\child.js', {
//                         execPath: "C:\\Proggis\\PortableApps\\nodist\\v\\0.10.25\\node.exe"
//                     });
//                     child.on('message', function(m) {
//                         // Receive results from child process
//                         console.log('received: ' + m);
//                     });
//                     child.send("startgps");
//                 }
//             }
//         }
//     ));
//     // kills child process from menu klick
//     menu.append(new gui.MenuItem({
//             label: 'bla1',
//             click: function() {
//                 child.kill();
//             }
//         }
//     ));
//     gui.Window.get().menu = menu;
// }
