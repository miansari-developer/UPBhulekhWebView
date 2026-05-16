import { BrowserRouter } from 'react-router-dom';
import { BhulekhProvider } from './hooks/useBhulekh';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <BhulekhProvider>
      <BrowserRouter basename="/UPBhulekhWebView">
        <AppRoutes />
      </BrowserRouter>
    </BhulekhProvider>
  );
}

export default App;
