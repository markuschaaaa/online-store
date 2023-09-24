import { IOptions, ProductType, RespType, StatusCode } from '../../../../types/types';

class ProductsLoader {
  baseLink: string;
  options: IOptions;
  public state: Array<ProductType>;

  constructor(baseLink: string, options: IOptions) {
    this.baseLink = baseLink;
    this.options = options;
    this.state = [];
  }

  getResp(
    { endpoint, options = {} }: RespType,
    callback = () => {
      console.error('No callback for GET response');
    }
  ) {
    this.load('GET', endpoint, callback, options);
  }

  errorHandler(res: Response) {
    if (!res.ok) {
      if (res.status === StatusCode.Unauthorized || res.status === StatusCode.NotFound)
        console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
      throw Error(res.statusText);
    }

    return res;
  }

  makeUrl(options: IOptions, endpoint: string) {
    const urlOptions: { [index: string]: string } = { ...this.options, ...options };
    let url = `${this.baseLink}${endpoint}`;
    Object.keys(urlOptions).forEach((key) => {
      url += `?${key}=${urlOptions[key]}&`;
    });

    return url.slice(0, -1);
  }

  load(method: string, endpoint: string, callback: <T>(data: T) => void, options = {}): void {
    fetch(this.makeUrl(options, endpoint), { method })
      .then(this.errorHandler)
      .then((res): Promise<any> => res.json())
      .then((data) => {
        if (this.state.length === 0) {
          this.state = [...data.products];
        }
        callback(this.state);
      })
      .catch((err: Error) => console.error(err));
  }
}

export default ProductsLoader;
