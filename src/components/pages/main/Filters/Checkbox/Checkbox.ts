import CreateHtml from '../CreateHtml';
import {ProductType} from '../../../../types/types';
import {filterState} from '../../MainPage';

class Checkbox extends CreateHtml {
  private routerParams: Record<string, string>;

  constructor(routerParams: Record<string, string>) {
    super();
    this.routerParams = routerParams;
  }

  getCheckbox(el: HTMLElement, str: string, type: string, dataFiltered: Array<ProductType>) {
    const div = this.createElement('div', 'checkbox-line');
    const input = this.createElement('input', 'checkbox__input') as HTMLInputElement;
    input.setAttribute('type', 'checkbox');
    input.id = str + '/';
    const searchKey = type.split('__')[0];
    if (this.routerParams.hasOwnProperty(searchKey)) {
      const searchKeyArray = this.routerParams[searchKey].split('↕');
      if (searchKeyArray.some(t => t === str)) {
        input.checked = true;
      }
    }
    const label = this.createElement('label', 'checkbox__label');
    label.setAttribute('for', str);
    label.textContent = str;
    const span = this.createElement('span', 'filter-count');
    span.classList.add(type);
    span.textContent = `(${this.countOfProductsAll(dataFiltered, str, el)}/${this.countOfProductsAll(
      filterState.state,
      str,
      el
    )})`;
    div.append(input, label, span);
    el.append(div);
  }

  countOfProductsAll(data: Array<ProductType>, el: string, node: HTMLElement) {
    let count = 0;
    if ((node.parentNode as HTMLElement).classList.contains('category')) {
      data.forEach((t) => (t.category.toLowerCase() === el.toLowerCase() ? (count += 1) : (count += 0)));
    } else {
      data.forEach((t) => (t.brand.toLowerCase() === el.toLowerCase() ? (count += 1) : (count += 0)));
    }
    return count;
  }

  getCheckboxes(node: HTMLElement, array: Array<string>, type: string, dataFiltered: Array<ProductType>) {
    array.forEach((el, index) => {
      this.getCheckbox(node, el, type, dataFiltered);
    });
  }
}

export default Checkbox;
