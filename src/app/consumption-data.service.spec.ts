import { TestBed } from '@angular/core/testing';

import { ConsumptionDataService } from './consumption-data.service';

describe('ConsumptionDataService', () => {
  let service: ConsumptionDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsumptionDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
