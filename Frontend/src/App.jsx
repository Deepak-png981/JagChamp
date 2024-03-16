import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import {
  Header,
  Home,
  Footer,
  SignUp,
  SignIn,
  Lessons,
  Lesson,
  AdminLogin,
  AdminHome,
  AdminLesson,
  AdminForm,
  AdminUsers,
  CreateLesson,
  About,
  Contact,
  HallOfFame
} from './components'

const UserProtectedRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/signin" />;
}
const AdminProtectedRoute = ({ element, ...rest }) => {
  const adminToken = localStorage.getItem('adminToken');
  return adminToken ? element : <Navigate to='/admin' />
}
function App() {

  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/signup' element={<SignUp />}></Route>
          <Route path='/signin' element={<SignIn />}></Route>
          <Route path='/lessons' element={<UserProtectedRoute element={<Lessons />} />}></Route>
          <Route path='/about' element={<About />}></Route>
          <Route path='/contact' element={<Contact />}></Route>
          <Route path='/hall-of-fame' element={<HallOfFame />}></Route>

          <Route path='/lesson/:id' element={<UserProtectedRoute element={<Lesson />} />}></Route>


          <Route path='/admin' element={<AdminLogin />}></Route>
          <Route path='/admin/home' element={<AdminProtectedRoute element={<AdminHome />} />} ></Route>
          <Route path='/admin-lesson/:id' element={<AdminProtectedRoute element={<AdminLesson />} />} ></Route>
          <Route path='/admin/lesson-update/:id' element={<AdminProtectedRoute element={<AdminForm />} />} ></Route>
          <Route path='/admin/all-user' element={<AdminProtectedRoute element={<AdminUsers />} />} ></Route>
          <Route path='/admin/create-lesson' element={<AdminProtectedRoute element={<CreateLesson />} />} ></Route>
        </Routes>
        <Footer />
      </Router >
    </>
  )
}

export default App
