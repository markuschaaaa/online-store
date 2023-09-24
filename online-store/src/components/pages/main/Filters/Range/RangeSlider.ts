import CreateHtml from '../CreateHtml';

class RangeSlider extends CreateHtml {
  private routerParams: Record<string, string>;

  constructor(routerParams: Record<string, string>) {
    super();
    this.routerParams = routerParams;
  }

  getDoubleRange(type: string, node: HTMLElement, minValue: string, maxValue: string) {
    const divWrapper = this.createElement('div', 'wrapper');
    const values = this.createElement('div', 'values');
    const range1 = this.createElement('span', 'range1');
    range1.classList.add(`${type.split('-')[0]}-range`);
    const dash = this.createElement('span', 'dash');
    dash.textContent = '-';
    const range2 = this.createElement('span', 'range2');
    range2.classList.add(`${type.split('-')[0]}-range`);
    values.append(range1, dash, range2);
    const divContainer = this.createElement('div', 'container');
    divContainer.classList.add(type);
    const divSliderTrack = this.createElement('div', 'slider-track');
    divSliderTrack.classList.add(`${type.split('-')[0]}-track`);
    const inputSlider1 = this.createElement('input', 'slider-1') as HTMLInputElement;
    inputSlider1.setAttribute('type', 'range');
    inputSlider1.setAttribute('min', minValue);
    inputSlider1.setAttribute('max', maxValue);

    const inputSlider2 = this.createElement('input', 'slider-2') as HTMLInputElement;
    inputSlider2.setAttribute('type', 'range');
    inputSlider2.setAttribute('min', minValue);
    inputSlider2.setAttribute('max', maxValue);


    const searchKey = type.split('-')[0];
    if (this.routerParams.hasOwnProperty(searchKey)) {
      const searchKeyArray = this.routerParams[searchKey].split('↕');
      range1.textContent = searchKeyArray[0];
      range2.textContent = searchKeyArray[1];
      inputSlider1.setAttribute('value', searchKeyArray[0]);
      inputSlider2.setAttribute('value', searchKeyArray[1]);
    } else {
      range1.textContent = minValue;
      range2.textContent = maxValue;
      inputSlider1.setAttribute('value', minValue);
      inputSlider2.setAttribute('value', maxValue);
    }

    divContainer.append(divSliderTrack, inputSlider1, inputSlider2);
    divWrapper.append(values, divContainer);
    node.append(divWrapper);
    this.rangeColor(inputSlider1, inputSlider2, divSliderTrack, range1, range2);
    /*function fillColor() {
      const percent1: number = (+inputSlider1.value / +inputSlider1.max) * 100;
      const percent2: number = (+inputSlider2.value / +inputSlider1.max) * 100;
      divSliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #3264fe ${percent1}% , #3264fe ${percent2}%, #dadae5 ${percent2}%)`;
    }

    function slideOne() {
      if (parseInt(inputSlider2.value) - parseInt(inputSlider1.value) <= 0) {
        inputSlider1.value = String(parseInt(inputSlider2.value));
      }
      range1.textContent = inputSlider1.value;
      fillColor();
    }

    function slideTwo() {
      if (parseInt(inputSlider2.value) - parseInt(inputSlider1.value) <= 0) {
        inputSlider2.value = String(parseInt(inputSlider1.value));
      }
      range2.textContent = inputSlider2.value;
      fillColor();
    }

    slideOne();
    slideTwo();
    inputSlider1.addEventListener('change', () => slideOne());
    inputSlider2.addEventListener('change', () => slideTwo());*/
  }

  rangeColor(inputSlider1: HTMLInputElement, inputSlider2: HTMLInputElement, divSliderTrack: HTMLElement, range1: HTMLElement, range2: HTMLElement) {

    function fillColor() {
      const percent1: number = (+inputSlider1.value / +inputSlider1.max) * 100;
      const percent2: number = (+inputSlider2.value / +inputSlider1.max) * 100;
      divSliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #3264fe ${percent1}% , #3264fe ${percent2}%, #dadae5 ${percent2}%)`;
    }

    function slideOne() {
      if (parseInt(inputSlider2.value) - parseInt(inputSlider1.value) <= 0) {
        inputSlider1.value = String(parseInt(inputSlider2.value));
      }
      range1.textContent = inputSlider1.value;
      fillColor();
    }

    function slideTwo() {
      if (parseInt(inputSlider2.value) - parseInt(inputSlider1.value) <= 0) {
        inputSlider2.value = String(parseInt(inputSlider1.value));
      }
      range2.textContent = inputSlider2.value;
      fillColor();
    }

    slideOne();
    slideTwo();
    inputSlider1.addEventListener('change', () => slideOne());
    inputSlider2.addEventListener('change', () => slideTwo());
  }
}

export default RangeSlider;
