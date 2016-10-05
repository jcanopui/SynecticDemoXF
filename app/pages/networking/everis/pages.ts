import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Platform, reorderArray, ActionSheetController, LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/map';

@Component({
  templateUrl: './build/pages/networking/everis/template.html'
})

export class EverisPage {
  
	items = [];
  columnNameButtonText = "Column name";
  ascDescButtonText = "Ascending / Descending";
  apiResponseVisible = false;

  constructor(
    public platform: Platform,
    private http: Http,
    public actionsheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController
  ) {}

  post(url, data) {
    return this.http.post(url, data);
  }

  makeNetworkCall() {

    let loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });

    let url = '';

    if(this.platform.is('ios')) {
      url = 'https://d4w69355hi.execute-api.us-east-1.amazonaws.com/DEV/keyvalue';
    }
    else {
      url = '/DEV/keyvalue';
    }

    loading.present();
    this.post(url,{}).map(res => res.json()).subscribe(data => {
            this.items = data.values;
            this.apiResponseVisible = true;
            loading.dismiss();
        }, error => {
          loading.dismiss();
          alert(error)
        });
  }

  reorderItems(indexes) {
    this.items = reorderArray(this.items, indexes);
  }

  orderArray() {

    var aux = this.columnNameButtonText;
    var aux2 = this.items;
    var aux3 = this.ascDescButtonText;

    if (aux != "Column name" && aux3 != "Ascending / Descending") {
      // temporary array holds objects with position and sort-value
      var mapped = aux2.map(function(el, i) {
        return { index: i, value: el[aux].toLowerCase() };
      })

      // sorting the mapped array containing the reduced values
      mapped.sort(function(a, b) {
        if (aux3 == "ascending") {
          return +(a.value > b.value) || +(a.value === b.value) - 1;
        }
        else {
          return +(a.value < b.value) || +(a.value === b.value) - 1;
        }
      });

      // container for the resulting order
      var result = mapped.map(function(el){
        return aux2[el.index];
      });

      this.items = result;
    }
  }

  openMenuColumnNames() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Filter by column:',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'typeId',
          handler: () => {
            this.columnNameButtonText = 'typeId';
            this.orderArray();
          }
        },
        {
          text: 'language',
          handler: () => {
            this.columnNameButtonText = 'language';
            this.orderArray();
          }
        },
        {
          text: 'name',
          handler: () => {
            this.columnNameButtonText = 'name';
            this.orderArray();
          }
        },
        {
          text: 'key',
          handler: () => {
            this.columnNameButtonText = 'key';
            this.orderArray();
          }
        },
        {
          text: 'value',
          handler: () => {
            this.columnNameButtonText = 'value';
            this.orderArray();
          }
        }
      ]
    });
    actionSheet.present()
  }

  openMenuAscDsc() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Filter by column:',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'ascending',
          handler: () => {
            this.ascDescButtonText = 'ascending';
            this.orderArray();
          }
        },
        {
          text: 'descending',
          handler: () => {
            this.ascDescButtonText = 'descending';
            this.orderArray();
          }
        }
      ]
    });
    actionSheet.present()
  }
}