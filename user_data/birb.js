const db = require('electron-db');
const electron = require('electron');

const app = electron.app || electron.remote.app;

function create_user(username) {
    db.createTable(username, (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    })
}
