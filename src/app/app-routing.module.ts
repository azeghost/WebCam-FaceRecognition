import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { WebCamComponentComponent } from './web-cam-component/web-cam-component.component';
import { AboutComponent } from './about/about.component';
import { NavigationComponent } from './navigation/navigation.component';
import { TrainComponent } from './train/train.component';
import {UploadComponent} from './upload/upload.component';
import {IdentifyComponent} from './identify/identify.component';

const routes: Routes = [
  {path: 'train', component: TrainComponent},
  {path: 'webcam', component: WebCamComponentComponent},
  {path: 'about', component: AboutComponent},
  {path: 'upload', component: UploadComponent},
  {path: 'identify',component: IdentifyComponent},
  {path: '', component: NavigationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
