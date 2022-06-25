import { Route, Routes, NavLink } from 'react-router-dom'
import useAuth from './hooks/useAuth'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './components/Login'
import Signup from './components/Signup'
import VerifyEmail from './components/VerifyEmail'
import PrivateRoute from './routes/PrivateRoutes'
import Home from './components/Home'
import useAxios from './hooks/useAxios'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import ChangePassword from './components/ChangePassword'

const App = () => {
  const { setAuth } = useAuth()
  const [res, err, loading, logout] = useAxios()
  const handleLogout = () => {
    logout({
      method: 'POST',
      url: 'logout',
    })
    setAuth({})
  }
  return (
    <>
      <header>
        <nav className='d-flex justify-content-evenly'>
          <NavLink to='/login' className='text-primary'>
            Login
          </NavLink>
          <NavLink to='/signup' className='text-primary'>
            Signup
          </NavLink>
          <NavLink to='/forgotpassword' className='text-primary'>
            Forgot Password
          </NavLink>
          <NavLink to='/changepassword' className='text-primary'>
            Change Password
          </NavLink>
          <NavLink to='/' className='text-primary'>
            Home
          </NavLink>
          <button className='btn btn-link p-0' onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>
      <main className='container d-flex justify-content-center align-items-center flex-col mt-5'>
        <Routes>
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/signup' element={<Signup />} />
          <Route exact path='/verify/:token' element={<VerifyEmail />} />
          <Route exact path='/forgotpassword' element={<ForgotPassword />} />
          <Route
            exact
            path='/resetpassword/:token'
            element={<ResetPassword />}
          />
          <Route element={<PrivateRoute />}>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/changepassword' element={<ChangePassword />} />
          </Route>
        </Routes>
      </main>
    </>
  )
}

export default App
