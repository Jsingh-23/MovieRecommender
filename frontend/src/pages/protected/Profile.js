import { useAuth } from '../../contexts/AuthContext';
import '../../styles/profile.css';

const ProfilePage = () => {
    const { user } = useAuth();

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h1 className="profile-title">Profile</h1>
                <div className="profile-field-container">
                    <div>
                        <label className="profile-label">Email</label>
                        <div className="profile-value">{user?.email}</div>
                    </div>
                    <div>
                        <label className='profile-label'>Watchlist</label>
                        {/* <div className='profile-value'>{user?.</div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;