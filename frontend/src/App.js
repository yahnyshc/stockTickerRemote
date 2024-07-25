import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css';
import Home from './pages/Home';
import { ConfigContextProvider } from './context/ConfigContext';


function App() {
  return (
    <div className="App">
      <BrowserRouter>        
        <div className="pages">
          <Routes>
            <Route 
              path="/"
              element={<ConfigContextProvider><Home /></ConfigContextProvider>}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
