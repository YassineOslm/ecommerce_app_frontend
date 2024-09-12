import { TestBed } from '@angular/core/testing';

import { Auth0ManagementService } from './auth0-management.service';

describe('Auth0ManagementService', () => {
  let service: Auth0ManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Auth0ManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
