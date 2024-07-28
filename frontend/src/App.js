import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css';
import Home from './pages/Home';
import { useAuthContext } from './hooks/useAuthContext';
import Login from './pages/Login'
import Signup from './pages/Signup'
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
                user ? <Home /> : <Navigate to="/login" />
              }
            />
            <Route 
              path="/login"
              element={!user ? <Login />: <Navigate to="/" />}
            />
            <Route 
              path="/signup"
              element={!user ? <Signup /> : <Navigate to="/" />}
            />
            <Route 
              path="/profile"
              element={
                user ? <Profile /> : <Navigate to="/login" />
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
