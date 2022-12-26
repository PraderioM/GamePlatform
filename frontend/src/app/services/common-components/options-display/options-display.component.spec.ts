import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OptionsDisplayComponent } from './options-display.component';

describe('OptionsDisplayComponent', () => {
  let component: OptionsDisplayComponent;
  let fixture: ComponentFixture<OptionsDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionsDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
