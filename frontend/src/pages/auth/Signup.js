// src/pages/auth/SignupPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/auth/auth.css';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { signup, signInWithGoogle } = useAuth();

    const handleSignup = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        if (password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        try {
            setError('');
            setIsLoading(true);
            await signup(email, password);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError(
                err.code === 'auth/email-already-in-use' 
                    ? 'An account with this email already exists'
                    : 'Failed to create account. Please try again.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        try {
            setError('');
            setIsLoading(true);
            await signInWithGoogle();
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Failed to sign up with Google. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-wrapper">
                <h2 className="auth-title">
                    Create your account
                </h2>
                <p className="auth-subtitle">
                    Already have an account?{' '}
                    <Link to="/login" className="auth-link">
                        Sign in
                    </Link>
                </p>

                <div className="form-container">
                    <button
                        onClick={handleGoogleSignup}
                        disabled={isLoading}
                        className="google-button"
                    >
                        <img 
                            src="/google-icon.png" 
                            alt="Google" 
                            className="google-icon"
                        />
                        Sign up with Google
                    </button>

                    <div className="divider">
                        <div className="divider-line">
                            <div className="divider-border" />
                        </div>
                        <div className="divider-text">
                            <span>Or continue with</span>
                        </div>
                    </div>

                    <form className="auth-form" onSubmit={handleSignup}>
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
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirm-password">Confirm Password</label>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="form-input"
                            />
                        </div>

                        <div className="text-sm text-gray-400">
                            By signing up, you agree to our{' '}
                            <Link to="/terms" className="auth-link">
                                Terms of Service
                            </Link>
                            {' '}and{' '}
                            <Link to="/privacy" className="auth-link">
                                Privacy Policy
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="submit-button"
                        >
                            {isLoading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;