import Page from '../../common/Page';
import { ErrorTypes } from '../../types/types';

class ErrorPage extends Page {
  private errorType: ErrorTypes | string;

  static TextObject: { [prop: string]: string } = {
    '404': 'Error, the page was not found.',
  };

  constructor(id: string, errorType: ErrorTypes | string) {
    super(id);
    this.errorType = errorType;
  }

  render() {
    this.container.innerHTML = `<h2 class='text-danger'>SORRY</h2>
          <h3>Product Not Found !</h3>`;
    this.container.classList.add('error-page')
    return this.container;
  }
}

export default ErrorPage;
