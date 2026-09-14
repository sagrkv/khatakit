import { startClient } from './entry-client';
import './index.css';

startClient(document.getElementById('root')!).catch((error: unknown) => {
  console.error('Khatakit could not start the calculators', error);
});
