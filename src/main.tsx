import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/site.css';
import './styles/squircle.css';
import './styles/header.css';
import { HomePage } from './pages/HomePage/HomePage';
import { homePageContent } from './pages/HomePage/homePageContent';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HomePage {...homePageContent} />
  </StrictMode>,
);
