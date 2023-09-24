import './payment.css';
import ProductPage from '../pages/product/ProductPage';

class Payment extends ProductPage {
  constructor(id: string) {
    super(id);
    this.container = document.createElement('div');
    this.container.classList.add(id);
    this.container.id = id;
  }

  async payment() {
    const popUp = `
      <div class = 'popup__pay'>
        <div class = 'pay__popup__body'>
          <div class = 'pay__popup__content'>
              <h3>Personal details</h3>
              <form class='pay__form' action='' novalidate >
                  <input type='text' class='input pay__input pay__input-name' name='name' placeholder='Name'>
                  <p class='name-warning'></p>
                  <input type='tel' class='input pay__input pay__input-phone' name='phone' placeholder='Phone number'>
                  <p class='number-warning'></p>
                  <input type='text' class='input pay__input pay__input-adress' name='address' placeholder='Address'>
                  <p class='adress-warning'></p>
                  <input type='email' class='input pay__input pay__input-email' name='email' placeholder='Email'>
                  <p class='email-warning'></p>
                  <h3>Credict card details</h3>
                  <input type='text' class='input pay__input pay__input-card' name='card' placeholder='Card'>
                  <p class='card-warning'></p>
                  <p class='card-name'></p>
                  <input type='text' class='input pay__input pay__input-valid' name='valid' placeholder='Valid thru'>
                  <p class='valid-warning'></p>
                  <input type='text' class='input pay__input pay__input-cvv' name='cvv' placeholder='cvv'>
                  <p class='cvv-warning'></p>
                  <button type='submit' class='btn'>Submit</button>
            </form>
              <a href = '#' class = 'pay__popup__close'>X</a>
          </div>
        </div>
      </div>
    `;
    this.container.innerHTML = popUp;
  }

  async setEvents() {
    const payPopupBody = this.container.querySelector('.pay__popup__body') as HTMLElement;
    const closeButton = this.container.querySelector('.pay__popup__close') as HTMLElement;
    const form = this.container.querySelector('.pay__form') as HTMLElement,
      formInputs = this.container.querySelectorAll('.pay__input'),
      inputEmail = this.container.querySelector('.pay__input-email') as HTMLFormElement,
      inputName = this.container.querySelector('.pay__input-name') as HTMLFormElement,
      inputAdress = this.container.querySelector('.pay__input-adress') as HTMLFormElement,
      inputPhone = this.container.querySelector('.pay__input-phone') as HTMLFormElement,
      inputValid = this.container.querySelector('.pay__input-valid') as HTMLFormElement,
      inputCvv = this.container.querySelector('.pay__input-cvv') as HTMLFormElement,
      inputCard = this.container.querySelector('.pay__input-card') as HTMLFormElement;

    const cardBrands = [4, 5, 6];
    const cardName = this.container.querySelector('.card-name') as HTMLElement;

    inputCard.oninput = () => {
      let val = inputCard.value.trim();
      const master = String(cardBrands[0]);
      const visa = String(cardBrands[1]);
      const bel = String(cardBrands[2]);
      const newVal = val.slice(0, 1);
      if (newVal == master) {
        cardName.innerHTML = 'MASTERCARD';
      } else if (newVal == visa) {
        cardName.innerHTML = 'VISA';
      } else if (newVal == bel) {
        cardName.innerHTML = 'BELKART';
      } else {
        cardName.innerHTML = '';
      }
    };

    form.onsubmit = () => {
      let emailVal: string = inputEmail.value,
        phoneVal: string = inputPhone.value,
        adressVal: string = inputAdress.value,
        nameVal: string = inputName.value,
        cardVal: string = inputCard.value,
        validVal: string = inputValid.value,
        cvvVal: string = inputCvv.value,
        emptyInputs = Array.from(formInputs).filter(input => (input as HTMLTextAreaElement).value === '');

      const isValidName = (name: string) => {
        let result = /^[A-Za-zА-Яа-яЁё]{3,100}(\s+[A-Za-zА-Яа-яЁё]{3,100})$/;
        return result.test(String(name).toLowerCase());
      };

      const isValidPhone = (phone: string) => {
        let result = /^(\+)[0-9]{9,14}$/;
        return result.test(String(phone).toLowerCase());
      };

      const isValidAdress = (adress: string) => {
        let result = /^[A-Za-zА-Яа-яЁё]{5,100}(\s+[A-Za-zА-Яа-яЁё]{5,100})(\s+[A-Za-zА-Яа-яЁё]{5,100})$/;
        return result.test(String(adress).toLowerCase());
      };

      const isValidEmail = (email: string) => {
        let result = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return result.test(String(email).toLowerCase());
      };

      const isValidCard = (card: string) => {
        let result = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
        return result.test(String(card).toLowerCase());
      };

      const isValidValid = (valid: string) => {
        let result = /^(0[1-9]|1[0-2])\/\d{2}$/;
        return result.test(String(valid).toLowerCase());
      };

      const isValidCvv = (cvv: string) => {
        let result = /^[0-9]{3}$/;
        return result.test(String(cvv).toLowerCase());
      };

      formInputs.forEach(input => {
        if ((input as HTMLTextAreaElement).value === '') {
          input.classList.add('error');
        } else {
          input.classList.remove('error');
        }
      });

      if (emptyInputs.length !== 0) {
        return false;
      }

      if (!isValidName(nameVal)) {
        const payInputName = document.querySelector('.name-warning') as HTMLElement;
        payInputName.innerHTML = 'Please enter a valid name';
        inputName.classList.add('error');
        return false;
      } else {
        inputName.classList.remove('error');
        const payInputName = document.querySelector('.name-warning') as HTMLElement;
        payInputName.classList.add('active');
      }

      if (!isValidPhone(phoneVal)) {
        const payInputNumber = document.querySelector('.number-warning') as HTMLElement;
        payInputNumber.innerHTML = 'Please enter a valid phone number';
        inputPhone.classList.add('error');
        return false;
      } else {
        inputPhone.classList.remove('error');
        const payInputNumber = document.querySelector('.number-warning') as HTMLElement;
        payInputNumber.classList.add('active');
      }

      if (!isValidAdress(adressVal)) {
        const payInputAdress = document.querySelector('.adress-warning') as HTMLElement;
        payInputAdress.innerHTML = 'Please enter a valid adress';
        inputAdress.classList.add('error');
        return false;
      } else {
        inputAdress.classList.remove('error');
        const payInputAdress = document.querySelector('.adress-warning') as HTMLElement;
        payInputAdress.classList.add('active');
      }

      if (!isValidEmail(emailVal)) {
        const payInputEmail = document.querySelector('.email-warning') as HTMLElement;
        payInputEmail.innerHTML = 'Please enter a valid email';
        inputEmail.classList.add('error');
        return false;
      } else {
        inputEmail.classList.remove('error');
        const payInputEmail = document.querySelector('.email-warning') as HTMLElement;
        payInputEmail.classList.add('active');
      }

      if (!isValidCard(cardVal)) {
        const payInputCard = document.querySelector('.card-warning') as HTMLElement;
        payInputCard.innerHTML = 'Please enter a valid card';
        inputCard.classList.add('error');
        return false;
      } else {
        inputCard.classList.remove('error');
        const payInputCard = document.querySelector('.card-warning') as HTMLElement;
        payInputCard.classList.add('active');
      }

      if (!isValidValid(validVal)) {
        const payInputValid = document.querySelector('.valid-warning') as HTMLElement;
        payInputValid.innerHTML = 'Please enter a valid date';
        inputValid.classList.add('error');
        return false;
      } else {
        inputValid.classList.remove('error');
        const payInputValid = document.querySelector('.valid-warning') as HTMLElement;
        payInputValid.classList.add('active');
      }

      if (!isValidCvv(cvvVal)) {
        const payInputCvv = document.querySelector('.cvv-warning') as HTMLElement;
        payInputCvv.innerHTML = 'Please enter a valid cvv';
        inputCvv.classList.add('error');
        return false;
      } else {
        inputCvv.classList.remove('error');
        const payInputCvv = document.querySelector('.cvv-warning') as HTMLElement;
        payInputCvv.classList.add('active');
      }
      alert('Ваш заказ был успешно оплачен! Нажмите для завершения заказа.');
      window.location.href = 'http://localhost:5333/#main-page';
    };
    closeButton.addEventListener('click', (e) => {
      const popUpPay = document.querySelector('.popup__pay') as HTMLElement;
      ;
      popUpPay.classList.remove('open');
      e.preventDefault();
    });
  }
  render() {
    this.payment();
    this.setEvents();
    return this.container;
  }
}

export default Payment;
