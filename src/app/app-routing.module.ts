import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { WebCamComponentComponent } from './web-cam-component/web-cam-component.component';
import { AboutComponent } from './about/about.component';
import { NavigationComponent } from './navigation/navigation.component';
import { TrainComponent } from './train/train.component';

const routes: Routes = [
  {path: 'train', component: TrainComponent},
  {path: 'webcam', component: WebCamComponentComponent},
  {path: 'about', component: AboutComponent},
  {path: '', component: NavigationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
