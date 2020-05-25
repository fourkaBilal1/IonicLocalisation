import { Component, OnInit } from '@angular/core';
import { UsersService } from '../api/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private usersService : UsersService,
              private router:Router) { }

  ngOnInit() {
  }
  login(form){
    /*
    this.usersService.login(form.value).subscribe((res)=>{
      this.router.navigateByUrl('home');
    });*/
    this.usersService.getSomeData().subscribe(data => {
      console.log(data)
      var i=0;
      var found=false;
      /*
      while(data.length > i && !found){
        console.log('data.username '+i+' : '+data[i].username);
        if(data[i].username == form.value.email){
          found = true;
        }
        i++;
      }*/
      found = true;
      if(found && form.value.password=='admin'){
        console.log("true");
        this.router.navigateByUrl('/tabs/tab1');
      }
      
    });
    //this.router.navigateByUrl('/tabs/tab1');
  }

}
