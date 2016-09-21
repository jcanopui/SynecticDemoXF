import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, NavController, Menu, Platform} from 'ionic-angular';
import * as helpers from './directives/helpers';
/*import * as Hockeyapp from './hockeyapp';'*/

// Change the import if you want to change the first page, for example:
// import { ImagePage as ActionPage } from './pages/cards/cards';
import { BasicPage as ActionPage} from './pages/action-sheets/action-sheets';

import { search } from './pipes/search'

@Component({
  templateUrl: './build/app.html',
  pipes: [search]
})
class DemoApp {
  rootPage: any;

  @ViewChild('content') content: NavController;

  pages = Object.keys(helpers.getPages());

  constructor(platform: Platform/*, hockeyapp: hockeyapp*/) {
    this.rootPage = ActionPage;
    
    platform.ready().then(() => {

        /*Hockeyapp.*/hockeyapp.start(() => {
          //alert('succes')
        }, () => {
          alert('Can\'t register to Hockeyapp')
        }, "4704d6dc8f5f49f7861dea3f83d83ff0");
    })
    
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