import {IoMdHome} from 'react-icons/io'
import {IoExitOutline} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const logout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="nav">
      <ul className="nav-list">
        <li className="nav-logo">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </li>
        <li className="nav-mobile-item">
          <Link className="link" to="/">
            <IoMdHome />
          </Link>
        </li>
        <li className="nav-mobile-item">
          <Link className="link" to="/jobs">
            <BsBriefcaseFill />
          </Link>
        </li>
        <li className="nav-mobile-item">
          <button
            type="button"
            className="nav-mobile-btn"
            onClick={logout}
            aria-label="logout"
            title="logout"
            name="logout"
          >
            <IoExitOutline />
          </button>
        </li>
        <li className="nav-item">
          <Link className="link" to="/">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link className="link" to="/jobs">
            Jobs
          </Link>
        </li>
        <li className="nav-item">
          <button type="button" className="nav-logout-btn" onClick={logout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
