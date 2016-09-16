import{Page, MenuController} from 'ionic-angular';
import * as helpers from '../../directives/helpers';

@Page({
    templateUrl: 'build/pages/side-menu/sidemenu.html',
    selector:'side-menu'
})

export class SideMenu {
 constructor(menu: MenuController) {
   this.menu = menu;
 }

 openMenu() {
   this.menu.open();
 }

}