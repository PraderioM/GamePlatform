import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderBoardPositionDisplayComponent } from './leader-board-position-display.component';

describe('LeaderBoardPositionDisplayComponent', () => {
  let component: LeaderBoardPositionDisplayComponent;
  let fixture: ComponentFixture<LeaderBoardPositionDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaderBoardPositionDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderBoardPositionDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
