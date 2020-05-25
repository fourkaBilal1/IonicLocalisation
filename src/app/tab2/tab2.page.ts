import { Component } from '@angular/core';
import { icon, Map, tileLayer, marker } from 'leaflet';
import {Router, NavigationExtras } from '@angular/router';
import {NativeGeocoder,NativeGeocoderOptions} from "@ionic-native/native-geocoder/ngx";


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  map: Map;
  address:string[];
  newMarker:any ;
  constructor(private geocoder: NativeGeocoder,private router:Router){
    setInterval(() => { 
      this.map.locate({setView:false}).on("locationfound", (e: any)=> {
      
        this.newMarker.setLatLng(e.latlng); 
        //this.newMarker.bindPopup("You are located here!").openPopup();
        this.getAddress(e.latitude, e.longitude);
        this.newMarker.on("dragend", ()=> {
          const position = this.newMarker.getLatLng();
          this.getAddress(position.lat, position.lng);
         });
      });
   }, 10000);
  }
  // The below function is added
  ionViewDidEnter(){
    this.loadMap();
  }
  // The below function is added
  loadMap(){
    this.map = new Map("mapId").setView([17.3850,78.4867], 13);
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY- SA</a>'})
        .addTo(this.map); // This line is added to add the Tile Layer to our map
    this.newMarker= marker([0,0], {draggable: 
      true,icon: icon({
        iconSize: [ 25, 41 ],
        iconAnchor: [ 13, 41 ],
        iconUrl: 'leaflet/marker-iconPersonalized.png',
        shadowUrl: 'leaflet/marker-shadow.png'
      })}).addTo(this.map);
  }
    goBack(){
    this.router.navigate(["tabs/tab1"]);
  }
  locatePosition(){
    this.map.locate({setView:true}).on("locationfound", (e: any)=> {
      
      this.newMarker.setLatLng(e.latlng); 
      //this.newMarker.bindPopup("You are located here!").openPopup();
      this.getAddress(e.latitude, e.longitude);
      this.newMarker.on("dragend", ()=> {
        const position = this.newMarker.getLatLng();
        this.getAddress(position.lat, position.lng);
       });
    });
  }
  getAddress(lat: number, long: number) {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    this.geocoder.reverseGeocode(lat, long, options).then(results => {
      this.address = Object.values(results[0]).reverse();
      
    });
  }
// The function below is added
  confirmPickupLocation() {
    let navigationextras: NavigationExtras = {
      state: {
        pickupLocation: this.address
      }
    };
    this.router.navigate(["tabs/tab1"], navigationextras);
  }
}
