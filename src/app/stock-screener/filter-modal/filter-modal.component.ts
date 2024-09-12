import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TickerFilters } from '../stock-screener.types';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const defaultFilters: TickerFilters = {
  minVolume: null,
  maxVolume: null,
  minPriceChange: null,
  maxPriceChange: null,
  minPrice: null,
  maxPrice: null
};

@Component({
  selector: 'app-filter-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-modal.component.html',
})
export class FilterModalComponent {
  @Input() foundCount: number = 0;
  @Output() filtersApplied = new EventEmitter<TickerFilters>();

  @ViewChild('minVolume', { static: false })
  private minVolumeElement: ElementRef<HTMLInputElement> | null = null;
  @ViewChild('minPriceChange', { static: false })
  private minPriceChangeElement: ElementRef<HTMLInputElement> | null = null;
  @ViewChild('minPrice', { static: false })
  private minPriceElement: ElementRef<HTMLInputElement> | null = null;

  protected isVisible = false;
  protected filters: TickerFilters = { ...defaultFilters };

  get message(): string {
    if (this.foundCount === 0) {
      return 'No results found';
    }
    if (String(this.foundCount).endsWith('1')) {
      return `Found ${this.foundCount} result`;
    }
    return `Found ${this.foundCount} results`;
  }

  get isFiltersActive(): boolean {
    return this.isPriceFilterActive || this.isVolumeFilterActive || this.isPriceChangeFilterActive
  }

  get isPriceFilterActive(): boolean {
    return Boolean(this.filters.minPrice) || Boolean(this.filters.maxPrice)
  }

  get isVolumeFilterActive(): boolean {
    return Boolean(this.filters.minVolume) || Boolean(this.filters.maxVolume)
  }

  get isPriceChangeFilterActive(): boolean {
    return Boolean(this.filters.minPriceChange) || Boolean(this.filters.maxPriceChange)
  }

  openModal(focusOn?: string) {
    this.isVisible = true;
    setTimeout(() => this.focusOnInput(focusOn));
  }

  closeModal() {
    this.isVisible = false;
  }

  protected focusOnInput(focusOn?: string) {
    switch (focusOn) {
      case 'volume':
        this.minVolumeElement?.nativeElement.focus()
        break;
      case 'priceChange':
        this.minPriceChangeElement?.nativeElement.focus()
        break;
      case 'price':
        this.minPriceElement?.nativeElement.focus()
        break;
      default:
        break;
    }
  }

  updateFilters() {
    this.filtersApplied.emit(this.filters);
  }

  applyFilters() {
    this.filtersApplied.emit(this.filters);
    this.closeModal();
  }

  clearFilters() {
    this.filters = { ...defaultFilters };
    this.closeModal();
  }
}
