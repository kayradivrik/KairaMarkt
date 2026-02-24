/* KairaMarkt - Kayra tarafından yapılmıştır */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { FlyToCartProvider } from './context/FlyToCartContext';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import App from './App.jsx';
import './index.css';
import { getGSAP } from './utils/gsap';

if (typeof window !== 'undefined') getGSAP();

createRoot(document.getElementById('root')).render(
  <StrictMode>
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
  </StrictMode>
);
