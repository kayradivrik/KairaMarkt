import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FlyToCartProvider } from './context/FlyToCartContext';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './index.css';
import { getGSAP } from './utils/gsap';

if (typeof window !== 'undefined') getGSAP();

const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true };

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter future={routerFuture}>
        <ThemeProvider>
          <SettingsProvider>
            <AuthProvider>
              <CartProvider>
                <FlyToCartProvider>
                  <App />
                </FlyToCartProvider>
              </CartProvider>
            </AuthProvider>
          </SettingsProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
