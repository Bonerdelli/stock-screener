/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { fakeAsync, tick } from '@angular/core/testing';

import { FilterModalComponent, defaultFilters } from './filter-modal.component';

describe('FilterModalComponent', () => {
  let component: FilterModalComponent;
  let fixture: ComponentFixture<FilterModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('message getter', () => {
    it('should return "No results found" when foundCount is 0', () => {
      component.foundCount = 0;
      expect(component.message).toBe('No results found');
    });

    it('should return singular form when foundCount ends with 1', () => {
      component.foundCount = 1;
      expect(component.message).toBe('Found 1 result');

      component.foundCount = 21;
      expect(component.message).toBe('Found 21 result');

      component.foundCount = 101;
      expect(component.message).toBe('Found 101 result');
    });

    it('should return plural form for other counts', () => {
      component.foundCount = 2;
      expect(component.message).toBe('Found 2 results');

      component.foundCount = 10;
      expect(component.message).toBe('Found 10 results');

      component.foundCount = 22;
      expect(component.message).toBe('Found 22 results');
    });
  });

  describe('isFiltersActive getter', () => {
    it('should return false when no filters are active', () => {
      component['filters'] = { ...defaultFilters };
      expect(component.isFiltersActive).toBe(false);
    });

    it('should return true when price filter is active', () => {
      component['filters'] = {
        ...defaultFilters,
        minPrice: 100,
      };
      expect(component.isFiltersActive).toBe(true);
    });

    it('should return true when volume filter is active', () => {
      component['filters'] = {
        ...defaultFilters,
        minVolume: 1000,
      };
      expect(component.isFiltersActive).toBe(true);
    });

    it('should return true when price change filter is active', () => {
      component['filters'] = {
        ...defaultFilters,
        minPriceChange: 1.5,
      };
      expect(component.isFiltersActive).toBe(true);
    });
  });

  describe('isPriceFilterActive getter', () => {
    it('should return false when no price filters', () => {
      component['filters'] = { ...defaultFilters };
      expect(component.isPriceFilterActive).toBe(false);
    });

    it('should return true when minPrice is set', () => {
      component['filters'] = {
        ...defaultFilters,
        minPrice: 100,
      };
      expect(component.isPriceFilterActive).toBe(true);
    });

    it('should return true when maxPrice is set', () => {
      component['filters'] = {
        ...defaultFilters,
        maxPrice: 1000,
      };
      expect(component.isPriceFilterActive).toBe(true);
    });
  });

  describe('isVolumeFilterActive getter', () => {
    it('should return false when no volume filters', () => {
      component['filters'] = { ...defaultFilters };
      expect(component.isVolumeFilterActive).toBe(false);
    });

    it('should return true when minVolume is set', () => {
      component['filters'] = {
        ...defaultFilters,
        minVolume: 1000,
      };
      expect(component.isVolumeFilterActive).toBe(true);
    });

    it('should return true when maxVolume is set', () => {
      component['filters'] = {
        ...defaultFilters,
        maxVolume: 10000,
      };
      expect(component.isVolumeFilterActive).toBe(true);
    });
  });

  describe('isPriceChangeFilterActive getter', () => {
    it('should return false when no price change filters', () => {
      component['filters'] = { ...defaultFilters };
      expect(component.isPriceChangeFilterActive).toBe(false);
    });

    it('should return true when minPriceChange is set', () => {
      component['filters'] = {
        ...defaultFilters,
        minPriceChange: 1.0,
      };
      expect(component.isPriceChangeFilterActive).toBe(true);
    });

    it('should return true when maxPriceChange is set', () => {
      component['filters'] = {
        ...defaultFilters,
        maxPriceChange: 5.0,
      };
      expect(component.isPriceChangeFilterActive).toBe(true);
    });
  });

  describe('openModal', () => {
    it('should set isVisible to true', () => {
      component['isVisible'] = false;
      component.openModal();
      expect(component['isVisible']).toBe(true);
    });

    it('should call focusOnInput with parameter', fakeAsync(() => {
      spyOn(component as any, 'focusOnInput');
      component.openModal('volume');
      tick(0);
      expect(component['focusOnInput']).toHaveBeenCalledWith('volume');
    }));

    it('should handle undefined focusOn parameter', fakeAsync(() => {
      spyOn(component as any, 'focusOnInput');
      component.openModal();
      tick(0);
      expect(component['focusOnInput']).toHaveBeenCalledWith(undefined);
    }));
  });

  describe('closeModal', () => {
    it('should set isVisible to false', () => {
      component['isVisible'] = true;
      component.closeModal();
      expect(component['isVisible']).toBe(false);
    });
  });

  describe('focusOnInput', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should focus on minVolume input when focusOn is "volume"', () => {
      const mockElement = {
        nativeElement: {
          focus: jasmine.createSpy('focus'),
        },
      };
      component['minVolumeElement'] = mockElement as any;

      component['focusOnInput']('volume');

      expect(mockElement.nativeElement.focus).toHaveBeenCalled();
    });

    it('should focus on minPriceChange input when focusOn is "priceChange"', () => {
      const mockElement = {
        nativeElement: {
          focus: jasmine.createSpy('focus'),
        },
      };
      component['minPriceChangeElement'] = mockElement as any;

      component['focusOnInput']('priceChange');

      expect(mockElement.nativeElement.focus).toHaveBeenCalled();
    });

    it('should focus on minPrice input when focusOn is "price"', () => {
      const mockElement = {
        nativeElement: {
          focus: jasmine.createSpy('focus'),
        },
      };
      component['minPriceElement'] = mockElement as any;

      component['focusOnInput']('price');

      expect(mockElement.nativeElement.focus).toHaveBeenCalled();
    });
  });

  describe('updateFilters', () => {
    it('should emit filtersApplied event with current filters', () => {
      spyOn(component.filtersApplied, 'emit');
      component['filters'] = {
        minVolume: 1000,
        maxVolume: 5000,
        minPriceChange: 1.0,
        maxPriceChange: 2.0,
        minPrice: 100,
        maxPrice: 1000,
      };

      component.updateFilters();

      expect(component.filtersApplied.emit).toHaveBeenCalledWith(
        component['filters']
      );
    });
  });

  describe('applyFilters', () => {
    it('should emit filtersApplied event and close modal', () => {
      spyOn(component.filtersApplied, 'emit');
      spyOn(component, 'closeModal');
      component['filters'] = {
        minVolume: 1000,
        maxVolume: null,
        minPriceChange: null,
        maxPriceChange: null,
        minPrice: null,
        maxPrice: null,
      };

      component.applyFilters();

      expect(component.filtersApplied.emit).toHaveBeenCalledWith(
        component['filters']
      );
      expect(component.closeModal).toHaveBeenCalled();
    });
  });

  describe('clearFilters', () => {
    it('should reset filters to default and close modal', () => {
      spyOn(component, 'closeModal');
      component['filters'] = {
        minVolume: 1000,
        maxVolume: 5000,
        minPriceChange: 1.0,
        maxPriceChange: 2.0,
        minPrice: 100,
        maxPrice: 1000,
      };

      component.clearFilters();

      expect(component['filters']).toEqual(defaultFilters);
      expect(component.closeModal).toHaveBeenCalled();
    });
  });
});
