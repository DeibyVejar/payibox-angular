import { Routes } from '@angular/router';
import { HomeComponent } from './HomeComponents/Home.component';
import { LoginComponent } from './Logincomponents/Login.component';
import { RegisterComponent } from './Registercomponents/Register.component';
import { StoreComponent } from './Storecomponents/Store.component';
import { CartComponent } from './CarComponents/Car.Component';
import { PerfilComponent } from './PerfilComponents/Perfil.Component';
import { SeccionNosotrosComponent } from './Storecomponents/seccion-nosotros/seccion-nosotros.component';
import { AdminUploadComponent } from './admin-upload/adminuploadcomponents/adminuploadcomponent.component';
import { StockComponent } from './stock-item/stock-item.component';
import { UsersComponent } from './usuarios-componente/usuarios-componente.component';

export const routes: Routes = [
  { path: 'perfil', component: PerfilComponent },
  { path: 'car', component: CartComponent },
  { path: 'store', component: StoreComponent },
  { path: 'register', component: RegisterComponent }, // El nombre de la clase de tu componente
  { path: 'login', component: LoginComponent }, // El nombre de la clase de tu componente
  { path: '', component: HomeComponent },      // Tu página principal
  { path: "nosotros", component: SeccionNosotrosComponent } , // Ruta para la sección "Nosotros"
  { path: "adminuploadcomponent", component: AdminUploadComponent },
  { path: "stock", component: StockComponent }, 
  { path: "usuarios", component: UsersComponent }

];

