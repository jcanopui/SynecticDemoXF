import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, NavController, Menu, Platform } from 'ionic-angular';
import * as helpers from './directives/helpers';
import { AppVersion, Push } from 'ionic-native';
import { BasicPage as ActionPage } from './pages/action-sheets/action-sheets';
import { search } from './pipes/search'

declare var ENVIRONMENT;

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

  constructor(public platform: Platform) {

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
        console.log("device token ->", data.registrationId);
        //TODO - send device token to server
    });

    push.on('notification', (data) => {
        console.log('message', data.message);
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
            console.log("Push notification clicked");
        }
    });

    push.on('error', (e) => {
        console.log(e.message);
    });
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
