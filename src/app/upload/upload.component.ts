import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';

import { HttpClient } from '@angular/common/http';
import {FaceRecognitionService} from '../services/face-recognition.service';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  imageToShow:any;
  myURL:any
  PersonInfo:any;
  x: number = 0;
  y: number =0;
  width: number =0;
  height: number =0;

  gender: string;
  age:any;
  smile:any;

  constructor(private httpClient:HttpClient,private faceReco: FaceRecognitionService) { }

  ngOnInit() {
  }


  onURLinserted() {
    this.getImage(this.myURL ).subscribe(data => {
      this.createImageFromBlob(data);
    }, error => {
      console.log("Error occured",error);
    });
  }

  getImage(imageUrl: string): Observable<Blob> {
    return this.httpClient.get(imageUrl, { responseType: 'blob' });
  }

   createImageFromBlob(image: Blob) {
    let reader = new FileReader(); //you need file reader for read blob data to base64 image data.
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result; // here is the result you got from reader
    }, false);

    if (image) {
    reader.readAsDataURL(image);

  }
}

  public async FindFace(){
    //this.faceReco.getPersonInformation(this.webcamImage.imageAsDataUrl);
    this.PersonInfo = await this.faceReco.getPersonInformation(this.imageToShow).toPromise();
    console.log(this.PersonInfo);
    if(this.PersonInfo.length == 1) {
      let resources = this.PersonInfo[0];


      let rectangleCoordinates = this.faceReco.getRectangleCoordinates(resources);
      let faceAttributes = this.faceReco.getFaceAttributes(resources);

      console.log(rectangleCoordinates);
      console.log(faceAttributes);


      this.y = rectangleCoordinates[0];
      this.x = rectangleCoordinates[1];
      this.width = rectangleCoordinates[2];
      this.height = rectangleCoordinates[3];

      this.age = faceAttributes[0];
      this.gender = faceAttributes[1];
      this.smile = faceAttributes[2];
    }
    this.drawRectangle();
  }

  drawRectangle(): void {
    let canvas = <HTMLCanvasElement>document.getElementById('myCanvas');
    let context = canvas.getContext('2d');
    console.log(canvas,context);
    let source = new Image();
    if (this.PersonInfo.length != 1) {
      context.font = "30px Arial";
      context.fillStyle = "black"
      context.fillText("No Face detected", 50, 50);

    } else{
      source.onload = () => {
        context.drawImage(source, 0, 0);
        context.beginPath();
        context.strokeStyle = 'red';
        context.rect(this.x, this.y, this.width, this.height);
        context.stroke();
        context.font = "15px Arial";
        context.fillStyle = "yellow"
        context.fillText("Age " + this.age + " Gender: " + this.gender + " Smile: " + this.smile, this.x, this.y);
      };

      source.src = this.imageToShow;
    }
  }
}
