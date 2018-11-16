const db = require('electron-db');
const electron = require('electron');

const app = electron.app || electron.remote.app;

function createUser(username,flag) {
    if (flag=='L') {
      var user_birb = "L_"+username+"_birb";
      var user_details = "L_"+username+"_details";
    }
    else {
      var user_birb = "R_"+username+"_birb";
      var user_details = "R_"+username+"_details";
    }
    // create two tables, one for storing birb, another for storing user details

    db.createTable(user_birb, (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    });

    db.createTable(user_details, (succ, msg) => {
      // succ - boolean, tells if the call is successful
      console.log("Success: " + succ);
      console.log("Message: " + msg);
    });
}
