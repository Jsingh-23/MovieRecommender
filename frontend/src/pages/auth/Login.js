import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(
        err.code === 'auth/invalid-credential' 
          ? 'Invalid email or password'
          : 'Failed to sign in. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setIsLoading(true);
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h2 className="auth-title">
          Sign in to your account
        </h2>
        <p className="auth-subtitle">
          Or{' '}
          <Link to="/signup" className="auth-link">
            create a new account
          </Link>
        </p>

        <div className="form-container">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="google-button"
          >
            <img 
              src="/google-icon.png" 
              alt="Google" 
              className="google-icon"
            />
            Sign in with Google
          </button>

          <div className="divider">
            <div className="divider-line">
              <div className="divider-border" />
            </div>
            <div className="divider-text">
              <span>Or continue with</span>
            </div>
          </div>

          <form className="auth-form" onSubmit={handleEmailLogin}>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-actions">
              <div className="remember-me">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="checkbox-input"
                />
                <label htmlFor="remember-me">Remember me</label>
              </div>

              <Link to="/forgot-password" className="auth-link">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              {isLoading ? 'Signing in...' : 'Sign in with Email'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;