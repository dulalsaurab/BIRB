const db = require('electron-db');
const electron = require('electron');

const app = electron.app || electron.remote.app;

function createUser(username,flag) {
    if (flag=='L') var tablename = "L_"+username;
    else var tablename = "R_"+username

    db.createTable(tablename, (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    })
}
