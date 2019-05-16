import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebCamComponentComponent } from './web-cam-component.component';

describe('WebCamComponentComponent', () => {
  let component: WebCamComponentComponent;
  let fixture: ComponentFixture<WebCamComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebCamComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebCamComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
