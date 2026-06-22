import '@/styles/globals.css';
import AppRouter from '@/router/index';
import Preloader from '@/components/Preloader';
import SmoothScroll from '@/components/ui/smooth-scroll';
import React, { useState } from 'react';

export default function App() {
  const [preloaded, setPreloaded] = useState(() => {
    return sessionStorage.getItem('visited') === 'true';
  });

  return (
    <>
      {!preloaded && (
        <Preloader onDone={() => setPreloaded(true)} />
      )}
      <div 
        style={{ 
          opacity: preloaded ? 1 : 0, 
          transition: 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
          visibility: preloaded ? 'visible' : 'hidden'
        }}
      >
        <SmoothScroll>
          <AppRouter />
        </SmoothScroll>
      </div>
    </>
  );
}
