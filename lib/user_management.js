
/*

  This script will help to do the user management stuffs
  Status:
  Author: @Saurab Dulal

*/

// const db = require('electron-db');
// const electron = require('electron');
// const app = electron.app || electron.remote.app;




var shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const os = require('os');
var shell = require('shelljs');


global.obj = {'username': ""};

function getUsername(tableName){

    /*
      @params: tablename
      @username: username
      will return registered username
    */
}

function getAllFollowedUser(){
    let names = Array();
    var appDataPath = getAppDataPath();
    var outPut = shell.ls(appDataPath+'/R_*_birb.json');
    // trim the standard output and break it by return (\n) and get the usernames
    var followee = outPut['stdout'].trim().split("\n");
    for (var i in followee){
        names.push(getUsername(followee[i],"R"))
    }
    return names
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

function getUsername(path, flag){

    var res = path.split("/");
    for (var item in res){
        var boo = res[item].includes(".json");
        /*
          this section needs future attention, constant values are checked,
          needs to replace it with some generic solution
        */
        if (boo)
        {
            var candidate = res[item].replace(".json", "");
            try {
                var withouthPrefix = candidate.replace(flag+"_","");
                var withoutSuffix = withouthPrefix.replace("_birb","");
                return withoutSuffix
            } catch (e) {
                console.log(e);

            }
        }
    }

}
function getAppDataPath(){
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
    userData = userData+"/userData";

    return userData;

}

function checkIfUserExist(){
    /*
      user file always starts with L_*,
      so if it exists users is already register
    */
    userData = getAppDataPath();
    var outPut = shell.ls(userData+'/L_*.json');
    if (outPut['stdout']=='') {console.log("No register user found on the system"); return false}
    else {
        console.log("user already register");
        /* get the user name*/
        global.obj.username = getUsername(outPut['stdout'], "L");
        return true
    }
}

// export all the listed public modules
module.exports = {
    checkUniqueness,
    checkIfUserExist,
    getAppDataPath,
    getUsername,
    getRemoteUsers,
    getAllFollowedUser,
    getUsername
};
