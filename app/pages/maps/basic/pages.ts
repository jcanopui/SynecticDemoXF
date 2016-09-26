import { Component, ViewChild, ElementRef } from '@angular/core';
import { Geolocation } from 'ionic-native';

declare var google;

@Component({
  templateUrl: './build/pages/maps/basic/template.html'
})

export class MapsPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor() { }

  ionViewDidEnter() {

  	this.initializeMap();
  }

  initializeMap() {

    
	let latLng = new google.maps.LatLng(41.7278126, 1.8002584);
 
	let mapOptions = {
	  center: latLng,
	  zoom: 8,
	  mapTypeId: google.maps.MapTypeId.ROADMAP
	}

	this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    
	this.getCurrentLocation();
  }

  getCurrentLocation() {

  	let locationOptions = {timeout: 10000, enableHighAccuracy: true};

	Geolocation.getCurrentPosition(locationOptions).then((position) => {
 
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.addMarker();
 
    }, (err) => {
      console.log(err);
    });
  }

  addMarker(){
 
	  let marker = new google.maps.Marker({
	    map: this.map,
	    animation: google.maps.Animation.DROP,
	    position: this.map.getCenter()
	  });
	 
	  let content = "<h4>You are HERE!</h4>";          
	 
	  this.addInfoWindow(marker, content);
  }

  addInfoWindow(marker, content){
 
  let infoWindow = new google.maps.InfoWindow({
    content: content
  });
 
  google.maps.event.addListener(marker, 'click', () => {
    infoWindow.open(this.map, marker);
  });
 
}
}