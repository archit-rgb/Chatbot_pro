import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-callback',
  template: `<p>Authenticating...</p>`
})
export class AuthCallbackComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const token = this.authService.getTokenFromUrl();
    if (token) {
      localStorage.setItem('authToken', token);
      this.router.navigate(['/chat']);
    } else {
      this.router.navigate(['/signin']);
    }
  }
}

