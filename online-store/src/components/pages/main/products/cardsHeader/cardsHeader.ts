import './CardHeader.scss';
import CreateHtml from '../../Filters/CreateHtml';
import products from '../cards/Products';
import {ProductType} from '../../../../types/types';

class CardsHeader extends CreateHtml {
  public header: HTMLElement;

  constructor() {
    super();
    this.header = this.render();
  }

  toUpdateFoundCount(data: Array<ProductType>) {
    const foundSpan = document.querySelector('.found__span') as HTMLSpanElement;
    foundSpan.innerText = data.length.toString();
  }

  render() {
    const header = this.createElement('div', 'cards-header');
    const sortDiv = this.createElement('div', 'sort-wrapper');
    const sortSelect = this.createElement('select', 'sort__select');
    const sortSelectOptionDefault = document.createElement('option');
    const sortSelectOption1 = document.createElement('option');
    const sortSelectOption2 = document.createElement('option');
    const sortSelectOption3 = document.createElement('option');
    const sortSelectOption4 = document.createElement('option');
    sortSelectOptionDefault.textContent = 'Sort option';
    sortSelectOptionDefault.disabled = true;
    sortSelectOptionDefault.defaultSelected = true;
    sortSelectOption1.textContent = 'Sort by price ASC';
    sortSelectOption2.textContent = 'Sort by price DESC';
    sortSelectOption3.textContent = 'Sort by rating ASC';
    sortSelectOption4.textContent = 'Sort by rating Desc';
    sortSelectOption1.setAttribute('value', 'price-ASC');
    sortSelectOption2.setAttribute('value', 'price-DESC');
    sortSelectOption3.setAttribute('value', 'rating-ASC');
    sortSelectOption4.setAttribute('value', 'rating-DESC');
    sortDiv.append(sortSelect);
    sortSelect.append(sortSelectOptionDefault, sortSelectOption1, sortSelectOption2, sortSelectOption3, sortSelectOption4);
    const foundDiv = this.createElement('div', 'found-wrapper');
    foundDiv.innerText = 'Found:';
    const foundSpan = this.createElement('span', 'found__span');
    foundSpan.textContent = '0';
    foundDiv.append(foundSpan);
    const viewDiv = this.createElement('div', 'view-wrapper');
    const viewSelect = this.createElement('select', 'view__select');
    const viewSelectOptionDefault = document.createElement('option');
    const viewSelectOption1 = document.createElement('option');
    const viewSelectOption2 = document.createElement('option');
    viewSelectOptionDefault.textContent = 'View mode';
    viewSelectOptionDefault.disabled = true;
    viewSelectOptionDefault.defaultSelected = true;
    viewSelectOption1.textContent = 'View by cards';
    viewSelectOption2.textContent = 'View by list';
    viewSelectOption1.setAttribute('value', 'cards');
    viewSelectOption2.setAttribute('value', 'list');
    viewDiv.append(viewSelect);
    viewSelect.append(viewSelectOptionDefault, viewSelectOption1, viewSelectOption2);
    header.append(sortDiv, foundDiv, viewDiv);
    return header;
  }
}

export default CardsHeader;
