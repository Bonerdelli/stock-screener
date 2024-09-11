import { Component, EventEmitter, Output } from '@angular/core';
import { TickerFilters } from '../crypto-currencies.types';
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
  @Output() filtersApplied = new EventEmitter<TickerFilters>();

  protected isVisible: boolean = false;
  protected filters: TickerFilters = { ...defaultFilters };

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

  openModal() {
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
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
