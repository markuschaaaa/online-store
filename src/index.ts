import './index.scss';
import App from './components/app/App';

let hash = window.location.hash.replace('#', '');
if (hash === '') {
  hash = 'main-page';
}

const app = new App();
app.start(hash);

export async function copyTextToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Text copied to clipboard');
  } catch (err) {
    console.error('Error in copying text: ', err);
  }
}
