import 'core-js/es/map';
import 'core-js/es/set';
import 'core-js/es/string';
import 'core-js/es/object';
import 'core-js/es/promise';
import ReactDOM from 'react-dom';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { Alert } from 'react-bootstrap'
import App from "./bootstrap/components/App"
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux';
import configureStore from './bootstrap/store';
import moment from 'moment'
import 'moment/locale/es'
import 'react-loading-skeleton/dist/skeleton.css'
import './bootstrap/components/custom.scss';
import './index.css';

moment.locale('es')

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 0, staleTime: 30000 },
    mutations: { retry: 0 }
  }
})

const ErrorFallback = ({error, resetErrorBoundary}: FallbackProps) => {
  return (
    <Alert variant="danger">
      <p>Algo salió mal:</p>
      <pre>{error.message}</pre>
      {/* <Button onClick={resetErrorBoundary}>Intentar de nuevo</Button> */}
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
    <Router>
      <QueryClientProvider client={queryClient}>
        <Provider store={configureStore()}>
          <App />
        </Provider>
      </QueryClientProvider>
    </Router>
  </ErrorBoundary>,
  document.getElementById('root')
);

// if (process.env.NODE_ENV === 'development') {
//   // import('./__mocks__/browser').then(({worker}) => {
//   //   worker.start()
//   // })
//   const { worker } = require('./__mocks__/browser')
//   worker.start()
// }

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
