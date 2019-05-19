import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class FaceRecognitionService {

  private fullUrl: string = 'https://westeurope.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceAttributes=age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
  private apiUrl:string = "https://westeurope.api.cognitive.microsoft.com/face/v1.0";
  private apiKey:string = '781b38016a3b416e84f51fe33e35f87f';
  private person_groups_url:string = this.apiUrl + '/persongroups/';
  private face_identify_url:string = this.apiUrl + '/identify';

  constructor(private httpClient: HttpClient) { }

  getPersonInformation(image)
  {
    const Headers = this.getHeaders2();
    var blob =  this.makeblob(image);
    return this.httpClient.post(this.fullUrl, blob, { headers: Headers});

  }


  private getHeaders2()
  {
    let headers = new HttpHeaders({
      'Content-Type': 'application/octet-stream',
      'Ocp-apim-Subscription-Key': this.apiKey,
      'processData': 'False'
    });
    return headers;
  }

  scanImage(subscriptionKey: string, base64Image: string) {
    const headers = this.getHeadersOctetStream(subscriptionKey);
    const params = this.getParams();
    const blob = this.makeblob(base64Image);

    return this.httpClient.post<FaceRecognitionResponse>(
      environment.endpoint,
      blob,
      {
        params,
        headers
      }
    );
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

  private getHeadersOctetStream(subscriptionKey: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/octet-stream');
    headers = headers.set('Ocp-Apim-Subscription-Key', subscriptionKey);
    return headers;
  }

  private getHeaderJSON(){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Ocp-Apim-Subscription-Key', this.apiKey);
    return headers;
  }

  private getParams() {
    const httpParams = new HttpParams()
      .set('returnFaceId', 'true')
      .set('returnFaceLandmarks', 'false')
      .set(
        'returnFaceAttributes',
        'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
      );

    return httpParams;
  }

  getRectangleCoordinates(resources)
  {
   
    let resource = resources["faceRectangle"];
        let rectangle : any;
        rectangle = [resource["top"], 
                    resource["left"],
                    resource["width"],
                    resource["height"]];
        return rectangle;
  }

  getFaceAttributes(resources)
  {
    let fa = resources["faceAttributes"];
    console.log(fa);
    let faceAttributes: any;

    faceAttributes = [fa["age"], fa["gender"], fa["smile"]];

    return faceAttributes;

  }
  createPersonGroup(group_name: string, _name: string, _userData: string){
    return this.httpClient.put<any>(
      this.person_groups_url + group_name, {name: _name, userData: _userData},
      { headers: this.getHeaderJSON(), responseType: 'json', observe: 'response'});
  }

  createPerson(group_id:string, _name: string, _userData: string){
    return this.httpClient.post<any>(
      this.person_groups_url + group_id + '/persons/', {name: _name, userData: _userData},
      { headers: this.getHeaderJSON(), responseType: 'json', observe: 'response'});
  }

  addPersonImage(group_id: string, image: any, personID: string){
    return this.httpClient.post<any>
    (this.person_groups_url + group_id + '/persons/' + personID + '/persistedFaces', image,
      { headers: this.getHeadersOctetStream(this.apiKey), responseType: 'json', observe:'response'});
  }
  getPerson(group_id: string, _personID: string){
    return this.httpClient.get<any>(
      this.person_groups_url + group_id + '/persons/' + _personID,
      { headers: this.getHeaderJSON(), responseType: 'json', observe: 'response'});
  }

  trainGroup(group_id: string){
    return this.httpClient.post<any>(
      this.person_groups_url + group_id + '/train', {},
      { headers: this.getHeaderJSON(), responseType: 'json', observe: 'response'});
  }
  faceIdentify(group_id: string, _faceId: string){
    return this.httpClient.post<any>(
      this.face_identify_url, { faceIds: _faceId, personGroupId: group_id },
      { headers: this.getHeaderJSON(), responseType: 'json', observe: 'response' });
  }
}

