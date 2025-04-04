import { Routes,RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import { SigninComponent } from './signin/signin.component';
import { NgModule } from '@angular/core';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { AuthGuard } from './auth.guard.service';

export const routes: Routes = [

    {
        path:'',
        redirectTo:'signin',
        pathMatch:'full'

    },
    {
      path:'auth-callback',
      component:AuthCallbackComponent
    },
    {
        path:'chat',
        component:ChatComponent, canActivate: [AuthGuard]
      },
      {
        path:'signin',
        component:SigninComponent
      },


];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}