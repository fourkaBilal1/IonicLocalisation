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
  public messages: any = [];
  public userId=1;
  public roomId : number;
  public user : String;
  public imageclic : boolean = false;
  public activeUserMessage : String;
  public roomName : String;
  const inputContainerEl = document.querySelector(".input-container");
  const textInputEl = document.querySelector("ion-input#text");
  const suggestionEl = document.querySelector(".suggestion-container");
  const svgTabIcon = document.querySelector(".icon.tab-key");
  const svgEnterIcon = document.querySelector(".icon.enter-key");

  const ENTER_KEYCODE = 13;
  const TAB_KEYCODE = 9;
  const BACKSPACE_KEYCODE = 8;
  const UP_ARROW_KEYCODE = 38;
  const DOWN_ARROW_KEYCODE = 40;
  const LEFT_ARROW_KEYCODE = 37;
  const RIGHT_ARROW_KEYCODE = 39;
  const SPACE_KEYCODE = 32;
  const wordsArray = [
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
  let suggestedWord = "";
  let suggestedWordsArray = [];
  let currentWordIndex = 0;
  let insertText = false;

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
      console.log(data[0]);
      console.log(data[0].last_messages);
      this.messages = data[0].last_messages.reverse();
      this.user = data[0].user;
      console.log(this.user);
      this.roomName = data[0].title;
      this.roomId = data[0].last_messages[0].room;
      console.log(this.messages[this.messages.length]);
    },
    (error) => {                              //Error callback
      console.error('error caught in component')
      this.presentToast(error.message);

      //throw error;   //You can also throw the error to a global error handler
    });
    
    /*
    const inputContainerEl = document.querySelector(".input-container");
    const textInputEl = document.querySelector("ion-input#text");
    const suggestionEl = document.querySelector(".suggestion-container");
    const svgTabIcon = document.querySelector(".icon.tab-key");
    const svgEnterIcon = document.querySelector(".icon.enter-key");

    const ENTER_KEYCODE = 13;
    const TAB_KEYCODE = 9;
    const BACKSPACE_KEYCODE = 8;
    const UP_ARROW_KEYCODE = 38;
    const DOWN_ARROW_KEYCODE = 40;
    const LEFT_ARROW_KEYCODE = 37;
    const RIGHT_ARROW_KEYCODE = 39;
    const SPACE_KEYCODE = 32;
    let wordsArray = [
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
    let suggestedWord = "";
    let suggestedWordsArray = [];
    let currentWordIndex = 0;
    let insertText = false;

    textInputEl.addEventListener("input", e => {

        let words = this.messageText.split(" ");
        let lastWord = words[words.length - 1];
        let lastWordLength = lastWord.length;
        let inputValue = lastWord;


        if (e['data'] != " ") {
            insertText = true;
        }
        if (insertText == false) {
          this.messageText = "";
        }

        suggestedWordsArray = filterArray(wordsArray, lastWord);
        suggestedWord = suggestedWordsArray[0];

        if (suggestedWord != undefined) {
            suggestionEl.innerHTML = [(e.target as HTMLTextAreaElement).value.slice((e.target as HTMLTextAreaElement).value.length, (e.target as HTMLTextAreaElement).value.length - lastWordLength), suggestedWord].join('').replace(/ /g, "&nbsp;");
        }

        if (inputValue.length == 0 || suggestedWordsArray.length == 0) {
            suggestionEl.innerHTML = "";
        }

        if (suggestedWordsArray.length != 0) {
            svgTabIcon.classList.remove("hidden");
            svgEnterIcon.classList.add("hidden");
        } else {
            svgTabIcon.classList.add("hidden");
            svgEnterIcon.classList.remove("hidden");
        }

        if (inputValue.length == 0 || inputValue == suggestedWord) {
            svgTabIcon.classList.add("hidden");
            svgEnterIcon.classList.add("hidden");
        }

        if (this.messageText.length == 0) {
            insertText = false;
        }
    });

    textInputEl.addEventListener("keydown", (e: KeyboardEvent) => {

        let words = this.messageText.split(" ");
        let lastWord = words[words.length - 1];
        let lastWordLength = lastWord.length;
        let inputValue = lastWord;

        if (e.keyCode == ENTER_KEYCODE) {
            if (this.messageText.length == 0) return;
            let inputValue = this.messageText;
            let words = inputValue.split(" ");
            for (let i in words) {
                if (words[i].length != 0) {
                    wordsArray.push(words[i]);
                    this.messageText = "";
                    suggestionEl.innerHTML = "";
                }
            }
            var wordsArray = removeDuplicatesFromArray(wordsArray);
            inputContainerEl.classList.add("animate");
            svgTabIcon.classList.add("hidden");
            svgEnterIcon.classList.add("hidden");
            removeClassAfterAnimationCompletes(inputContainerEl, "animate");
        }

        if (this.messageText.length != 0) {
            if (e.keyCode == UP_ARROW_KEYCODE) {
                e.preventDefault();
                if (currentWordIndex == 0) return;
                currentWordIndex--;
                //suggestionEl.innerHTML = suggestedWordsArray[currentWordIndex];
                suggestionEl.innerHTML = this.messageText.slice((e.target as HTMLTextAreaElement).value.length, this.messageText.length - lastWordLength).concat(suggestedWordsArray[currentWordIndex]).replace(/ /g, "&nbsp;");
                console.log(this.messageText.slice((e.target as HTMLTextAreaElement).value.length, this.messageText.length - lastWordLength).concat(suggestedWordsArray[currentWordIndex]).replace(/ /g, "&nbsp;"));
            }

            if (e.keyCode == DOWN_ARROW_KEYCODE) {
                e.preventDefault();
                if (currentWordIndex == suggestedWordsArray.length - 1) return;
                currentWordIndex++;
                //suggestionEl.innerHTML = suggestedWordsArray[currentWordIndex];
                suggestionEl.innerHTML = [this.messageText.slice((e.target as HTMLTextAreaElement).value.length, this.messageText.length - lastWordLength), (suggestedWordsArray[currentWordIndex])].join('').replace(/ /g, "&nbsp;");
                console.log('here');
            }

            if (e.keyCode == LEFT_ARROW_KEYCODE || e.keyCode == RIGHT_ARROW_KEYCODE) {
                suggestionEl.innerHTML = "";
            }

            if (e.keyCode == BACKSPACE_KEYCODE) {
                currentWordIndex = 0;

            }

            if (e.keyCode == SPACE_KEYCODE) {
                currentWordIndex = 0;
            }
        }

        if (suggestedWord != undefined && suggestedWord != "") {
            if (e.keyCode == TAB_KEYCODE) {
                e.preventDefault();
                this.messageText = [this.messageText.slice(0, this.messageText.length - lastWordLength), (suggestedWordsArray[currentWordIndex])].join('');
                //textInputEl.value = textInputEl.value.replace(lastWord,suggestedWordsArray[currentWordIndex]);
                suggestionEl.innerHTML = "";
                svgTabIcon.classList.add("hidden");
                svgEnterIcon.classList.add("hidden");
                words = this.messageText.split(" ");
                currentWordIndex = 0;

            }
        }


    });

    removeClassAfterAnimationCompletes(inputContainerEl, "animate");

    function removeClassAfterAnimationCompletes(el, className) {
        let elStyles = window.getComputedStyle(inputContainerEl);
        setTimeout(function() {
            el.classList.remove(className);
        }, +elStyles.animationDuration.replace("s", "") * 1000);
    }

    function filterArray(array, item, reverse = false) { //retourne les mots commencant par les memes lettres
        if (reverse) {
            return array
                .filter(word => compareTwoStrings(word, item))
                .sort((a, b) => a.length - b.length);
        } else {
            return array
                .filter(word => compareTwoStrings(word, item))
                .sort((a, b) => b.length - a.length);
        }
    }

    function removeDuplicatesFromArray(array) {
        return [...new Set(array.map(i => i))];
    }

    function compareTwoStrings(string, subString) {
        let temp = string.split("", subString.length).join("");
        if (subString == temp) return subString;
    }*/
  }
  eventHandler(event) {
    console.log(event, event.keyCode, event.keyIdentifier);
 } 
  gifImage(){
    this.imageclic = !this.imageclic;
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
      this.messages.push({author: this.user, message: this.messageText});
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
        this.messageText = address;
      });
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }
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

}