import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesPlayingComponent } from './resources-playing.component';

describe('ResourcesPlayingComponent', () => {
  let component: ResourcesPlayingComponent;
  let fixture: ComponentFixture<ResourcesPlayingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourcesPlayingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesPlayingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
