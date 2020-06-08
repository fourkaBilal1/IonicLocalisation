import { Component, ViewChild,OnDestroy, OnInit} from '@angular/core';
import { Map, latLng, tileLayer, Layer, marker } from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {Router,ActivatedRoute, NavigationEnd} from '@angular/router';
import * as $ from 'jquery';
import {IonContent} from '@ionic/angular';
import { UsersService } from '../api/users.service';
import { MenuController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import {NativeGeocoder,NativeGeocoderOptions} from "@ionic-native/native-geocoder/ngx";
import { Subscription } from 'rxjs/Subscription';
import { OnEnter } from '../on-enter';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnEnter, OnDestroy {

  @ViewChild(IonContent,null) content: IonContent;
  private subscription: Subscription;
  map: Map;
  pickupLocation: string;
  messageText: any ='';
  suggestedText:any='';
  
  public messages: any = [];
  public ListGif:any=[];
  public userId=1;
  public roomId : number;
  public user : String;
  public imageclic : boolean = false;
  public activeUserMessage : String;
  public roomName : String;
  inputContainerEl = document.querySelector(".input-container");
  textInputEl = document.querySelector("ion-input#text");
  suggestionEl = document.querySelector(".suggestion-container");
  svgTabIcon = document.querySelector(".icon.tab-key");
  svgEnterIcon = document.querySelector(".icon.enter-key");

  ENTER_KEYCODE = 13;
  TAB_KEYCODE = 9;
  BACKSPACE_KEYCODE = 8;
  UP_ARROW_KEYCODE = 38;
  DOWN_ARROW_KEYCODE = 40;
  LEFT_ARROW_KEYCODE = 37;
  RIGHT_ARROW_KEYCODE = 39;
  SPACE_KEYCODE = 32;
  wordsArray = [
    "html",
    "css",
    "javascript",
    "jquery",
    "ajax",
    "react",
    "angular",
    "redux",
    "bootstrap",
    "php",
    "yii",
    "laravel",
    "codigniter",
    "mysql",
    "java",
    "python",
    "django",
    "ruby",
    "c++",
    "webpack",
    "http",
    "server",
    "programming",
    "development",
    "website",
    "app",
    "frontend",
    "backend",
    "xml",
    "api",
    "algorithm",
    "ssl",
    "enrypt",
    "decrypt",
    "code",
  ];
  suggestedWord = "";
  suggestedWordsArray = [];
  currentWordIndex = 0;
  insertText = false;

  async presentToast(S : string) {
    const toast = await this.toastController.create({
      message: S,
      duration: 2000
    });
    toast.present();
  }
  constructor(public toastController: ToastController,
              private geocoder: NativeGeocoder,
              private menu: MenuController,
              private usersService : UsersService ,
              private geolocation: Geolocation,
              private router:Router,
              private route:ActivatedRoute) {
    //const $ = require( "jquery" )( window );

    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        var datas = JSON.parse(params.special);
        this.user = datas;
        console.log(" first this.user"+this.user);
      }
    });


    this.messages = [];
    //this.messages.push({userId: 1, text: 'Hi'},{userId: 2, text: 'Hi'},{userId: 1, text: 'How are u?'},{userId: 2, text: 'fine, and you?'},{userId: 1, text: 'fine'});
    //console.log(this.messages);
    this.route.queryParams.subscribe(params =>{
      if(this.router.getCurrentNavigation().extras.state){
        this.pickupLocation = this.router.getCurrentNavigation().extras.state.pickupLocation;
      }
    });
    
    this.usersService.getSomeData().subscribe(data => {
      console.log(data)
      
      
    },
    (error) => {                              //Error callback
      console.error('error caught in component')
      this.presentToast(error.message);

      //throw error;   //You can also throw the error to a global error handler
    })

    this.usersService.getMessages().subscribe(data => {
/*      console.log("data[0]               :   ");
      console.log(data[0]);
      console.log("data[0].last_messages :   ");
      console.log(data[0].last_messages);
      console.log("messages :   ");
      console.log(this.messages);
      console.log("this.user             :  "+this.user);
      console.log("data[0].title         :  "+data[0].title);
      console.log("data[0].id      :  "+data[0].id);*/

      data[0].last_messages.forEach(element => {
        if (element.message.startsWith("http")){
          console.log('Yes :D');
          element.type = "link";
        }else{
          console.log('No :/');
          element.type = "text";
        }
      });
      this.messages = data[0].last_messages.reverse();
      //this.user = data[0].user;
      this.roomName = data[0].title;
      this.roomId = data[0].id;
      
      
      console.log(this.messages);
    },
    (error) => {                              //Error callback
      console.error('error caught in component')
      this.presentToast(error.message);

      //throw error;   //You can also throw the error to a global error handler
    });
    //this.removeClassAfterAnimationCompletes(this.inputContainerEl, "animate");
    
  }
  
  
  ionViewWillEnter(){
    console.log("ionViewWillEnter");
    this.updateScroll();
  }

  ionViewDidEnter(){
    console.log("ionViewDidEnter");
    this.updateScroll();
  }
  onpickupClick(){
    this.router.navigate(['tabs/tab2']);
  }
  sendMessage() {
    console.log('this.messageText : '+this.messageText);
    if(this.messageText != ''){
      if (this.messageText.startsWith("http")){
        console.log('Yes :D');
        
        this.messages.push({author: this.user, message: this.messageText,type:'link'});
      }else{
        console.log('No :/');
        this.messages.push({author: this.user, message: this.messageText,type:'text'});
      }
      
      this.usersService.sendMessages(this.user,this.messageText,this.roomId).subscribe(data => {
        console.log(data)
      });
      this.messageText = '';
      this.updateScroll();
      
    }
    
    
  }

  /* 
  ngOnInit(){
    this.updateScroll();
    console.log("ngOnInit");
  }*/
  
  updateScroll() {
    setTimeout(() => {
        if (this.content.scrollToBottom) {
            this.content.scrollToBottom(400);
        }
    }, 500);
      
  }
  public async ngOnInit(): Promise<void> {
      await this.onEnter();
      this.subscription = this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd && event.url === '/tabs/(tab1:tab1)') {
              this.onEnter();
          }
      });
  }

  public async onEnter(): Promise<void> {
      // do your on enter page stuff here
      console.log("onEnter");
    this.updateScroll();
  }

  public ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }
  //-----------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------
  //-------------------------------------------           Localisation         --------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------
  myLocalisation(){
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
      };
      this.geocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude, options).then(results => {
        let address = Object.values(results[0]).reverse();
        this.messageText = address.toString();
      });
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  //-----------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------
  //-------------------------------------------           GIF         -----------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------
  async gifImage(){
    var Ls=[];
    this.imageclic = !this.imageclic;
    var T = this.recup_gif(this.messageText); 
    await this.delay(300);
    //console.log(T)
    //console.log(T.length)
    T.forEach(item =>{
      //console.log(item)
      for (let i = 0; i < 2; i++) {
        
        //console.log("beeep");
        //console.log(item[i]['id']);
        Ls.push("https://media.giphy.com/media/"+item[i]['id']+"/giphy.gif")
      };
    })
    console.log(Ls)
    this.ListGif= Ls;
  }
  SendGif($event,i){
    this.messageText = this.ListGif[i];
    console.log(this.messageText);
    this.sendMessage();
  }
  recup_gif(sentence) {
    var urls = [];
    sentence = sentence.split(' ');
    let max = 2;
    let Requests = [];
    let Datas = [];
    let Ls = [];
    
    sentence.forEach(async item => {
      //console.log(item.length);
      if (item.length > 4) {
        let Request = "http://api.giphy.com/v1/gifs/search?q=" + item + "&api_key=n8p5BuwduJRE6yeczG7PULUfEeVCMelN&limit=" + max.toString();
        //console.log(Request);
        Requests.push(Request);
        //console.log(Requests);
        
        const response = await fetch(Request);
        const data = await response.json();
        

        if (data != []) {
          //console.log(data.data)
          Datas.push( data.data);

        };
      };
    })
    
    
    
    
    //console.log("Datas");
    //console.log(Datas);
    //console.log(Datas.length);
    
    

    
    /*
    Datas.forEach(item => {
      console.log("item");
      console.log(item);
      for (let i = 0; i < max; i++) {
        
        console.log("beeep");
        console.log(item['data'][i]);
        Ls.push(Datas[item]['data'][i]['embed_url'])
      };
    });*/
    return Datas;

  }
  private delay(ms: number)
  {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  //-----------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------
  //------------------------------------------------------------------ Suggestion de texte --------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------------------------------------

    suggestInsert(){
      var str = this.messageText;
      var lastIndex = str.lastIndexOf(" ");
  
      str = str.substring(0, lastIndex);
      this.messageText = str +' ' +  this.suggestedText;
    }
    eventHandlerI(e) {
      console.log(e, e.keyCode, e.keyIdentifier);
      let words = this.messageText.split(" ");
        let lastWord = words[words.length - 1];
        let lastWordLength = lastWord.length;
        let inputValue = lastWord;
  
  
        if (e['data'] != " ") {
          this.insertText = true;
        }
        if (this.insertText == false) {
          this.messageText = "";
        }
  
        this.suggestedWordsArray = this.filterArray(this.wordsArray, lastWord);
        this.suggestedWord = this.suggestedWordsArray[0];
  
        if (this.suggestedWord != undefined) {
          //this.suggestionEl.innerHTML = [(e.target as HTMLTextAreaElement).value.slice((e.target as HTMLTextAreaElement).value.length, (e.target as HTMLTextAreaElement).value.length - lastWordLength), this.suggestedWord].join('').replace(/ /g, "&nbsp;");
          console.log('here arrow down '+[(e.target as HTMLTextAreaElement).value.slice((e.target as HTMLTextAreaElement).value.length, (e.target as HTMLTextAreaElement).value.length - lastWordLength), this.suggestedWord].join('').replace(/ /g, "&nbsp;"));
          this.suggestedText =[(e.target as HTMLTextAreaElement).value.slice((e.target as HTMLTextAreaElement).value.length, (e.target as HTMLTextAreaElement).value.length - lastWordLength), this.suggestedWord].join('').replace(/ /g, "&nbsp;");
        }
  
        if (inputValue.length == 0 || this.suggestedWordsArray.length == 0) {
          //this.suggestionEl.innerHTML = "";
          this.suggestedText ="";
        }
  
        if (this.suggestedWordsArray.length != 0) {
          this.svgTabIcon.classList.remove("hidden");
          this.svgEnterIcon.classList.add("hidden");
        } else {
          this.svgTabIcon.classList.add("hidden");
          this.svgEnterIcon.classList.remove("hidden");
        }
  
        if (inputValue.length == 0 || inputValue == this.suggestedWord) {
          this.svgTabIcon.classList.add("hidden");
          this.svgEnterIcon.classList.add("hidden");
        }
  
        if (this.messageText.length == 0) {
          this.insertText = false;
        }
    }
    eventHandlerK(e) {
      let words = this.messageText.split(" ");
      let lastWord = words[words.length - 1];
      let lastWordLength = lastWord.length;
      let inputValue = lastWord;
  
      if (e.keyCode == this.ENTER_KEYCODE) {
          if (this.messageText.length == 0) return;
          let inputValue = this.messageText;
          let words = inputValue.split(" ");
          for (let i in words) {
              if (words[i].length != 0) {
                  wordsArray.push(words[i]);
                  this.messageText = "";
                  this.suggestionEl.innerHTML = "";
              }
          }
          var wordsArray = this.removeDuplicatesFromArray(wordsArray);
          this.inputContainerEl.classList.add("animate");
          this.svgTabIcon.classList.add("hidden");
          this.svgEnterIcon.classList.add("hidden");
          this.removeClassAfterAnimationCompletes(this.inputContainerEl, "animate");
      }
  
      if (this.messageText.length != 0) {
          if (e.keyCode == this.UP_ARROW_KEYCODE) {
              e.preventDefault();
              if (this.currentWordIndex == 0) return;
              this.currentWordIndex--;
              //suggestionEl.innerHTML = suggestedWordsArray[currentWordIndex];
              this.suggestionEl.innerHTML = this.messageText.slice((e.target as HTMLTextAreaElement).value.length, this.messageText.length - lastWordLength).concat(this.suggestedWordsArray[this.currentWordIndex]).replace(/ /g, "&nbsp;");
              console.log(this.messageText.slice((e.target as HTMLTextAreaElement).value.length, this.messageText.length - lastWordLength).concat(this.suggestedWordsArray[this.currentWordIndex]).replace(/ /g, "&nbsp;"));
              console.log('here arrow up');
          }
  
          if (e.keyCode == this.DOWN_ARROW_KEYCODE) {
              e.preventDefault();
              if (this.currentWordIndex == this.suggestedWordsArray.length - 1) return;
              this.currentWordIndex++;
              //suggestionEl.innerHTML = suggestedWordsArray[currentWordIndex];
              this.suggestionEl.innerHTML = [this.messageText.slice((e.target as HTMLTextAreaElement).value.length, this.messageText.length - lastWordLength), (this.suggestedWordsArray[this.currentWordIndex])].join('').replace(/ /g, "&nbsp;");
              console.log('here arrow down');
          }
  
          if (e.keyCode == this.LEFT_ARROW_KEYCODE || e.keyCode == this.RIGHT_ARROW_KEYCODE) {
            this.suggestionEl.innerHTML = "";
          }
  
          if (e.keyCode == this.BACKSPACE_KEYCODE) {
            this.currentWordIndex = 0;
  
          }
  
          if (e.keyCode == this.SPACE_KEYCODE) {
            this.currentWordIndex = 0;
          }
      }
  
      if (this.suggestedWord != undefined && this.suggestedWord != "") {
          if (e.keyCode == this.TAB_KEYCODE) {
              e.preventDefault();
              this.messageText = [this.messageText.slice(0, this.messageText.length - lastWordLength), (this.suggestedWordsArray[this.currentWordIndex])].join('');
              //textInputEl.value = textInputEl.value.replace(lastWord,suggestedWordsArray[currentWordIndex]);
              this.suggestionEl.innerHTML = "";
              this.svgTabIcon.classList.add("hidden");
              this.svgEnterIcon.classList.add("hidden");
              words = this.messageText.split(" ");
              this.currentWordIndex = 0;
          }
      }
    }
    
  
    removeClassAfterAnimationCompletes(el, className) {
        let elStyles = window.getComputedStyle(this.inputContainerEl);
        setTimeout(function() {
            el.classList.remove(className);
        }, +elStyles.animationDuration.replace("s", "") * 1000);
    }
  
    filterArray(array, item, reverse = false) { //retourne les mots commencant par les memes lettres
        if (reverse) {
            return array
                .filter(word => this.compareTwoStrings(word, item))
                .sort((a, b) => a.length - b.length);
        } else {
            return array
                .filter(word => this.compareTwoStrings(word, item))
                .sort((a, b) => b.length - a.length);
        }
    }
  
    removeDuplicatesFromArray(array) {
        return [...new Set(array.map(i => i))];
    }
  
    compareTwoStrings(string, subString) {
        let temp = string.split("", subString.length).join("");
        if (subString == temp) return subString;
    }

}