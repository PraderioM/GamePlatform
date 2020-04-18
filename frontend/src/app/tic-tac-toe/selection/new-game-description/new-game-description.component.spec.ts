import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGameDescriptionComponent } from './new-game-description.component';

describe('NewGameDescriptionComponent', () => {
  let component: NewGameDescriptionComponent;
  let fixture: ComponentFixture<NewGameDescriptionComponent>;

  beforeEach(async(() => {
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
