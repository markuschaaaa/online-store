import './Cards.scss'
import Products from './Products';
import { ProductType } from '../../../../types/types';
import CardsHeader from '../cardsHeader/cardsHeader';

class Cards {
  private products: Products;
  public cardsHeader: CardsHeader;

  constructor() {
    this.products = new Products();
    this.cardsHeader = new CardsHeader()
  }

  drawProducts(data: Array<ProductType>, viewMode: string) {
    if (data) {
      this.products.draw(data, viewMode);
    }
  }
}

export default Cards;
