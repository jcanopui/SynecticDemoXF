import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Platform, LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/map';

@Component({
  templateUrl: './build/pages/networking/synectic/template.html'
})

export class SynecticPage {
  
	items = [];
  apiResponseVisible = false;

  private username = 'demowsuser';
  private password = 'demowsuser';

  filter: any;

  constructor(
    public platform: Platform,
    private http: Http,
    public loadingCtrl: LoadingController
  ) {}

  createAuthorizationHeader(headers:Headers) {
    headers.append('Authorization', 'Basic ' +
      btoa(this.username+':'+this.password)); 
  }

  post(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post(url, data, {
      headers: headers
    });
  }

  makeNetworkCall() {

    let data = {
      "appId": this.filter,
      "typeId": "",
      "language": "",
      "name": "",
      "key": ""
    };

    let loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });

    let url = '';

    if(this.platform.is('ios')) {
      url = 'https://mobilityi.agbar.net/mobility-server/services/keyvalueService';
    }
    else {
      url = '/services/keyvalueService';
    }

    loading.present();
    this.post(url,data).map(res => res.json()).subscribe(data => {
            console.log(data);
            this.items = data.values;
            this.apiResponseVisible = true;
            loading.dismiss();
        }, error => {
          console.log(error);
          loading.dismiss();
          alert(error._body);
        });
  }
}