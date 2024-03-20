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
      <div className="nav-list">
        <Link to="/" className="link">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
        <Link className="link nav-mobile-item" to="/">
          <IoMdHome />
        </Link>
        <Link className="link nav-mobile-item" to="/jobs">
          <BsBriefcaseFill />
        </Link>
        <button
          type="button"
          className="nav-mobile-btn nav-mobile-item"
          onClick={logout}
          aria-label="logout"
          title="logout"
          name="logout"
        >
          <IoExitOutline />
        </button>
        <Link className="link nav-item" to="/">
          Home
        </Link>
        <Link className="link nav-item" to="/jobs">
          Jobs
        </Link>
        <button
          type="button"
          className="nav-logout-btn nav-item"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)
