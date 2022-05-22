import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { environment } from 'src/environments/environment';
import { ProductService } from '../../core/ProductService/Products.service';
import { Product } from '../Models/Product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  products: Product[] = [];

  productToEdit: Product | null = null;

  selectedFile: File | null = null;


  ServerBase = environment.ServerBase;
  DefaultImage = environment.DefaultImage;


  AddOrEditForm: FormGroup = new FormGroup({
    productName: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    quantity: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    image: new FormControl(''),

  })


  constructor(private productService: ProductService, private ngxSmartModalService: NgxSmartModalService) {

  }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        products.forEach(c => {
          if (!c.image) {
            c.image = this.DefaultImage;
          }

        });
        this.products = products;
      },
      error: (err) => {
        alert(err.error);
        console.log(err);
      },
    });


  }




  openAddModal() {
    this.AddOrEditForm.reset();

    this.ngxSmartModalService.getModal('productModal').open();

  }

  closeModal() {
    this.AddOrEditForm.reset();
    this.ngxSmartModalService.getModal('productModal').close();

  }



  onFileSelect(event: any) {
    debugger;
    this.selectedFile = <File>event.target.files[0];
  }

  onUpload(id: string) {
    const fileData = new FormData();
    fileData.append('image', this.selectedFile as File, this.selectedFile?.name);
    return this.productService.UploadImage(fileData, id)
  }

  addOrEditProduct() {
    console.log(this.AddOrEditForm)
    const { value, valid, dirty } = this.AddOrEditForm;
    // console.log(this.AddOrEditForm)

    if (!valid || !dirty) return;



    if (!this.productToEdit) {

      let productAdd: Product = {

        productName: this.AddOrEditForm.value.productName,
        price: this.AddOrEditForm.value.price,
        quantity: this.AddOrEditForm.value.quantity,
        description: this.AddOrEditForm.value.description


      }


      this.productService
        .addProduct(productAdd)
        .subscribe({
          next: (product) => {
            if (!this.AddOrEditForm.value.image) {

              product.image = this.DefaultImage;
              this.products.push(product);
              this.AddOrEditForm.reset();
              this.ngxSmartModalService.getModal('productModal').close();
              return;

            }
            this.onUpload(product.productId!).subscribe(res => {

              product.image = res.dbPath;
              this.products.push(product);
              this.AddOrEditForm.reset();
              this.ngxSmartModalService.getModal('productModal').close();
            })

          },
          error: (err) => {
            alert(err.error);
            console.log(err);
          },
        });

    } else {

      let productUpdate: Product = {

        productId: this.productToEdit.productId,
        productName: this.AddOrEditForm.value.productName,
        price: this.AddOrEditForm.value.price,
        quantity: this.AddOrEditForm.value.quantity,
        description: this.AddOrEditForm.value.description,

      }
      this.productService
        .editProduct(this.productToEdit.productId!, productUpdate)
        .subscribe({
          next: (response) => {

            if (!this.AddOrEditForm.value.image) {
              response.image = this.DefaultImage;
              const indexToEdit = this.products.findIndex((p) => p.productId === response.productId);
              this.products.splice(indexToEdit, 1, response);

              this.productToEdit = null;
              this.AddOrEditForm.reset();
              this.ngxSmartModalService.getModal('productModal').close();
              return;

            }

            this.onUpload(response.productId!).subscribe(res => {
              console.log(res);
              response.image = res.dbPath;
              const indexToEdit = this.products.findIndex((p) => p.productId === response.productId);
              this.products.splice(indexToEdit, 1, response);

              this.productToEdit = null;
              this.AddOrEditForm.reset();
              this.ngxSmartModalService.getModal('productModal').close();
              return;
            })


          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }



  openEditModal(event: any, product: Product) {
    event.stopPropagation();
    this.productToEdit = product;
    this.AddOrEditForm.patchValue({
      productName: product.productName,
      price: product.price,
      quantity: product.quantity,
      description: product.description,

    });

    this.ngxSmartModalService.getModal('productModal').open();
  }

  deleteProduct(event: any, id: any) {
    event.stopPropagation();

    if (confirm('Are you sure you want to delete this Product?!')) {
      this.productService.deleteProductById(id).subscribe({
        next: () => {
          this.products = this.products.filter((p) => p.productId !== id);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}
