import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlayerDevelopmentDeckComponent } from './player-development-deck.component';

describe('PlayerDevelopmentDeckComponent', () => {
  let component: PlayerDevelopmentDeckComponent;
  let fixture: ComponentFixture<PlayerDevelopmentDeckComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerDevelopmentDeckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerDevelopmentDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
