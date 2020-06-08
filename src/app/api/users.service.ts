import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(public toastController: ToastController,public http: HttpClient) { }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your settings have been saved.',
      duration: 2000
    });
    toast.present();
  }
  getSomeData(){
    var encodedData = window.btoa("admin" + ":" + "admin");	
    let headers = new HttpHeaders({
            'Authorization': 'Basic '+encodedData

          });
    let httpOptions = { headers: headers   };
    //this.presentToast();
    return this.http.get('https://depinfo-chat.herokuapp.com/api/users/?format=json',httpOptions)
  }

  getMessages(){
    var encodedData = window.btoa("admin" + ":" + "admin");	
    let headers = new HttpHeaders({
            'Authorization': 'Basic '+encodedData
          });
    let httpOptions = { headers: headers   };
    return this.http.get('https://depinfo-chat.herokuapp.com/api/rooms/?format=json',httpOptions);
  }
  login(form){
    return true;
  }
  sendMessages(author,message,room){
    var encodedData = window.btoa("admin" + ":" + "admin");	
    let headers = new HttpHeaders({
            'Authorization': 'Basic '+encodedData
          });
    let httpOptions = { headers: headers   };
    console.log('message: '+message);
    return this.http.post('http://depinfo-chat.herokuapp.com/api/messages/',{
      'author': author,
      'message' : message,
      'room' : room
    },httpOptions);
  }
  
}
