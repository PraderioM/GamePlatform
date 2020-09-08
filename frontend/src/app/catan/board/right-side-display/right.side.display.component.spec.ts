import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightSideDisplayComponent } from './right.side.display.component';

describe('OptionsDisplayComponent', () => {
  let component: RightSideDisplayComponent;
  let fixture: ComponentFixture<RightSideDisplayComponent>;

  beforeEach(async(() => {
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
