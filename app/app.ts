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

    var androidAppId = "80af16316b7947c689d9e6e1baaecad7";
    var iosAppId = "";
    var appId = "";

    if (this.platform.is('ios')) {
      appId = iosAppId;
    }
    else if (this.platform.is('android')) {
      appId = androidAppId;
    }

    if (appId != "") {
      hockeyapp.start(null, null, appId);
    }
  }

  setUpPushNotifications() {

    let push = Push.init({
        android: {
            senderID: "1065449596508"
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
        //if user using app and push notification comes
        if (data.additionalData.foreground) {
            // if application open, show popup

            alert(data.message);
            /*
            let confirmAlert = Alert.create({
                title: 'New Notification',
                message: data.message,
                buttons: [{
                    text: 'Ignore',
                    role: 'cancel'
                }, {
                    text: 'View',
                    handler: () => {
                        //TODO: Your logic here
                        //self.nav.push(SomeComponent, {message:data.message});
                    }
                }]
            });
            self.nav.present(confirmAlert);
            */
        } else {
            //if user NOT using app and push notification comes
            //TODO: Your logic on click of push notification directly
            //self.nav.push(SomeComponent, {message:data.message});
            console.log("[Synectic] Push notification clicked");
        }
    });

    push.on('error', (e) => {
        console.log(e.message);
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

    if (platform != "") {

      let url = '';

      if(this.platform.is('mobile')) {
        url = 'https://afk7z1jag6.execute-api.us-east-1.amazonaws.com/dev/push/registration';
      }
      else {
        url = '/dev/push/registration';
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
