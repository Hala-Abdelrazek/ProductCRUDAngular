import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../product-home/Models/Product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

   baseURL: string = 'https://producttaskbyhalaabdelrazek.azurewebsites.net/api/Product';


  constructor(private httpClient: HttpClient) { }

  getAllProducts(){
    return this.httpClient.get<Product[]>(this.baseURL)}

    getProductById(id: string){
      return this.httpClient.get<Product>(this.baseURL + id);
    }
  
    addProduct(newProduct: Omit<Product, 'productId'>){
      return this.httpClient.post<Product>(this.baseURL, newProduct );
    }
  
    editProduct(id: string, newProduct: Product){
      return this.httpClient.put<Product>(this.baseURL + '/' + id, newProduct);
    }
  
    deleteProductById(id:string){
      return this.httpClient.delete(this.baseURL + '/' + id);
    }

    UploadImage(filedata : FormData, id:string):Observable<{dbPath:string}>{
      return this.httpClient.post<{dbPath:string}>(this.baseURL+ '/Upload/'+id ,filedata);
    }


}
