import './footer.scss';
import Component from '../common/Component';

class Footer extends Component {
  constructor(tagName: string, className: string) {
    super(tagName, className);
  }

  renderGit() {
    const gitWrapper = document.createElement('div');
    gitWrapper.classList.add('git-wrapper');
    const yearSpan = document.createElement('span');
    yearSpan.innerText = '2022';
    const gitLink = document.createElement('a');
    gitLink.classList.add('git__link');
    gitLink.href = 'https://github.com/DrobyshSV';
    const gitLogo = document.createElement('div');
    gitLogo.classList.add('git-logo');
    gitWrapper.append(yearSpan, gitLink);
    gitLink.append(gitLogo);
    this.container.append(gitWrapper);
  }

  renderRss() {
    const rssLink = document.createElement('a');
    rssLink.classList.add('rss');
    rssLink.href = 'https://rs.school/js/';
    const rssLogo = document.createElement('div');
    rssLogo.classList.add('rss-logo');
    rssLink.append(rssLogo);
    this.container.append(rssLink);
  }

  render() {
    this.renderGit();
    this.renderRss();
    return this.container;
  }
}

export default Footer;
