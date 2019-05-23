import { Component, OnInit } from '@angular/core';
import {FaceRecognitionService} from '../services/face-recognition.service';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-train',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.css']
})

export class TrainComponent implements OnInit {

  create_group_response: any;
  create_large_group_responce:any;
  create_person_response: any;
  add_image_response: any;
  get_person_response: any;
  train_response: any;

  person_image: File = null;

  //Webcam Variables
  public showWebcam = false;
  public multipleWebcamsAvailable = false;
  public errors: WebcamInitError[] = [];
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

  handleFileInput(event){
    this.person_image = event.target.files[0];
  }

  createGroup(id:string, name:string, data:string){
    this.data.createPersonGroup(id, name, data)
      .subscribe(res => { this.create_group_response = res.status }, error => console.log(error));
  }
  createLargeGroup(id:string, name:string, data:string){
    this.data.createLargePersonGroup(id, name, data)
      .subscribe(res => { this.create_large_group_responce = res.status }, error => console.log(error));
  }

  createPerson(group_id: string, name:string, data:string){
    this.data.createPerson(group_id, name, data)
      .subscribe(res => { this.create_person_response = res.body }, error => console.log(error));
  }

  addImage(group_id: string, image: File, personID: string){
    this.data.addPersonImage(group_id, image, personID)
      .subscribe(res => { this.add_image_response = res.body }, error => console.log(error));
  }
  getPerson(groupID: string, personID: string){
    this.data.getPerson(groupID, personID)
      .subscribe(res => { this.get_person_response = res.body }, error => console.log(error));
  }

  trainGroup(group_id:string){
    this.data.trainGroup(group_id)
      .subscribe(res => { this.train_response = res.status, console.log(res) }, error => console.log(error));
  }

  addImageFromWebcam(group_id: string,  personID: string){
    const objectURL = URL.createObjectURL(this.convertDataUrlToBlob(this.webcamImage.imageAsDataUrl));

    this.data.addPersonImage(group_id, objectURL , personID)
      .subscribe(res => { this.add_image_response = res.body }, error => console.log(error));
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
  public async triggerSnapshot(){
    this.trigger.next();
  }
  public async toggleWebcam(){
    if(this.showWebcam==true){
      this.showWebcam=false;
    }else{this.showWebcam=true;}
  }
  convertDataUrlToBlob(dataUrl): Blob {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], {type: mime});
  }


}

