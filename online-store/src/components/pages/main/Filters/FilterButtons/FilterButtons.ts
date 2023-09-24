import CreateHtml from '../CreateHtml';

class FilterButtons extends CreateHtml{
  private routerParams: Record<string, string>;
  public btnCopyLink: HTMLElement;
  public btnResetFilter: HTMLElement;

  constructor(routerParams: Record<string, string>) {
    super();
    this.routerParams = routerParams;
    this.btnCopyLink = this.createElement('button', 'copy__btn');
    this.btnResetFilter = this.createElement('button', 'copy__btn');
  }
  render() {
    const fragment = document.createDocumentFragment();
    this.btnCopyLink.setAttribute('type', 'button');
    this.btnCopyLink.textContent = 'Copy Link'
    this.btnResetFilter.setAttribute('type', 'reset');
    this.btnResetFilter.textContent = 'Reset Filters'
    fragment.append(this.btnResetFilter, this.btnCopyLink);
    return fragment;
  }
}
export default FilterButtons
