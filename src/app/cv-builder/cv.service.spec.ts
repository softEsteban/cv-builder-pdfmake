/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CvService } from './cv.service';

describe('Service: Cv', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CvService]
    });
  });

  it('should ...', inject([CvService], (service: CvService) => {
    expect(service).toBeTruthy();
  }));
});
