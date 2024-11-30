import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AppRoutes } from './routes/AppRoute';


function App() {
  
  return (
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
}

export default App;