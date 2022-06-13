import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyMajorAppResolver } from './myMajorApp.resolver';
import { MyMajorApp_layoutComponent } from './myMajorApp_layout.component';
import { MyMajorApp_mainComponent } from './myMajorApp_main.component';

export const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },

  {
    path: '',
    resolve: {
        cfgdata: MyMajorAppResolver
    },
    component : MyMajorApp_layoutComponent,
    children: [
        {
            path: 'main',
            component: MyMajorApp_mainComponent,
            data: {
                title: '',
              },
        },



    ]
  },
  { path: '**', redirectTo: 'normal', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [MyMajorAppResolver]
})
export class MyMajorAppRoutingModule {}
