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
  imageToShow : any;
  public  blob:Blob;
  constructor(private data: FaceRecognitionService) { }

  ngOnInit() {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }
  private makeblob(dataURL) {
    const BASE64_MARKER = ';base64,';
    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }
  public async triggerSnapshot(){
    this.trigger.next();
    this.FindFace();
    this.faceIdentify("123")

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
  public async FindFace(){
    //this.faceReco.getPersonInformation(this.webcamImage.imageAsDataUrl);
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

    }
    console.log(this.faceId);
  }

  async faceIdentify(group_id: string){

    const getID = await this.data.faceIdentify(group_id, this.faceId).toPromise().then(data => this.matchedId = data.body[0].candidates[0].personId);

    const getName = await this.data.getPerson(group_id, this.matchedId ).toPromise().then(data =>
    {
      this.matchedName = data.body["name"]
      this.matchedData = data.body["userData"]
    });
  }
}
