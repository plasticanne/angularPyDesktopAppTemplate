import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { Entree_layoutComponent } from '@_views/entree/entree_layout.component';
import { Select_pageComponent } from '@_views/entree/select_page.component';





export const routes: Routes = [
    //{ path: '#', redirectTo: '/', pathMatch: 'full' },
    {
        path: '',


        data: {
        //    title: 'Portal'
        },
        children: [
            //{ path: '', redirectTo: '/entree/select_page', pathMatch: 'full', },

            //{ path: '_=_', redirectTo: '/entree/select_page', pathMatch: 'full' },
            //{ path: '_', redirectTo: '/entree/select_page', pathMatch: 'full' },

            {
                path: 'myMajorApp',
                loadChildren: './views/myMajorApp/myMajorApp.module#MyMajorAppModule'
            },

            /*
            {
            path: 'dashboard',
            loadChildren: './views/dashboard/dashboard.module#DashboardModule'
            },*/

        ]
    },
    {
        path: '404',
        component: P404Component,
        data: {
            title: 'Page 404'
        }
    },
    {
        path: '500',
        component: P500Component,
        data: {
            title: 'Page 500'
        }
    },
    // {
    // path: 'login',
    // component: LoginComponent,
    // data: {
    //     title: 'Login Page'
    // }
    // },
    // {
    // path: 'register',
    // component: RegisterComponent,
    // data: {
    //     title: 'Register Page'
    // }
    // },
    {
        path: 'entree',
        component: Entree_layoutComponent,
        children: [
            {
                path: 'select_page',
                component: Select_pageComponent,
                data: {
                    title: 'Select Page'
                    }
            },
        ]
    },
    { path: '**', component: P404Component }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        //RouterModule.forRoot(routes, { useHash: true }),
    ],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule { }
