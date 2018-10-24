import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HueConnectComponent } from './hue-connect.component';

describe('HueConnectComponent', () => {
  let component: HueConnectComponent;
  let fixture: ComponentFixture<HueConnectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HueConnectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HueConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
