
const db = require('electron-db');
const electron = require('electron');
const app = electron.app || electron.remote.app;

function getUsername(tableName){

    /*
      @params: tablename
      @username: username
      will return registered username
    */
}

function checkUniqueness(username){
  /*
    get all the registered uesrs from the remote server, and check it against username
  */
  var flag = getRemoteUsers()
            .then(result => {
              return result.includes(username); //if the username is found on the list, true is returned else false;
            })
            .catch(err => {
                console.log("There was an error fetching the username, please try again later!:\n"+err);
                return false;
            });
  return flag;
}

function getRemoteUsers(callback){
  return new Promise((resolve, reject) => {
    $.ajax({
            type: "GET",
            url: "http://75.65.50.70/birb_db/data_handler.php",
            data: "username", // serializes the form's elements.
            dataType:"json",
            contentType: 'application/json',
            success: resolve,
            error: reject
        });
  });

}
