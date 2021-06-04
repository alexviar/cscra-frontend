import 'core-js/es/map';
import 'core-js/es/set';
import 'core-js/es/string';
import 'core-js/es/object';
import 'core-js/es/promise';
import ReactDOM from 'react-dom';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { Alert, Button } from 'react-bootstrap'
import Routes from "./bootstrap/components/App"
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import configureStore from './bootstrap/store';
// import './polyfills/String.ts'
import './bootstrap/components/custom.scss';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 0 },
    mutations: { retry: 0 }
  }
})

const ErrorFallback = ({error, resetErrorBoundary}: FallbackProps) => {
  return (
    <Alert>
      <p>Algo salió mal:</p>
      <pre>{error.message}</pre>
      <Button onClick={resetErrorBoundary}>Intentar de nuevo</Button>
    </Alert>
  )
}

ReactDOM.render(
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onReset={()=>{
        window.location.reload()
    }}
  >
    <QueryClientProvider client={queryClient}>
      <Provider store={configureStore()}>
        <Routes />
      </Provider>
    </QueryClientProvider>
  </ErrorBoundary>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
