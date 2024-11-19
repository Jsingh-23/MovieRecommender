import {Link} from 'react-router-dom';
import "../../styles/footer.css"
export default function Footer() {


    return (
        <div className='footer-container'>
            <div className="footer">
                <Link to="/about" className="nav-item">
                About
                </Link>
                <Link to="/contact" className="nav-item">
                Contact
                </Link>            
            </div>
        </div>
    )
}