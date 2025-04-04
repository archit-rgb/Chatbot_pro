import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import { SigninComponent } from './signin/signin.component';

export const routes: Routes = [

    {
        path:'',
        redirectTo:'signin',
        pathMatch:'full'

    },
    {
      path:'home',
      component:HomeComponent
    },
    {
        path:'chat',
        component:ChatComponent
      },
      {
        path:'signin',
        component:SigninComponent
      },


];
