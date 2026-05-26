import { StrictMode } from 'react'
import './index.css'
import GlottieApp from './app/GlottieApp.jsx'
import { Provider } from 'react-redux';
import { store } from './app/store';
import React from 'react';
import ReactDOM from 'react-dom/client';
//import { useSelector } from 'react-redux';
import AuthPage   from './auth/AuthPage.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Root() {
  return <GlottieApp />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <BrowserRouter>
      <Root />
      <ToastContainer 
          position="bottom-right" 
          autoClose={3000} 
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={true} 
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);