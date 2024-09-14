import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCommentListComponent } from './admin-comment-list.component';

describe('AdminCommentListComponent', () => {
  let component: AdminCommentListComponent;
  let fixture: ComponentFixture<AdminCommentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCommentListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCommentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
