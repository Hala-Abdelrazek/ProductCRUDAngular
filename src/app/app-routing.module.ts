import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes=[
  {path:'' ,pathMatch:'full',redirectTo:'/home'},
  {path:'home',loadChildren:()=> import('./Modules/product-home/product-home.module').then(m => m.ProductHomeModule)},

]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
