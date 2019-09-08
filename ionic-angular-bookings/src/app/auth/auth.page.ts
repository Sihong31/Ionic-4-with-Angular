import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  email = '';
  password = '';
  isLogin = true;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) { }

  ngOnInit() {}
  
  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl.create({
      keyboardClose: true, message: 'Logging in...'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.authService.signup(email, password).subscribe(resData => {
        this.isLoading = false;
        loadingEl.dismiss();
        this.router.navigateByUrl('/places/tabs/discover');
      }, errRes => {
        loadingEl.dismiss();
        const code = errRes.error.error.message;
        let message = 'Could not sign you up, please try again!';
        if (code === 'EMAIL_EXISTS') {
          message = 'This email address already exists!';
        }
        this.showAlert(message);
      });
    });
    this.authService.login();
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    console.log(this.email, this.password);

    this.authenticate(this.email, this.password);
  }

  private showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Authentication failed',
      message: message,
      buttons: ['Okay']
    }).then(alertEl => {
      alertEl.present();
    })
  }
}
