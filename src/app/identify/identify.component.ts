import { Component, OnInit } from '@angular/core';
import {FaceRecognitionService} from '../services/face-recognition.service';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-identify',
  templateUrl: './identify.component.html',
  styleUrls: ['./identify.component.css']
})
export class IdentifyComponent implements OnInit {
  faceId: string;
  private matchedId: any;
  private matchedName: any;
  private matchedData: any;

  public showWebcam = true;
  public multipleWebcamsAvailable = false;
  public errors: WebcamInitError[] = [];

  groupID:string;
  PersonInfo:any;
  x: number = 0;
  y: number =0;
  width: number =0;
  height: number =0;

  gender: string;
  age:any;
  smile:any;
  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  public  blob:Blob;
  constructor(private data: FaceRecognitionService) { }

  ngOnInit() {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }
  public async triggerSnapshot(){
    this.trigger.next();
    this.FindFace();

  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }
  //finds the face sets the info ro face api responce
  public async FindFace(){
    this.PersonInfo = await this.data.getPersonInformation(this.webcamImage.imageAsDataUrl).toPromise();
    console.log(this.PersonInfo);
    if(this.PersonInfo.length == 1) {
      let resources = this.PersonInfo[0];


      let rectangleCoordinates = this.data.getRectangleCoordinates(resources);
      let faceAttributes = this.data.getFaceAttributes(resources);

      console.log(rectangleCoordinates);
      console.log(faceAttributes);


      this.y = rectangleCoordinates[0];
      this.x = rectangleCoordinates[1];
      this.width = rectangleCoordinates[2];
      this.height = rectangleCoordinates[3];

      this.age = faceAttributes[0];
      this.gender = faceAttributes[1];
      this.smile = faceAttributes[2];
      this.faceId = resources["faceId"];
      this.drawRectangle();
      this.faceIdentify(this.groupID);
    }
    console.log(this.groupID);
    console.log(this.faceId);
  }
//call microsoft api and determine name and id
  async faceIdentify(group_id: string){
    let faceIDs:string[]=[this.faceId];
    const getID = await this.data.faceIdentify(group_id, faceIDs).toPromise().then(data =>{
      this.matchedId = data.body[0].candidates[0].personId;
    });

    const getName = await this.data.getPerson(group_id, this.matchedId ).toPromise().then(data =>
    {
      this.matchedName = data.body["name"]
      this.matchedData = data.body["userData"]
    });
  }
  async setGroupID(group_id: string){
    this.groupID = group_id;
  }
  //draws canvas
  drawRectangle(): void {
    let canvas = <HTMLCanvasElement>document.getElementById('myCanvas');
    let context = canvas.getContext('2d');
    console.log(canvas,context);
    let source = new Image();
    if (this.PersonInfo.length == 0) { //checks if no face recognized
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
        context.fillText("Age " + this.age + " Gender: " + this.gender + " Smile: " + this.smile+"Name" + this.matchedName, this.x, this.y);
      };

      source.src = this.webcamImage.imageAsDataUrl;
    }
  }
}
