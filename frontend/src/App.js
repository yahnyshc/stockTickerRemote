import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css';
import Home from './pages/Home';
import { useAuthContext } from './hooks/useAuthContext';
import Landing from './pages/Landing';
import Auth from './components/Auth';
import Appbar from './components/AppBar.js';
import Profile from './pages/Profile.js';

function App() {
  const { user } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>        
        <div className="pages">
          <Appbar />
          <Routes>
            <Route 
              path="/"
              element={
                user ? <Home /> : <Landing />
              }
            />
            <Route 
              path="/profile"
              element={
                user ? <Profile /> : <Landing />
              }
            />
            <Route 
              path="/login"
              element={
                user ? <Navigate to="/" /> : <Auth />
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;