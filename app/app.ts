import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, NavController, Menu, Platform } from 'ionic-angular';
import * as helpers from './directives/helpers';
import { AppVersion, Push } from 'ionic-native';
import { BasicPage as ActionPage } from './pages/action-sheets/action-sheets';
import { search } from './pipes/search'
import { Http } from '@angular/http';

declare var ENVIRONMENT;
declare var BUILD_TYPE;

@Component({
  templateUrl: './build/app.html',
  pipes: [search]
})
class DemoApp {

  rootPage: any;
  versionNumber = 'unknown';
  environment = ENVIRONMENT + ' environment';

  @ViewChild('content') content: NavController;

  pages = Object.keys(helpers.getPages());

  constructor(public platform: Platform,
              private http: Http) {

    this.rootPage = ActionPage;
    
    platform.ready().then(() => {

      this.setUpHockeyApp();
      this.setUpPushNotifications();
    })

    this.loadAppVersionString();
  }

  setUpHockeyApp() {

    //Run when platform ready / view loaded

    var androidAppId = "4704d6dc8f5f49f7861dea3f83d83ff0";
    var iosAppId = "a3ded9df83b54995b33e91b5986903cb";
    var windowsPhoneAppId = "df9f8027e5ed4bd39f8c4e0f85b3fe5e";
    var windowsAppId = "c2c5d7b3550844ea9c9bc9166f924348";
    var appId = "";

    if (this.platform.is('ios')) {
      appId = iosAppId;
    }
    else if (this.platform.is('android')) {
      appId = androidAppId;
    }
    else if (this.platform.is('windows') && this.platform.is('mobile')) {
      appId = windowsPhoneAppId;
    }
    else if (this.platform.is('windows')) {
      appId = windowsAppId;
    }

    if (appId != "") {
      hockeyapp.start(null, null, appId);
    }
  }

  setUpPushNotifications() {

    let push = Push.init({
        android: {
            senderID: "669988095592"
        },
        ios: {
            alert: "true",
            badge: false,
            sound: "true"
        },
        windows: {}
    });

    push.on('registration', (data) => {

      let token = "[Synectic] device token -> " + data.registrationId;
      console.log(token);

      this.registerTokenToAws(data.registrationId);
    });

    push.on('notification', (data) => {

        console.log('[Synectic] message', data.message);

        let self = this;
        
        if (data.additionalData.foreground) {

            alert(data.message);
        } else {

            console.log("[Synectic] Push notification clicked");
        }
    });

    push.on('error', (e) => {
        console.log("[Synectic] " + e.message);
    });
  }

  post(url, data) {
    return this.http.post(url, data);
  }

  registerTokenToAws(token) {

    var platform = "";

    if (this.platform.is('ios')) {
      platform = BUILD_TYPE == "Distribution" ? "iosProd" : "iosDev";
    }
    else if (this.platform.is('android')) {
      platform = "android";
    }
    else if (this.platform.is('windows')) {
      platform = "windows"
    }

    if (platform != "") {

      let url = '';

      if(this.platform.is('mobile')) {
        url = 'https://d4w69355hi.execute-api.us-east-1.amazonaws.com/DEV/registerpush';
      }
      else {
        url = '/DEV/registerpush';
      }

       let body = {
        "platform": platform,
        "token": token,
        "identifier": ""
      };

      console.log("[Synectic] Going to register to url: " + url);
      console.log("[Synectic] With body: " + body.platform);

      this.post(url,body).map(res => res.json()).subscribe(data => {

        console.log("[Synectic] Token registered to AWS: " + data);
      }, error => {

        console.log("[Synectic] error:" + error);
        alert(error)
      });
    }
  }

  loadAppVersionString() {

    if(this.platform.is('cordova')) {

      var versioncode;
      var versionnumber;

      AppVersion.getVersionNumber().then((s) => {
        versionnumber = s;

        AppVersion.getVersionCode().then((s) => {
          versioncode = s;

          this.versionNumber = versionnumber + ' ' + versioncode;
        });
      });
    }
  }

  openPage(page) {

    if (page == 'Crash report test') {
      hockeyapp.forceCrash(null,null);
    }
    else {
      this.content.setRoot(helpers.getPageFor(page), {}, { animate: false });
    }
  }
}

ionicBootstrap(DemoApp, null, {
platforms: {
      ios: {
        statusbarPadding: true
      }
    }
});

export interface hockeyapp {
start: (success: any, failure: any, appId: any, autoSend?: any, ignoreDefaultHandler?: any, loginMode?:any, appSecret?: any) => void;
feedback: (success: any, failure: any) => void;
forceCrash: (success: any, failure: any) => void;
checkForUpdate: (success: any, failure: any) => void;
addMetaData: (success: any, failure: any, data: any) => void;
trackEvent: (success: any, failure: any, eventName: any) => void;

loginMode: {
ANONYMOUS: any,
EMAIL_ONLY: any,
EMAIL_PASSWORD: any,
VALIDATE: any
}
}
declare var hockeyapp:hockeyapp;
