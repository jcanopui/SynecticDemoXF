import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Platform, reorderArray } from 'ionic-angular';
import 'rxjs/add/operator/map';

@Component({
  templateUrl: './build/pages/networking/networking.html'
})

export class BasicPage {
  
	posts: any;

  constructor(
    public platform: Platform,
    private http: Http
  ) {}

  post(url, data) {
    return this.http.post(url, data);
  }

  makeNetworkCall() {

    let url = '';

    if(this.platform.is('mobile')) {
      url = 'https://d4w69355hi.execute-api.us-east-1.amazonaws.com/DEV/keyvalue';
    }
    else {
      url = '/DEV/keyvalue';
    }

    this.post(url,{}).map(res => res.json()).subscribe(data => {
            this.posts = data.values;
        }, error => {
          alert(error)

        });
  }

  reorderItems(indexes) {
    this.posts = reorderArray(this.posts, indexes);
  }
}