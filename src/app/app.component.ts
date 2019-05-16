import {Component, OnInit} from '@angular/core';
import { FaceRecognitionService } from './services/face-recognition.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
 export class AppComponent {

  title = 'AgeRecognition';


  constructor(private faRoc: FaceRecognitionService){
  }

}
