import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/ui/NavBar';
import Footer from './components/ui/Footer';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import SignupPage from './pages/auth/Signup';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';
import ProfilePage from './pages/protected/Profile';
import WatchlistPage from './pages/protected/Watchlist';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Main container with min-height of screen and flex column */}
        <div className="min-h-screen bg-[#14181c] flex flex-col">
          <NavBar />
          
          {/* Main content area that can grow to push footer down */}
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>

            <Routes>
              {/* Protected Routes */}
              <Route 
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/watchlist"
                element={
                  <ProtectedRoute>
                    <WatchlistPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          
          {/* Footer will stay at bottom */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;