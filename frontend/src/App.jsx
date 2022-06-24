import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './components/Signup'
import VerifyEmail from './components/VerifyEmail'
import Home from './components/Home'

const App = () => {
  return (
    <main className='container d-flex justify-content-center align-items-center flex-col mt-5'>
      <Router>
        <Routes>
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/signup' element={<Signup />} />
          <Route exact path='/verify/:token' element={<VerifyEmail />} />
          <Route exact path='/' element={<Home />} />
        </Routes>
      </Router>
    </main>
  )
}

export default App
