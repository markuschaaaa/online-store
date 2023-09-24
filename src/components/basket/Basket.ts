import './basket.css'
import ProductPage from '../pages/product/ProductPage';
import MainPage from '../pages/main/MainPage';

class Basket extends ProductPage{
   rows: string;
   constructor(rows: string){
      super('idPage');
      this.rows = rows;
      this.container.classList.add('basket-page');
   }
   async getFetch(dataUrl: string){
    return fetch(dataUrl)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    });
  }
  
   async basketStructure(){
      const dataUrl = 'https://dummyjson.com/products/' + '34';
      let productInfo = await this.getFetch(dataUrl);
      console.log(typeof(productInfo.id))
      const productTitle = productInfo.title;
      const productDescription = productInfo.description;
      const productCategory = productInfo.category;
      const productBrand = productInfo.brand;
      const productDiscount = productInfo.discountPercentage;
      const productImages = productInfo.images;
      const productPrice = productInfo.price;
      const productRating = productInfo.rating;
      const productStock = productInfo.stock;
      const structure = `
         <div class="basket__container">
            <div class="basket__product-wrapper">
                <div class="basket__product-header">
                  <p>Products In Cart</p>
                  <p>ITEMS:</p>
                  <p>Num</p>
                  <p>PAGE:</p>
                  <div class="basket__pagination">
                     <button type="button" class="basket__pagination-left"><</button>
                     <p>Num</p>
                     <button type="button" class="basket__pagination-right">></button>
                  </div>
                </div>
                <div class="basket__product-body">
                  <div class="basket__product-img">
                     <p>Num</p>
                     <img src="${productImages[1]}" alt="альтернативный текст">
                  </div>
                  <div class="basket__product-info">
                     <p>${productTitle}</p>
                     <p>${productDescription}</p>
                     <div class="basket__product-rating">
                        <p>${productRating}</p>
                        <p>${productDiscount}</p>
                     </div>
                  </div>
                  <div class="basket__product-count">
                     <p>Stock: ${productStock}</p>
                     <div class="basket__product-buttons">
                        <button type="button" class="basket_button-plus">+</button>
                        <div class="basket__product-amount"></div>
                        <button type="button" class="basket_button-minus">-</button>
                     </div>
                     <p class="basket__product-price"></p>
                  </div>
                </div>
            </div>
            <div class="basket__info-wrapper">
               <p>Summary</p>
               <p class="basket__info-prod">Products:</p>
               <p class="basket__info-total">Total:</p>
               <form class="basket__form" action="" novalidate>
                  <input type="text" class="basket__info-input" name="promo" placeholder="Enter a promocode"></input>
                  <p>Promo for test: 'RS', 'EPM'</p>
                  <button type="submit" class="info-btn">Submit</button>
               </form>
            </div>
         </div>
      `;
      this.container.innerHTML = structure;
   }
   
   async pagination(){
      await this.basketStructure();
      const ids = JSON.parse(localStorage.id);
      let currentPage = 1;
      const prodPage = document.querySelector('.basket-page') as HTMLElement;
      const header = `
            <div class="basket__product-header">
               <p>Products In Cart</p>
               <p>LIMIT:</p>
               <form class="basket__limit-form" action="" novalidate>
                  <input type="text" class="basket__limit-input" name="limit"></input>
               </form>
               <p>PAGE:</p>
               <div class="basket__pagination">
                  <button type="button" class="basket__pagination-left"><</button>
                  <p class="page-number">1</p>
                  <button type="button" class="basket__pagination-right">></button>
               </div>
            </div>`;
         const info = `
            <div class="basket__info-wrapper">
               <p>Summary</p>
               <p class="basket__info-prod">Products:</p>
               <p class="basket__info-total">Total:</p>
               <form class="basket__form" action="" novalidate>
                  <input type="text" class="basket__info-input" name="promo" placeholder="Enter a promocode"></input>
                  <p>Promo for test: 'RS', 'EPM'</p>
                  <button type="button">Submit</button>
               </form>
            </div>
         `;
      
         const headerInfoWrapper = document.createElement('div');
         const headerContent = document.createElement('div');
         const infoContent = document.createElement('div');
         infoContent.classList.add('form-wrap');
         headerInfoWrapper.classList.add('header_info-wrapper');
         headerContent.innerHTML = header;
         infoContent.innerHTML = info;
         headerInfoWrapper.append(headerContent, infoContent)
         prodPage.append(headerInfoWrapper)

      const displayList = (elem: number[],productsPerPage: string, page: number) => {
         let mainWrapper: HTMLElement;
         if(document.querySelector('.main-wrapper') as HTMLElement){
            mainWrapper = document.querySelector('.main-wrapper') as HTMLElement;
            mainWrapper.innerHTML = '';
         }else{
         mainWrapper = document.createElement('div') as HTMLElement;
         mainWrapper.classList.add('main-wrapper');
         prodPage.append(mainWrapper);
         }
         page--;
         const start = Number(productsPerPage) * page;
         const end = start + Number(productsPerPage);
         const paginatedData = elem.slice(start, end)
         
         paginatedData.forEach(async (el)=>{ 
            const dataUrl = 'https://dummyjson.com/products/' + el;
            let productInfo = await this.getFetch(dataUrl);
            const productTitle = productInfo.title;
            const productDescription = productInfo.description;
            const productCategory = productInfo.category;
            const productBrand = productInfo.brand;
            const productDiscount = productInfo.discountPercentage;
            const productImages = productInfo.images;
            const productPrice = productInfo.price;
            const productRating = productInfo.rating;
            const productStock = productInfo.stock;
            let object = JSON.parse(localStorage.basketId)

            const struc = `
               <div class="basket__product-wrapper">                  
                  <div class="basket__product-body">
                     <div class="basket__product-img">
                        <img src="${productImages[1]}" alt="альтернативный текст">
                     </div>
                     <div class="basket__product-info">
                        <p class="bag-title">${productTitle}</p>
                        <p class="bag-description">${productDescription}</p>
                        <div class="basket__product-rating">
                           <p class="bag-rating">${productRating}</p>
                           <p class="bag-discount">${productDiscount}</p>
                        </div>
                     </div>  
                     <div class="basket__product-count">
                     <p class="bag-title">Stock: ${productStock}</p>
                     <div class="basket__product-buttons" id="basket-${el}">
                        <button type="button" class="basket_button-plus">+</button>
                        <div class="basket__product-amount">${object[el]}</div>
                        <button type="button" class="basket_button-minus">-</button>
                     </div>
                        <p class="basket__product-price"></p>
                     </div>              
                  </div>
               </div>
            `
            const newCont = document.createElement('div')
            newCont.classList.add('basket__pag')
            mainWrapper.append(newCont)
            newCont.innerHTML = struc 
         })
      }
      const displayPagination  = () => {
         let count: number = 1;
         const header = document.querySelector('.header_info-wrapper') as HTMLElement;
         const basketPaginationLeft = header.querySelector('.basket__pagination-left') as HTMLElement;
         const basketPaginationRight = header.querySelector('.basket__pagination-right') as HTMLElement;
         let pageNumber = header.querySelector('.page-number') as HTMLElement;
         basketPaginationRight.addEventListener('click', () => {
            count++
            currentPage = currentPage + 1;
            pageNumber.innerHTML = count.toString()
            displayList(ids,this.rows,currentPage)
         })
         basketPaginationLeft.addEventListener('click', () => {
            let pageNumber = header.querySelector('.page-number') as HTMLElement;
            if(count <= 1){
               return count = 1;
            }
            count--
            currentPage = currentPage - 1;
            pageNumber.innerHTML = count.toString()
            displayList(ids,this.rows,currentPage)
            console.log(this.rows);
         })
         
      }
      displayList(ids,this.rows = '3',currentPage)
      displayPagination()
      
      return this.rows
   }

   async getBasketInfo(){
      await this.pagination();
      const header = document.querySelector('.header_info-wrapper') as HTMLElement;
      const mainWrapper = document.querySelector('.main-wrapper') as HTMLElement;
      const basketInfoProd = header.querySelector('.basket__info-prod') as HTMLElement;
      const basketInfoTotal = header.querySelector('.basket__info-total') as HTMLElement;
      basketInfoProd.innerHTML = 'Products:' + JSON.parse(localStorage.count);
      basketInfoTotal.innerHTML = ('Total:' + JSON.parse(localStorage.price));
      mainWrapper.addEventListener('click', async (e) => {
      const target = e.target as HTMLInputElement;
      const id =+ (target.parentElement as HTMLElement).id.split('-')[1];
      const dataUrl = 'https://dummyjson.com/products/' + id;
      let productInfo = await this.getFetch(dataUrl);
      const productPrice = productInfo.price;
      const basketInfoProd = header.querySelector('.basket__info-prod') as HTMLElement;
      const basketInfoTotal = header.querySelector('.basket__info-total') as HTMLElement;

      if (target.classList.contains('basket_button-plus')
      || target.classList.contains('basket_button-minus')) {
        const basketProductPrice = (target.parentElement as HTMLElement).nextElementSibling as HTMLElement;
        const pag = (((((target.parentElement as HTMLElement)
        .parentElement as HTMLElement)
        .parentElement as HTMLElement)
        .parentElement as HTMLElement)
        .parentElement as HTMLElement)
        let count = JSON.parse(localStorage.count);
        let price = JSON.parse(localStorage.price);
        let basketId = JSON.parse(localStorage.basketId);
        let arrayId = JSON.parse(localStorage.id);
        if (target.classList.contains('basket_button-plus')) {
          const productAmount = target.nextElementSibling as HTMLElement;
          count += 1;
          price += productPrice;
          basketId[id] += 1;

          localStorage.count = JSON.stringify(count);
          localStorage.price = JSON.stringify(price);
          localStorage.basketId = JSON.stringify(basketId);

          productAmount.innerHTML = basketId[id].toString();
          basketProductPrice.innerHTML = (basketId[id] * productPrice + '$').toString();
          basketInfoProd.innerHTML = 'Products:' + count.toString();
          basketInfoTotal.innerHTML = ('Total:' + price+ '$').toString();

         const basketItemCount = document.querySelector('.basket-item-count') as HTMLElement;
         basketItemCount.innerHTML = count;
         const basketItemPrice = document.querySelector('.basket-item-price') as HTMLElement;
         basketItemPrice.innerHTML = price;
        } else if (target.classList.contains('basket_button-minus')) {
         const productAmount = target.previousElementSibling as HTMLElement;
          count -= 1;
          price -= productPrice;
          basketId[id] -= 1;

          localStorage.count = JSON.stringify(count);
          localStorage.price = JSON.stringify(price);
          
         productAmount.innerHTML = basketId[id].toString();
         basketProductPrice.innerHTML = (basketId[id] * productPrice + '$').toString();
         basketInfoProd.innerHTML = 'Products:' + count.toString();
         basketInfoTotal.innerHTML = ('Total:' + price + '$').toString();
         
         const basketItemCount = document.querySelector('.basket-item-count') as HTMLElement;
         basketItemCount.innerHTML = count;
         const basketItemPrice = document.querySelector('.basket-item-price') as HTMLElement;
         basketItemPrice.innerHTML = price;
         
         if (Number(productAmount.textContent) <= 0) {
            const indexToDelete = arrayId.indexOf(id);
            arrayId.splice(indexToDelete, 1);
            localStorage.id = JSON.stringify(arrayId);
            delete basketId[id]
            pag.remove()
          }
          localStorage.basketId = JSON.stringify(basketId);
        }
      }
    });
   }
   async promoValidation(){
      await this.getBasketInfo()
      const formWrap = document.querySelector('.form-wrap') as HTMLElement;
      const mainForm = formWrap.querySelector('.basket__form') as HTMLElement;
      const formInput = formWrap.querySelector('.basket__info-input') as HTMLInputElement;
      const dataUrl = 'https://dummyjson.com/products/' + '34';
      let productInfo = await this.getFetch(dataUrl);

      mainForm.onsubmit =(e)=> {
         let promoVal: string = formInput.value
         const isValidPromo = (promo: string) => {
            let res = /rs|epm/gi;
            return res.test(String(promo).toLowerCase());
         }
         if(!isValidPromo(promoVal)){
            console.log('Please enter a valid promo');
            return false;
         }else{
            console.log('secc')
            const productPrice = productInfo.price;
            const oldValue = formWrap.querySelector('.basket__info-total') as HTMLElement;
            const oldPrice = document.querySelector('.basket__product-price') as HTMLElement;
            const bpag = document.querySelector('.basket__pag') as HTMLElement;
            const amount = bpag.querySelector('.basket__product-amount') as HTMLElement;
            const amountNum = Number(amount.textContent)
            console.log(bpag)
            oldValue.innerHTML = ('Total:' + (productPrice*amountNum)*0.9 + '$').toString();
            oldPrice.innerHTML = ((productPrice*amountNum)*0.9 + '$').toString();
            console.log(amount)
         }
         e.preventDefault();
      }
   }

   async formValidation(){
      await this.promoValidation();
      const headers = document.querySelector('.header_info-wrapper') as HTMLElement;
      const headerLimitForm = document.querySelector('.basket__limit-form') as HTMLElement;
      const headerLimitInput = headers.querySelector('.basket__limit-input') as HTMLInputElement;

      headerLimitForm.onsubmit = (e) => {
         let limitVal : string = headerLimitInput.value;
         const isValidLimit = (limit: string) => {
            let res = /^[0-9]$/;
            return res.test(String(limit).toLowerCase());
         }
         if(!isValidLimit(limitVal)){
            console.log('Please enter a valid limit');
            console.log(this.rows);
            return false;
         }else{
            this.rows = limitVal
            console.log(this.rows);
         }
         e.preventDefault();
      }
   }
   
 render() {
   this.basketStructure(); 
   this.pagination();; 
   this.getBasketInfo();
   this.formValidation()
   this.promoValidation()
    return this.container;
  }
}
export default Basket;

function replace(arg0: RegExp, arg1: string): any {
   throw new Error('Function not implemented.');
}
