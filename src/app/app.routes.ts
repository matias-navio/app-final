import { Routes } from '@angular/router';
import { ProductsComponent } from './products/components/product/products.component';
import { UserComponent } from './user/component/user.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: 'inicio', component: HomeComponent },
    { path: 'productos', component: ProductsComponent },
    { path: 'usuarios', component: UserComponent },
    { path: '**', redirectTo: 'inicio' }
];
