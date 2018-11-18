/*
  Modules to control application life and create native browser window
*/
const {app, BrowserWindow} = require('electron')
const path = require('path');
const Store = require('./user_data/store.js');
// const Store = require('./lib/user_management.js');
const birb = require('./user_data/birb.js');
const _nfd = require('./lib/nfd_operations.js')

/*

  Keep a global reference of the window object, if you don't, the window will
  be closed automatically when the JavaScript object is garbage collected.
  check if user table exists or not, if exist, load homepage else load loging page

*/

const fs = require('fs');
const os = require('os');
var shell = require('shelljs');
global.username = "someting";

function getUsername(path){

  var res = path.split("/");
  console.log(res)
  for (var item in res){
    var boo = res[item].includes(".json")
    /*
      this section needs future attention, constant values are checked,
      needs to replace it with some generic solution
    */
    if (boo)
    {
      var candidate = res[item].replace(".json", "")
      try {
        var withouthPrefix = candidate.replace("L_","");
        var withoutSuffix = withouthPrefix.replace("_birb","");
        return withoutSuffix
      } catch (e) {
        console.log(e);
        continue;
      }
    }
  }

}

function checkIfUserExist(){
  // get platform name, and the location where user data is stored
  const platform = os.platform();
  let appName = '';
  if (JSON.parse(fs.readFileSync('package.json', 'utf-8')).productName) {
    appName = JSON.parse(fs.readFileSync('package.json', 'utf-8')).productName;
  }else{
    appName = JSON.parse(fs.readFileSync('package.json', 'utf-8')).name;
  }
  let userdata='';
  if (platform === 'win32') {
    userData = path.join(process.env.APPDATA, appName);
  } else if (platform === 'darwin') {
    userData = path.join(process.env.HOME, 'Library', 'Application Support', appName);
  } else {
    userData = path.join('var', 'local', appName);
  }
  /*
    since we have modified the user data storage location to userData,
    it is appended with the path userData
  */
  userData=userData+"/userData"
  /*
    user file always starts with L_*,
    so if it exists users is already register
  */
  var outPut = shell.ls(userData+'/L_*.json');
  if (outPut['stdout']=='') {console.log("No register user found on the system"); return false}
  else {
    console.log("user already register");
    /* get the user name*/
    global.username = getUsername(outPut['stdout'])
    return true
  }
}


let mainWindow

// First instantiate the class
const store = new Store({
  // We'll call our data file 'user-preferences'
  configName: 'user-preferences',
  defaults: {
    // 800x600 is the default size of our window
    windowBounds: { width: 800, height: 600 }
  }
});

function createWindow () {
  // Create the browser window.

  let { width, height } = store.get('windowBounds');

  mainWindow = new BrowserWindow({width, height})

  // and load the index.html of the app.
  mainWindow.loadFile('login.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

// When our app is ready, we'll create our BrowserWindow
app.on('ready', function() {

  // First we'll get our height and width. This will be the defaults if there wasn't anything saved
  let { width, height } = store.get('windowBounds');

  // Pass those values in to the BrowserWindow options
  mainWindow = new BrowserWindow({ width, height });

  // The BrowserWindow class extends the node.js core EventEmitter class, so we use that API
  // to listen to events on the BrowserWindow. The resize event is emitted when the window size changes.
  mainWindow.on('resize', () => {
    // The event doesn't pass us the window size, so we call the `getBounds` method which returns an object with
    // the height, width, and x and y coordinates.
    let { width, height } = mainWindow.getBounds();
    // Now that we have them, save them using the `set` method.
    store.set('windowBounds', { width, height });
  });
  var flag = checkIfUserExist()
  if (flag){
    mainWindow.loadURL('file://' + path.join(__dirname, 'index.html'));
  }
  else {
    mainWindow.loadURL('file://' + path.join(__dirname, 'login.html'));
  }
});


// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
