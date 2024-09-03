import { AdminComponent } from "./admin.component";
import { Route, Router, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
// import { UserAdminComponent } from "./user/user.admin.component";

export const adminRoutes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
        children: [
            {
                path: 'users',
                component: AdminComponent
            },
        ]
    }
];
/*
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
*/
