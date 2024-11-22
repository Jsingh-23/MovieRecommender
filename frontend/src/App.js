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
import WatchHistoryPage from './pages/protected/Watchhistory';
import MoviePage from './pages/MoviePage';
import About from './pages/About';
import Contact from './pages/Contact';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
      cacheTime: 30 * 60 * 1000, // Cache data for 30 minutes
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/movie/:title" element={<MoviePage />} />

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
                <Route 
                  path="/watchhistory"
                  element={
                    <ProtectedRoute>
                      <WatchHistoryPage />
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
    </QueryClientProvider>
  );
}

export default App;