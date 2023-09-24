import './Product.scss';
import { ProductType } from '../../../../types/types';
import CreateHtml from '../../Filters/CreateHtml';
import Basket from '../../../../basket/Basket';

class Products extends CreateHtml {
  constructor() {
    super();
  }

  draw(data: Array<ProductType>, viewMode: string) {
    const productItems = document.querySelector('.product-items') as HTMLElement;
    if (productItems.classList.contains('items-list')) {
      productItems.classList.remove('items-list');
    } else if (productItems.classList.contains('items-cards')) {
      productItems.classList.remove('items-cards');
    }
    productItems.classList.add(`items-${viewMode}`);
    productItems.innerHTML = '';

    data.forEach((item, index: number) => {
      const productCard = this.createElement('div', `product-${viewMode}`);
      productCard.setAttribute('key', item.id.toString());
      const productTitle = this.createElement('h3', 'product-title');
      productTitle.innerText = item.title;
      const productImg = this.createElement('img', 'card__img') as HTMLImageElement;
      productImg.setAttribute('width', '150px');
      productImg.setAttribute('height', '150px');
      productImg.src = item.images[0];
      const productCategory = this.createElement('h4', 'product-description');
      productCategory.innerHTML = `Category: <span>${item.category}</span>`;
      const productBrand = this.createElement('h4', 'product-description');
      productBrand.innerHTML = `Brand: <span>${item.brand}</span>`;
      const productInStock = this.createElement('h4', 'product-description');
      productInStock.innerHTML = `Stock: <span>${item.stock.toString()}</span>`;
      const productDiscont = this.createElement('h4', 'product-description');
      productDiscont.innerHTML = `Discount: <span>${item.discountPercentage.toString()}</span>`;
      const productPrice = this.createElement('h4', 'product-description');
      productPrice.innerHTML = `Price: <span>${item.price.toString()}$</span>`;
      const productButtonsWrapper = this.createElement('div', 'btn-wrapper');
      const productAddBtn = this.createElement('button', 'add__btn');
      const add = 'ADD';
      const remove = 'REMOVE';
      const arrBasketId: Array<number> = JSON.parse(localStorage.id);
      productAddBtn.textContent = arrBasketId.some((t) => t === item.id) ? remove : add;
      productAddBtn.addEventListener('click', (e) => {
        let basketCount: number = JSON.parse(localStorage.count);
        let basketPrice: number = JSON.parse(localStorage.price);
        const arrBasketId: Array<number> = JSON.parse(localStorage.id);
        const target = e.target as HTMLInputElement;
        let object = JSON.parse(localStorage.basketId)
        if (target.textContent === add) {
          // object[item.id] = 1
          arrBasketId.push(item.id);
          basketCount += 1;
          basketPrice += item.price;
          localStorage.basketId = JSON.stringify({...object, [item.id]: 1});
          localStorage.id = JSON.stringify(arrBasketId);
          localStorage.count = JSON.stringify(basketCount);
          localStorage.price = JSON.stringify(basketPrice);
          target.textContent = remove;
        } else {
          delete object[item.id];
          const indexToDelete = arrBasketId.indexOf(item.id);
          arrBasketId.splice(indexToDelete, 1);
          basketCount -= 1;
          basketPrice -= item.price;
          localStorage.basketId = JSON.stringify(object);
          localStorage.id = JSON.stringify(arrBasketId);
          localStorage.count = JSON.stringify(basketCount);
          localStorage.price = JSON.stringify(basketPrice);
          target.textContent = add;
        }
        basketCount = JSON.parse(localStorage.count);
        basketPrice = JSON.parse(localStorage.price);
        const headerItemCount = document.querySelector('.basket-item-count') as HTMLSpanElement;
        const headerItemPrice = document.querySelector('.basket-item-price') as HTMLSpanElement;
        headerItemCount.textContent = basketCount.toString();
        headerItemPrice.textContent = basketPrice.toString();
      });
      productAddBtn.setAttribute('type', 'button');
      const productDetailsLink = this.createElement('a', 'details__link') as HTMLLinkElement;
      productDetailsLink.href = `#product-page/${item.id}`;
      const productDetails = this.createElement('button', 'details__btn');
      productDetails.textContent = 'Details';
      productDetails.setAttribute('type', 'button');
      productButtonsWrapper.append(productAddBtn, productDetailsLink);
      productDetailsLink.append(productDetails);
      if (viewMode === 'cards') {
        productCard.append(
          productTitle,
          productImg,
          productCategory,
          productBrand,
          productInStock,
          productDiscont,
          productPrice,
          productButtonsWrapper
        );
      } else if (viewMode === 'list') {
        const listImgWrapper = this.createElement('div', 'list-wrapper__img');
        const listInfoWrapper = this.createElement('h4', 'list-info');
        const productDescription = this.createElement('p', 'product-description');
        const productRating = this.createElement('h4', 'product-description');
        productRating.innerHTML = `Rating: <span>${item.rating.toString()}</span>`;
        productBrand.innerText = `Description: ${item.description}`;
        productCard.append(listImgWrapper, listInfoWrapper, productButtonsWrapper);
        listImgWrapper.append(productImg);
        listInfoWrapper.append(productTitle, productDescription, productBrand, productPrice, productRating);
      }
      productItems.append(productCard);
    });
  }
}

export default Products;
