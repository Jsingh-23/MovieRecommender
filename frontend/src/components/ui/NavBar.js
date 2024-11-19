// components/ui/NavBar.js
import "../../styles/navbar.css";
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function NavBar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                {/* Use Link instead of a for client-side routing */}
                <Link to="/" className="logo">
                    Movie Recommender
                </Link>
            </div>
            <div className="navbar-right">

                {/*Render these routes if user is logged in */}
                {user ? (
                    <>
                        <span className="nav-item">
                            <Link to="profile" className="nav-item">
                            {user.email}
                            </Link>
                        </span>

                        <span className="nav-item">
                            <Link to="watchlist" className="nav-item">
                            Watchlist
                            </Link>
                        </span>
                        
                        <button 
                            onClick={handleLogout} 
                            className="nav-item"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    // Render routes if user is not logged in
                    <Link to="/login" className="nav-item">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}