import Header from '../header/Header';
import Footer from '../Footer/Footer';
import Page from '../common/Page';
import { ErrorTypes, PageIds } from '../types/types';
import MainPage from '../pages/main/MainPage';
import ProductPage from '../pages/product/ProductPage';
import BasketPage from '../../components/basket/Basket';
import ErrorPage from '../pages/error/ErrorPage';
import Payment from '../payment/Payment';

class App {
  private static container: HTMLElement = document.body;
  private static defaultPageId = 'current-page';
  private header: Header;
  private footer: Footer;
  private payment: Payment;

  constructor() {
    this.header = new Header('header', 'header-container');
    this.footer = new Footer('footer', 'footer-container');
    this.payment = new Payment('payment');
  }

  static renderNewPage(idPage: string) {
    const currentPageHTML = document.querySelector(`#${App.defaultPageId}`);
    if (currentPageHTML) {
      currentPageHTML.remove();
    }
    let page: Page | null = null;

    if (idPage === PageIds.MainPage) {
      page = new MainPage(idPage);
    } else if (
      idPage.split('/')[0] === PageIds.ProductPage &&
      +idPage.split('/')[1] < 101 &&
      +idPage.split('/')[1] > 0
    ) {
      page = new ProductPage(idPage);
    } else if (idPage === PageIds.BasketPage) {
      page = new BasketPage(idPage);
    } else {
      page = new ErrorPage(idPage, ErrorTypes.Error_404);
    }

    if (page) {
      const pageHTML = page.render();
      pageHTML.id = App.defaultPageId;
      const header = document.querySelector('header');
      header ? header.after(pageHTML) : App.container.append(pageHTML);
    }
  }

  private enableRouteChange() {
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      App.renderNewPage(hash);
    });
  }
  start(hash: string) {
    if (localStorage.getItem('id') === null) {
      localStorage.setItem('basketId', JSON.stringify({}));
      localStorage.setItem('id', JSON.stringify([]));
      localStorage.setItem('count', JSON.stringify(0));
      localStorage.setItem('price', JSON.stringify(0));
    }
    App.container.append(this.header.render());
    App.renderNewPage(hash);
    this.enableRouteChange();
    const footer = this.footer.render();
    App.container.append(footer);
    footer.append(this.payment.render());
  }
}

export default App;
