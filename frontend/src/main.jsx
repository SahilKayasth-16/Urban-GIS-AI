import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import 'maplibre-gl/dist/maplibre-gl.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { ChatProvider } from './context/ChatContext.jsx';
import { LocationProvider } from './context/LocationContext.jsx';
import { HashRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <LocationProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </LocationProvider>
      </AuthProvider>
    </HashRouter>
  </StrictMode>
);
