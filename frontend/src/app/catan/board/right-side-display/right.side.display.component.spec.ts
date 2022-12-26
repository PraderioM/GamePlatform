import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RightSideDisplayComponent } from './right.side.display.component';

describe('OptionsDisplayComponent', () => {
  let component: RightSideDisplayComponent;
  let fixture: ComponentFixture<RightSideDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RightSideDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightSideDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
