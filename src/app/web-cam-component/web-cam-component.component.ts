import {Component, OnInit} from '@angular/core';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import {Subject} from 'rxjs/Subject';
import {FaceRecognitionService} from '../services/face-recognition.service';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-web-cam-component',
  templateUrl: './web-cam-component.component.html',
  styleUrls: ['./web-cam-component.component.css']
})
export class WebCamComponentComponent implements OnInit {
  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  PersonInfo:any;
  x: number = 0;
  y: number =0;
  width: number =0;
  height: number =0;

  gender: string;
  age:any;
  smile:any;
   public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  constructor(private faceReco: FaceRecognitionService){}

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  public async triggerSnapshot(){
    this.trigger.next();
    this.FindFace();
  }

  public async FindFace(){
    //this.faceReco.getPersonInformation(this.webcamImage.imageAsDataUrl);
    this.PersonInfo = await this.faceReco.getPersonInformation(this.webcamImage.imageAsDataUrl).toPromise();
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

    source.src = this.webcamImage.imageAsDataUrl;
  }
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean|string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

}
