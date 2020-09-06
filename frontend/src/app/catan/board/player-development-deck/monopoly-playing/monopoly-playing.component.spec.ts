import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonopolyPlayingComponent } from './monopoly-playing.component';

describe('MonopolyPlayingComponent', () => {
  let component: MonopolyPlayingComponent;
  let fixture: ComponentFixture<MonopolyPlayingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonopolyPlayingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonopolyPlayingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
