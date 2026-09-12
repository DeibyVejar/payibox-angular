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
import { adminGuard } from './guards/admin.guard'; // Importamos el guardián

export const routes: Routes = [
  { path: 'perfil', component: PerfilComponent },
  { path: 'car', component: CartComponent },
  { path: 'store', component: StoreComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent },      
  { path: "nosotros", component: SeccionNosotrosComponent }, 
  
  // Rutas protegidas exclusivamente para el administrador
  { 
    path: "adminuploadcomponent", 
    component: AdminUploadComponent, 
    canActivate: [adminGuard] 
  },
  { 
    path: "stock", 
    component: StockComponent, 
    canActivate: [adminGuard] 
  }, 
  { 
    path: "usuarios", 
    component: UsersComponent, 
    canActivate: [adminGuard] 
  },

  // Ruta comodín por si escriben cualquier cosa en la URL
  { path: '**', redirectTo: '' }
];