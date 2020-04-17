import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderBoardRowDisplayComponent } from './leader-board-row-display.component';

describe('LeaderBoardPositionDisplayComponent', () => {
  let component: LeaderBoardRowDisplayComponent;
  let fixture: ComponentFixture<LeaderBoardRowDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaderBoardRowDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderBoardRowDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
