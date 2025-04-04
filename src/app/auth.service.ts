import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private googleClientId = '510913019811-dpic4r3ko2o17puhv37dt5th5koqvpsc.apps.googleusercontent.com';
  private microsoftClientId = '8bae593b-cba8-464f-ad9f-656673134f38';
  private microsoftTenantId = '97b32e5c-7d5b-4d8f-8225-c4e35f40ec3b';
  private redirectUri = 'http://localhost:4200/auth-callback';

  constructor() {}

  // Google Sign-In
  googleSignIn() {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?response_type=token&client_id=${this.googleClientId}&redirect_uri=${this.redirectUri}&scope=email profile openid`;
    window.location.href = googleAuthUrl;
  }

  // Microsoft (Outlook) Sign-In
  outlookSignIn() {
    const microsoftAuthUrl = `https://login.microsoftonline.com/${this.microsoftTenantId}/oauth2/v2.0/authorize?client_id=${this.microsoftClientId}&response_type=token&redirect_uri=${this.redirectUri}&scope=openid profile email`;
    window.location.href = microsoftAuthUrl;
  }

  // Get Token from URL
  getTokenFromUrl(): string | null {
    const params = new URLSearchParams(window.location.hash.substring(1));
    return params.get('access_token');
  }

  // Check if user is logged in
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Logout
  logout() {
    localStorage.removeItem('authToken');
    window.location.href = '/signin'; // Redirect to sign-in page
  }
}


