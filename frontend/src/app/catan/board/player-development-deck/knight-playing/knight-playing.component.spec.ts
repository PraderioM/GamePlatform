import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnightPlayingComponent } from './knight-playing.component';

describe('KnightPlayingComponent', () => {
  let component: KnightPlayingComponent;
  let fixture: ComponentFixture<KnightPlayingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnightPlayingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnightPlayingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
