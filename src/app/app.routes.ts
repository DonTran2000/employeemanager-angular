import { NgModule, importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
// import { UserProfileComponent } from './components/user-profile/user.profile.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuardFn } from './guards/auth.guard';
import { AdminGuardFn } from './guards/admin.guard';
import { ResetPasswordComponent } from './components/reset_password/reset.password.component';
//import { OrderAdminComponent } from './components/admin/order/order.admin.component';

export const routes: Routes = [
    // { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'resetPassword', component: ResetPasswordComponent },

    // { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuardFn] },
    //Admin   
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AdminGuardFn]
    },
];
