import { Component } from '@angular/core';
import {AuthService} from '../../core/auth/auth.service';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [
    FormsModule
  ],
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username = '';
  password = '';
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.login(this.username, this.password)
      .subscribe(success => {
      if (success) {
        this.error = null;
        this.router.navigate(['/']);
      } else {
        this.error = 'Неверный логин или пароль';
      }
    });
  }
}

