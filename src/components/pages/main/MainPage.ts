import Page from '../../common/Page';
import AppController from './products/controller/controller';
import Cards from './products/cards/Cards';
import Filters from './Filters/Filters';
import { ProductType } from '../../types/types';
import { copyTextToClipboard } from '../../../index';

export type FilterStateType = {
  categories: Array<string>;
  brands: Array<string>;
  price: Array<number>;
  stock: Array<number>;
  state: Array<ProductType>;
  filter: Array<ProductType>;
  setCategory: (str: string) => void;
  setBrand: (str: string) => void;
  setPrice: (str: number) => void;
  setStock: (str: number) => void;
  setState: (arr: Array<ProductType>) => void;
  setFilter: (arr: Array<ProductType>) => void;
};

export const filterState: FilterStateType = {
  categories: [],
  brands: [],
  price: [],
  stock: [],
  state: [],
  filter: [],
  setCategory(category: string) {
    if (!this.categories.some((t) => t === category)) {
      this.categories.push(category);
      this.categories.sort();
    }
  },
  setBrand(brand: string) {
    if (!this.brands.some((t) => t.toLowerCase() === brand.toLowerCase())) {
      this.brands.push(brand);
      this.brands.sort();
    }
  },
  setPrice(price: number) {
    if (!this.price.some((t) => t === price)) {
      this.price.push(price);
    }
    this.price.sort((a, b) => a - b);
  },
  setStock(stock: number) {
    if (!this.stock.some((t) => t === stock)) {
      this.stock.push(stock);
    }
    this.stock.sort((a, b) => a - b);
  },
  setState(arr: Array<ProductType>) {
    this.state = [...arr];
  },
  setFilter(arr: Array<ProductType>) {
    this.filter = [...arr];
  },
};

class MainPage extends Page {
  static TextObject = {};
  private controller: AppController;
  private cards: Cards;
  private filter: Filters;
  readonly filterContainer: HTMLElement;
  private state: Array<ProductType>;
  public url: URL;
  public urlParams: URLSearchParams;
  public routerParams: Record<string, string>;
  private filterState: Array<ProductType>;

  constructor(id: string) {
    super(id);
    this.controller = new AppController();
    this.state = [];
    this.filterState = [];
    this.cards = new Cards();
    this.filterContainer = this.getSection('filters__section');
    this.routerParams = window.location.search === '' ? {} : this.getSearchParams();
    this.url = new URL('http://localhost:5333/');
    this.urlParams = new URLSearchParams(window.location.search);
    this.filter = new Filters(this.routerParams);
  }

  getSearchParams() {
    return window.location.search
      .slice(window.location.search.indexOf('?') + 1)
      .split('&')
      .reduce((params, hash) => {
        hash.replace('+', ' ');
        const [key, val] = hash.split('=');
        return Object.assign(params, { [key]: decodeURIComponent(val).replace('+', ' ') });
      }, {});
  }

  getFilterQueryState() {
    this.filterState = this.state;
    if (this.routerParams.hasOwnProperty('category')) {
      this.filterState = this.filterState.filter((t) => {
        if (this.routerParams.category.split('↕').some((el) => el === t.category)) {
          return t;
        }
      });
    }
    if (this.routerParams.hasOwnProperty('brand')) {
      this.filterState = this.filterState.filter((t) => {
        if (this.routerParams.brand.split('↕').some((el) => el === t.brand)) {
          return t;
        }
      });
    }
    if (this.routerParams.hasOwnProperty('price')) {
      this.filterState = [...this.filterState].filter((t) => {
        if (
          t.price >= Number(this.routerParams.price.split('↕')[0]) &&
          t.price <= Number(this.routerParams.price.split('↕')[1])
        ) {
          return t;
        }
      });
    }
    if (this.routerParams.hasOwnProperty('stock')) {
      this.filterState = [...this.filterState].filter((t) => {
        if (
          t.stock >= Number(this.routerParams.stock.split('↕')[0]) &&
          t.stock <= Number(this.routerParams.stock.split('↕')[1])
        ) {
          return t;
        }
      });
    }
    if (this.routerParams.hasOwnProperty('search')) {
      this.filterState = [...this.filterState].filter((obj) => {
        const searchText = this.routerParams.search;
        if (
          obj.brand.toLowerCase().includes(searchText) ||
          obj.price.toString().toLowerCase().includes(searchText) ||
          obj.title.toLowerCase().includes(searchText) ||
          obj.description.toLowerCase().includes(searchText) ||
          obj.category.toLowerCase().includes(searchText)
        ) {
          return obj;
        }
      });
    }
    if (this.routerParams.hasOwnProperty('sort')) {
      this.toSortFilterState(this.routerParams.sort);
    }
  }

  inputEvent(e: Event) {
    const target = e.target as HTMLInputElement;
    const targetTitle = target.value;
    if (targetTitle) {
      this.routerParams = { ...this.routerParams, [`search`]: targetTitle };
    } else {
      delete this.routerParams[`search`];
      history.pushState('', '', window.location.origin);
    }
    this.urlParams = new URLSearchParams(this.routerParams);
    this.url.search = this.urlParams.toString();
    history.pushState('', '', this.url.search);
    this.getFilterQueryState();
    this.toUpdateCheckboxSpan();
    const viewMode = this.routerParams.hasOwnProperty('view') ? this.routerParams.view : 'cards';
    this.cards.drawProducts(this.filterState, viewMode);
  }

  getSection(className: string) {
    const section = document.createElement('section');
    section.classList.add(className);
    return section;
  }

  addEventListener() {
    const allCheckboxes = this.filterContainer.querySelectorAll('.checkbox__input');
    allCheckboxes.forEach((t, i) => {
      t.addEventListener('input', (e) => {
        this.addCheckboxFilter(e);
      });
    });
    const rangeInputs1 = this.filterContainer.querySelectorAll('.slider-1');
    const rangeInputs2 = this.filterContainer.querySelectorAll('.slider-2');
    rangeInputs1.forEach((t, i) => {
      t.addEventListener('input', (e) => {
        this.addRangeFilter(e);
      });
    });
    rangeInputs2.forEach((t, i) => {
      t.addEventListener('input', (e) => {
        this.addRangeFilter(e);
      });
    });
    this.filter.filterButtons.btnResetFilter.addEventListener('click', (e) => {
      this.routerParams = {};
      this.urlParams = new URLSearchParams(this.routerParams);
      history.pushState('', '', window.location.origin);
      this.getFilterQueryState();
      this.toUpdateCheckboxSpan();
      this.toUpdateRangeValue();
      document.querySelectorAll('.checkbox__input').forEach((t) => {
        (t as HTMLInputElement).checked = false;
      });
      this.toUpdateSelect();
      const viewMode = this.routerParams.hasOwnProperty('view') ? this.routerParams.view : 'cards';
      this.cards.drawProducts(this.filterState, viewMode);
    });
    this.filter.filterButtons.btnCopyLink.addEventListener('click', (e) => {
      copyTextToClipboard(window.location.href).then((r) => r);
    });
    const sortSelect = document.querySelector('.sort__select') as HTMLSelectElement;
    sortSelect.addEventListener('click', (e) => {
      this.addSortFilter(e);
    });
    const viewSelect = document.querySelector('.view__select') as HTMLSelectElement;
    viewSelect.addEventListener('click', (e) => {
      const target = e.target as HTMLOptionElement;
      if (target.value === 'cards' || target.value === 'list') {
        this.routerParams = {
          ...this.routerParams,
          ['view']: target.value,
        };
        this.urlParams = new URLSearchParams(this.routerParams);
        this.url.search = this.urlParams.toString();
        history.pushState('', '', this.url.search);
        this.toUpdateSelect();
        this.cards.drawProducts(this.filterState, this.routerParams.view);
      }
    });
  }

  toSortFilterState(typeOfSort: string) {
    if (typeOfSort === 'price-ASC') {
      this.filterState = [...this.filterState].sort((a, b) => a.price - b.price);
    } else if (typeOfSort === 'price-DESC') {
      this.filterState = [...this.filterState].sort((a, b) => b.price - a.price);
    } else if (typeOfSort === 'rating-ASC') {
      this.filterState = [...this.filterState].sort((a, b) => a.stock - b.stock);
    } else if (typeOfSort === 'rating-DESC') {
      this.filterState = [...this.filterState].sort((a, b) => b.stock - a.stock);
    }
  }

  addSortFilter(e: Event) {
    const target = e.target as HTMLOptionElement;
    const typeOfSort = target.value;
    this.routerParams = {
      ...this.routerParams,
      ['sort']: target.value,
    };
    this.urlParams = new URLSearchParams(this.routerParams);
    this.url.search = this.urlParams.toString();
    history.pushState('', '', this.url.search);
    this.toSortFilterState(typeOfSort);
    const viewMode = this.routerParams.hasOwnProperty('view') ? this.routerParams.view : 'cards';
    this.cards.drawProducts(this.filterState, viewMode);
  }

  addCheckboxFilter(e: Event) {
    const target = e.target as HTMLInputElement;
    const typeOfCheckbox = target.parentElement?.parentElement?.parentElement?.classList.toString();
    const targetTitle = target.nextElementSibling?.textContent;
    if (target.checked) {
      if (this.routerParams.hasOwnProperty(`${typeOfCheckbox}`)) {
        this.routerParams = {
          ...this.routerParams,
          [`${typeOfCheckbox}`]: this.routerParams[`${typeOfCheckbox}`] + '↕' + targetTitle,
        };
      } else {
        if (targetTitle) {
          this.routerParams = { ...this.routerParams, [`${typeOfCheckbox}`]: targetTitle };
        }
      }
    } else {
      if (targetTitle) {
        const newCategoryTextArr = this.routerParams[`${typeOfCheckbox}`].split('↕').filter((t) => t !== targetTitle);
        if (newCategoryTextArr.length === 0) {
          console.log(newCategoryTextArr);
          delete this.routerParams[`${typeOfCheckbox}`];
          if (!Object.keys(this.routerParams).length) {
            this.urlParams = new URLSearchParams(this.routerParams);
            this.url.search = this.urlParams.toString();
            history.pushState('', '', window.location.origin);
          }
        } else {
          const newCategoryText = newCategoryTextArr.join('↕');
          this.routerParams = { ...this.routerParams, [`${typeOfCheckbox}`]: newCategoryText };
        }
      }
    }
    this.urlParams = new URLSearchParams(this.routerParams);
    this.url.search = this.urlParams.toString();
    history.pushState('', '', this.url.search);
    this.getFilterQueryState();
    this.toUpdateCheckboxSpan();
    this.toUpdateRangeValue();
    this.cards.cardsHeader.toUpdateFoundCount(this.filterState);
    const viewMode = this.routerParams.hasOwnProperty('view') ? this.routerParams.view : 'cards';
    this.cards.drawProducts(this.filterState, viewMode);
  }

  toUpdateCheckboxSpan() {
    this.filterContainer.querySelectorAll('.checkbox-line').forEach((el) => {
      (el.lastElementChild as HTMLSpanElement).innerHTML = '';
      (el.lastElementChild as HTMLSpanElement).textContent = `(${this.filter.checkbox.countOfProductsAll(
        this.filterState,
        (el.firstChild as HTMLInputElement).id.slice(0, -1),
        el.parentNode as HTMLElement
      )}/${this.filter.checkbox.countOfProductsAll(
        this.state,
        (el.firstChild as HTMLInputElement).id.slice(0, -1),
        el.parentNode as HTMLElement
      )})`;
    });
  }

  toUpdateRangeValue(e?: Event) {
    const sortDataByPrice = [...this.filterState].sort((a, b) => a.price - b.price);
    const sortDataByStock = [...this.filterState].sort((a, b) => a.stock - b.stock);
    const leftRanges = this.filterContainer.querySelectorAll('.slider-1');
    const rightRanges = this.filterContainer.querySelectorAll('.slider-2');
    const leftRangesSpan = this.filterContainer.querySelectorAll('.range1');
    const rightRangesSpan = this.filterContainer.querySelectorAll('.range2');
    const dashesSpan = this.filterContainer.querySelectorAll('.dash');
    const divSliderTracks = this.filterContainer.querySelectorAll('.slider-track');
    (leftRanges[0] as HTMLInputElement).value =
      sortDataByPrice.length > 1
        ? sortDataByPrice[0].price.toString()
        : sortDataByPrice.length === 1
        ? sortDataByPrice[0].price.toString()
        : (leftRanges[0] as HTMLInputElement).min;
    (leftRanges[1] as HTMLInputElement).value =
      sortDataByStock.length > 1
        ? sortDataByStock[0].stock.toString()
        : sortDataByStock.length === 1
        ? sortDataByStock[0].stock.toString()
        : (leftRanges[1] as HTMLInputElement).min;
    (rightRanges[0] as HTMLInputElement).value =
      sortDataByPrice.length > 1
        ? sortDataByPrice[sortDataByPrice.length - 1].price.toString()
        : sortDataByPrice.length === 1
        ? sortDataByPrice[0].price.toString()
        : (rightRanges[0] as HTMLInputElement).max;
    (rightRanges[1] as HTMLInputElement).value =
      sortDataByStock.length > 1
        ? sortDataByStock[sortDataByPrice.length - 1].stock.toString()
        : sortDataByStock.length === 1
        ? sortDataByStock[0].stock.toString()
        : (rightRanges[1] as HTMLInputElement).max;
    leftRangesSpan[0].textContent = sortDataByPrice.length === 0 ? '' : (leftRanges[0] as HTMLInputElement).value;
    leftRangesSpan[1].textContent = sortDataByStock.length === 0 ? '' : (leftRanges[1] as HTMLInputElement).value;
    rightRangesSpan[0].textContent = sortDataByPrice.length === 0 ? '' : (rightRanges[0] as HTMLInputElement).value;
    rightRangesSpan[1].textContent = sortDataByStock.length === 0 ? '' : (rightRanges[1] as HTMLInputElement).value;
    dashesSpan[0].textContent = sortDataByPrice.length === 0 ? 'NOT FOUND' : '-';
    dashesSpan[1].textContent = sortDataByStock.length === 0 ? 'NOT FOUND' : '-';
    this.filter.range.rangeColor(
      leftRanges[0] as HTMLInputElement,
      rightRanges[0] as HTMLInputElement,
      divSliderTracks[0] as HTMLElement,
      leftRangesSpan[0] as HTMLElement,
      rightRangesSpan[0] as HTMLElement
    );
    this.filter.range.rangeColor(
      leftRanges[1] as HTMLInputElement,
      rightRanges[1] as HTMLInputElement,
      divSliderTracks[1] as HTMLElement,
      leftRangesSpan[1] as HTMLElement,
      rightRangesSpan[1] as HTMLElement
    );
    if (e) {
      const target = e.target as HTMLInputElement;
      const typeOfRange: string | undefined = target.parentElement?.classList[1].split('-')[0];
      if (this.routerParams.hasOwnProperty(`${typeOfRange}`)) {
        const searchKeyArray = this.routerParams[`${typeOfRange}`].split('↕');
        const ranges = document.querySelectorAll(`.${typeOfRange}-range`);
        ranges[0].textContent = searchKeyArray[0];
        ranges[1].textContent = searchKeyArray[1];
        const sliderTrack = document.querySelector(`.${typeOfRange}-track`);
        if (target.classList.contains('slider-1')) {
          target.value = searchKeyArray[0];
          (target.nextElementSibling as HTMLInputElement).value = searchKeyArray[1];
          this.filter.range.rangeColor(
            target as HTMLInputElement,
            target.nextElementSibling as HTMLInputElement,
            sliderTrack as HTMLElement,
            ranges[0] as HTMLElement,
            ranges[1] as HTMLElement
          );
        } else if (target.classList.contains('slider-2')) {
          target.value = searchKeyArray[1];
          (target.previousElementSibling as HTMLInputElement).value = searchKeyArray[0];
          this.filter.range.rangeColor(
            target.previousElementSibling as HTMLInputElement,
            target as HTMLInputElement,
            sliderTrack as HTMLElement,
            ranges[0] as HTMLElement,
            ranges[1] as HTMLElement
          );
        }
      }
    }
  }

  toUpdateSelect() {
    const sortSelect = document.querySelector('.sort__select') as HTMLSelectElement;
    const sortOptions = sortSelect.querySelectorAll('option');
    if (this.routerParams.hasOwnProperty('sort')) {
      sortOptions.forEach((opt) => {
        if (opt.value === this.routerParams.sort) {
          opt.selected = true;
        }
      });
    } else {
      sortOptions[0].selected = true;
    }
    const viewSelect = document.querySelector('.view__select') as HTMLSelectElement;
    const viewOptions = viewSelect.querySelectorAll('option');
    if (this.routerParams.hasOwnProperty('view')) {
      viewOptions.forEach((opt) => {
        if (opt.value === this.routerParams.view) {
          opt.selected = true;
        }
      });
    } else {
      viewOptions[0].selected = true;
    }
  }

  addRangeFilter(e: Event) {
    const target = e.target as HTMLInputElement;
    const typeOfRange: string | undefined = target.parentElement?.classList[1].split('-')[0];
    const a =
      target.classList.toString() === 'slider-1'
        ? [target.value, (target.nextElementSibling as HTMLInputElement).value]
        : [(target.previousElementSibling as HTMLInputElement).value, target.value];
    if (typeOfRange) {
      this.routerParams = { ...this.routerParams, [typeOfRange]: a.join('↕') };
    }
    this.urlParams = new URLSearchParams(this.routerParams);
    this.url.search = this.urlParams.toString();
    history.pushState('', '', this.url.search);
    this.getFilterQueryState();
    const viewMode = this.routerParams.hasOwnProperty('view') ? this.routerParams.view : 'cards';
    this.cards.drawProducts(this.filterState, viewMode);
    this.toUpdateCheckboxSpan();
    this.toUpdateRangeValue(e);
    this.cards.cardsHeader.toUpdateFoundCount(this.filterState);
  }

  render() {
    this.container.append(this.filterContainer);
    this.filterContainer.append(this.filter.init());
    const cardSection = this.getSection('cards__section');
    const productItems = document.createElement('div');
    productItems.classList.add('product-items');
    cardSection.append(this.cards.cardsHeader.header, productItems);
    this.container.append(cardSection);
    const searchInput = document.querySelector('.search__input') as HTMLInputElement;
    if (this.routerParams.hasOwnProperty('search')) {
      searchInput.value = this.routerParams.search;
    }
    this.controller.getSources((data) => {
      if (data) {
        this.state = [...data];
        filterState.setState(data);
        window.location.search === '' ? (this.filterState = [...data]) : this.getFilterQueryState();
        data.forEach((t) => {
          filterState.setCategory(t.category);
          filterState.setBrand(t.brand);
          filterState.setPrice(t.price);
          filterState.setStock(t.stock);
        });
        this.filter.filterBtnWrapper.append(this.filter.filterButtons.render());
        this.filter.checkbox.getCheckboxes(
          this.filter.categoryFilterList.lastElementChild as HTMLElement,
          filterState.categories,
          'category__checkbox_span',
          this.filterState
        );
        this.filter.checkbox.getCheckboxes(
          this.filter.brandFilterList.lastElementChild as HTMLElement,
          filterState.brands,
          'brand__checkbox_span',
          this.filterState
        );
        this.filter.range.getDoubleRange(
          'price-container',
          this.filter.priceFilterList.lastElementChild as HTMLElement,
          filterState.price[0].toString(),
          filterState.price[filterState.price.length - 1].toString()
        );
        this.filter.range.getDoubleRange(
          'stock-container',
          this.filter.stockFilterList.lastElementChild as HTMLElement,
          filterState.stock[0].toString(),
          filterState.stock[filterState.stock.length - 1].toString()
        );
        this.toUpdateRangeValue();
        this.toUpdateSelect();
        this.cards.cardsHeader.toUpdateFoundCount(this.filterState);
        const viewMode = this.routerParams.hasOwnProperty('view') ? this.routerParams.view : 'cards';
        this.cards.drawProducts(this.filterState, viewMode);
        this.addEventListener();
      }
    });
    const inputSearch = document.querySelector('input') as HTMLElement;
    inputSearch.addEventListener('input', (e) => this.inputEvent(e));
    return this.container;
  }
}

export default MainPage;
