import {Redirect, Route} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'

const ProtectedRoute = props => {
  const token = Cookies.get('jwt_token')
  if (token === undefined) {
    return <Redirect to="/login" />
  }
  return (
    <>
      <Header />
      <Route {...props} />
    </>
  )
}

export default ProtectedRoute
