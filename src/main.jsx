// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import LazyLoadPage from './lazy/lazy.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <LazyLoadPage/>
//   </StrictMode>,
// )



import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import LazyLoadPage from './lazy/lazy.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LazyLoadPage />
  </StrictMode>
);
