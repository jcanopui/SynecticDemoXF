#!/usr/bin/env node
/**
 * Detect the current build by looking at the config_target environment variable.
 * 
 * Replace config.js with config/config-xxxx.js (where config_target=xxxx)
 * If config-xxxx.js doesn't exist, execution will fail.
 *
 * You can set the config_target as:
 *    export config_target=red
 * or right before the cordova command like this:
 *    config_target=red cordova build --release android ios
 *
 * If config_target is not available, by default "default" will be assumed.
 *    
 */
var fs = require("fs");
var path = require("path");
var rootdir = path.join(__dirname, "/..");
var config_target = process.env.config_target || "default"; // default to 'default' config
console.log("////////////// SCRIPT //////////////");

var srcfile = path.join(rootdir, "config", "config-" + config_target + ".js");
var dstfile = path.join(rootdir, "www", "config.js"); 
    
if (!fs.existsSync(srcfile)) {
         throw "Missing file: "+srcfile;
} else {
     console.log("copying " + srcfile + " to " + dstfile);
 
    var srcContent = fs.readFileSync(srcfile, 'utf8');
    var basedir = "$(PROJECT_ROOT_DIR)/" + "config"
    var disclaimer = "// THIS IS A GENERATED FILE, DO NOT EDIT, TO CHANGE SOME VALUES PLEASE REFER TO FOLDER:\n// "+basedir+"\n\n";
    fs.writeFileSync(dstfile, disclaimer + srcContent, 'utf8');
}

//Development | Distribution
var config_build = process.env.config_build || "Distribution";
fs.appendFileSync(dstfile, '\nBUILD_TYPE="'+ config_build +'"', 'utf8');

var srcfile = path.join(rootdir, "config", "app.variables." + config_target + ".scss");
var dstfile = path.join(rootdir, "app/theme", "app.variables.scss"); 
    
if (!fs.existsSync(srcfile)) {
         throw "Missing file: "+srcfile;
} else {
     console.log("copying " + srcfile + " to " + dstfile);
 
    var srcContent = fs.readFileSync(srcfile, 'utf8');
    var basedir = "$(PROJECT_ROOT_DIR)/" + "config"
    var disclaimer = "// THIS IS A GENERATED FILE, DO NOT EDIT, TO CHANGE SOME VALUES PLEASE REFER TO FOLDER:\n// "+basedir+"\n\n";
    fs.writeFileSync(dstfile, disclaimer + srcContent, 'utf8');
}

console.log("////////////////////////////////////");