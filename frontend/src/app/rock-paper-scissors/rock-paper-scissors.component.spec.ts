import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RockPaperScissorsComponent } from './rock-paper-scissors.component';

describe('RockPaperScissorsComponent', () => {
  let component: RockPaperScissorsComponent;
  let fixture: ComponentFixture<RockPaperScissorsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RockPaperScissorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RockPaperScissorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
