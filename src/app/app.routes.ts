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
import { AccesoDenegadoComponent } from './acceso-denegado/acceso-denegado.component'; // Importar
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: 'perfil', component: PerfilComponent },
  { path: 'car', component: CartComponent },
  { path: 'store', component: StoreComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent },      
  { path: "nosotros", component: SeccionNosotrosComponent }, 
  { path: 'acceso-denegado', component: AccesoDenegadoComponent }, // Ruta pública de error

  // Rutas protegidas exclusivamente para admin
  { path: "adminuploadcomponent", component: AdminUploadComponent, canActivate: [adminGuard] },
  { path: "stock", component: StockComponent, canActivate: [adminGuard] }, 
  { path: "usuarios", component: UsersComponent, canActivate: [adminGuard] },

  { path: '**', redirectTo: '' }
];