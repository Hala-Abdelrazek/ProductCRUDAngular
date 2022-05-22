import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductHomeRouting } from './product-home-routing';
import { ProductHomeComponent } from './product-home.component';
import { ProductComponent } from './productComponent/product.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ProductHomeComponent,
    ProductComponent

  ],
  imports: [
    CommonModule,
    ProductHomeRouting,
    NgxSmartModalModule.forChild(),
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule

  ]
})
export class ProductHomeModule { }
