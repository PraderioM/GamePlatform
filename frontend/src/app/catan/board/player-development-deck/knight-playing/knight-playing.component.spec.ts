import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KnightPlayingComponent } from './knight-playing.component';

describe('KnightPlayingComponent', () => {
  let component: KnightPlayingComponent;
  let fixture: ComponentFixture<KnightPlayingComponent>;

  beforeEach(waitForAsync(() => {
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
