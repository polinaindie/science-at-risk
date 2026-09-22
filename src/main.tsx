import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/normalize.css';
import './styles/site.css';
import './styles/squircle.css';
import { App } from './app/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
