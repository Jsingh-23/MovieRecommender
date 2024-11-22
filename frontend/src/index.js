import React from 'react';
import ReactDOM from 'react-dom/client';
// import { ErrorBoundary } from 'react-error-boundary';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';


const ErrorFallback = () => (
  <div role="alert">
    <h2>Oops! Something went wrong</h2>
    <button onClick={() => window.location.reload()}>Refresh Page</button>
  </div>
);

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      {/* <ErrorBoundary FallbackComponent={ErrorFallback}> */}
        <App />
      {/* </ErrorBoundary> */}
    </React.StrictMode>
  );
} else {
  console.error("Failed to find root element");
}