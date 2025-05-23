import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from "react-router-dom";
import Layout from './Layout';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import '../node_modules/nprogress/nprogress.css';
import { PersistGate } from 'redux-persist/integration/react';
import "react-awesome-lightbox/build/style.css";
import i18n from './utils/i18n';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
