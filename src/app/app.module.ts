import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {WebcamModule} from 'ngx-webcam';
import { HttpClientModule } from '@angular/common/http';
import { NavigationComponent } from './navigation/navigation.component';
import { BoolToYesNoPipe } from './pipes/bool-to-yes-no/bool-to-yes-no.pipe';
import { FaceRecognitionService } from './services/face-recognition.service';
import { TableComponent } from './table/table.component';
import { WebCamComponentComponent } from './web-cam-component/web-cam-component.component';
import {RouterModule} from '@angular/router';
import { AppRoutingModule } from './/app-routing.module';
import { AboutComponent } from './about/about.component';
import { TrainComponent } from './train/train.component';
import { UploadComponent } from './upload/upload.component';
import { IdentifyComponent } from './identify/identify.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    BoolToYesNoPipe,
    TableComponent,
    WebCamComponentComponent,
    AboutComponent,
    TrainComponent,
    UploadComponent,
    IdentifyComponent,
  ],
  imports: [FormsModule, BrowserModule, HttpClientModule, WebcamModule, RouterModule, AppRoutingModule],
  providers: [
    FaceRecognitionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
