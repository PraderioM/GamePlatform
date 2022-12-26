import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewGameDescriptionComponent } from './new-game-description.component';

describe('NewGameDescriptionComponent', () => {
  let component: NewGameDescriptionComponent;
  let fixture: ComponentFixture<NewGameDescriptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewGameDescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGameDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
