import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, NavController, Menu} from 'ionic-angular';
import * as helpers from './directives/helpers';

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

  constructor() {

    this.rootPage = ActionPage;
  }

  openPage(page) {

    this.content.setRoot(helpers.getPageFor(page), {}, { animate: false });
  }

}

ionicBootstrap(DemoApp);
