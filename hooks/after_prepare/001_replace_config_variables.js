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
var rootdir = process.argv[2];
var config_target = process.env.config_target || "default"; // default to 'default' config
console.log("Running hook: " + path.basename(process.env.CORDOVA_HOOK));

var srcfile = path.join(rootdir, "config", "config-" + config_target + ".js");
 
// Define the destination paths for the config.js file for each platform
var configFilesToReplace = {
    "android" : "platforms/android/assets/www/config.js",
    "ios" : "platforms/ios/www/config.js"
}; 
    
var platforms = process.env.CORDOVA_PLATFORMS.split(',');
 
for(var i=0; i < platforms.length; i++) {
    console.log("Modifying config for platform " + platforms[i] + ", config_target=" + config_target);
    var destfile = path.join(rootdir, configFilesToReplace[platforms[i]]);
 
    if (!fs.existsSync(srcfile)) {
         throw "Missing config file: "+srcfile;
    } else {
        console.log("copying " + srcfile + " to " + destfile);
 
        var srcContent = fs.readFileSync(srcfile, 'utf8');
        fs.writeFileSync(destfile, srcContent, 'utf8');
    }
}