import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadsPlayingComponent } from './roads-playing.component';

describe('RoadsPlayingComponent', () => {
  let component: RoadsPlayingComponent;
  let fixture: ComponentFixture<RoadsPlayingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoadsPlayingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadsPlayingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
