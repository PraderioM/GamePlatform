import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlayersDisplayComponent } from './players-display.component';

describe('PlayersDisplayComponent', () => {
  let component: PlayersDisplayComponent;
  let fixture: ComponentFixture<PlayersDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayersDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
