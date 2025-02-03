import { Routes } from '@angular/router';
import { SignupComponent } from './users/signup/signup.component';
import { SigninComponent } from './users/signin/signin.component';
import { MapComponent } from './map/map/map.component';
import { loggedInGuard } from './guards/logged-in.guard';

export const routes: Routes = [
    { path: "signup", component: SignupComponent },
    { path: "signin", component: SigninComponent, canActivate: [loggedInGuard] },
    { path: "map", component: MapComponent, canActivate: [loggedInGuard] },
    { path: "", component: MapComponent, canActivate: [loggedInGuard] },
    { path: '**', redirectTo: "/" }
];
