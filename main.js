/*
  Modules to control application and create browser windows
*/
const {app, BrowserWindow} = require('electron');
const path = require('path');
const StoreData = require('./user_data/store.js');
// const Store = require('./lib/user_management.js');
const birb = require('./user_data/birb.js');
const _nfd = require('./lib/nfd_operations.js');
const um = require('./lib/user_management');


let mainWindow;

const store = new StoreData({
    configName: 'user-preferences',
    defaults: {
        // 800x600 is the default size of our window
        windowBounds: { width: 800, height: 600 }
    }
});

function createWindow () {
    // Create the browser window.

    let { width, height } = store.get('windowBounds');

    mainWindow = new BrowserWindow({width, height});
    mainWindow.loadFile('login.html');

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', function() {

    let { width, height } = store.get('windowBounds');

    mainWindow = new BrowserWindow({ width, height });

    mainWindow.on('resize', () => {
        let { width, height } = mainWindow.getBounds();
        store.set('windowBounds', { width, height });
    });
    var flag = um.checkIfUserExist();
    if (flag){
        mainWindow.loadURL('file://' + path.join(__dirname, 'index.html'));
    }
    else {
        mainWindow.loadURL('file://' + path.join(__dirname, 'login.html'));
    }
});

app.on('window-all-closed', function () {

    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {

    if (mainWindow === null) {
        createWindow()
    }
});

// Export the public available functions
module.exports = {
    // getUsername,
    // getAppDataPath
};

//All the main processes can go here, otherwise, it can go on some other file but needs require here

