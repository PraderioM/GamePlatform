import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlayerDisplayComponent } from './player-display.component';

describe('PlayerDisplayComponent', () => {
  let component: PlayerDisplayComponent;
  let fixture: ComponentFixture<PlayerDisplayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
