import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { Alert, Button } from 'react-bootstrap'
import Routes from "./bootstrap/components/App"
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import configureStore from './bootstrap/store';
import './polyfills/String.ts'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';


// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: (count, error) => {
//         if((error as any).response){
//           return false
//         }
//         return count < 3        
//       }
//     },
//     mutations: {
//       retry: (count, error) => {
//         if((error as any).response){
//           return false
//         }
//         return count < 3     
//       }
//     }
//   }
// })
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
