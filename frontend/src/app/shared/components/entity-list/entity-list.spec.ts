import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntityListComponent } from './entity-list.component';

describe('EntityList', () => {
  let component: EntityListComponent;
  let fixture: ComponentFixture<EntityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntityListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EntityListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
