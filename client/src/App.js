import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './components/Login';
import Signup from './components/Signup';
import Header from './components/Header';
import Home from './components/Home';
import CollegeSearch from './components/CollegeSearch';
import MyColleges from './components/MyColleges';
import Colleges from './components/Colleges';
import CollegeProfile from './components/College/CollegeProfile';
import UserProfile from './components/Users/UserProfile';
import ProtectedRoutes from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import CollegeSignup from './components/CollegeSignup';
import AdminProfile from './components/admin/AdminProfile';
import CollegeSignup2 from './components/CollegeSignup2';
import CollegesReq from './components/admin/CollegesReq';
import CollegeSign from './components/CollegeSign';
import CollegesLi from './components/admin/CollegeLi';
import Notification from './components/Notification';
import Profile from './components/Profile';
import PublicProfile from './components/PublicProfile';
import PendingProfile from './components/PendingProfile';
import UserSearch from './components/UserSearch';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={
            <PublicRoute>
          <Login/>
          </PublicRoute>}/>
          <Route path='/signup' element={
          <PublicRoute>
          <Signup/>
          </PublicRoute>}/>

          <Route path='/college-signup/:id' element={
          <ProtectedRoutes>
            <Header/>
          <CollegeSign/>
          </ProtectedRoutes>}/>
          <Route path='/college-signup2' element={
          <ProtectedRoutes>
          <CollegeSignup2/>
          </ProtectedRoutes>}/>
          <Route path='/' element={
          <ProtectedRoutes>
          <Header/><Home/>
          </ProtectedRoutes>
          }/>
          <Route path='/mycollege/:id' element={
          <ProtectedRoutes>
          <Header/><MyColleges/>
          </ProtectedRoutes>}/>
          <Route path='/college-requests' element={
          <ProtectedRoutes>
          <Header/><CollegesReq/>
          </ProtectedRoutes>}/>
          <Route path='/colleges/:id' element={
            <ProtectedRoutes>
            <Header/><Colleges/>
            </ProtectedRoutes>}/>
          <Route path='/search/:id' element={
          <ProtectedRoutes>
            <Header/><CollegeSearch/>
            </ProtectedRoutes>}/>

          <Route path='/user-search/:id' element={
          <ProtectedRoutes>
            <Header/><UserSearch/>
            </ProtectedRoutes>}/>
          <Route path='/profile-clg/:id' element={
          <ProtectedRoutes>
          <Header/><CollegeProfile/>
          </ProtectedRoutes>}/>
          <Route path='/profile-user/:id' element={
          <ProtectedRoutes>
          <Header/><UserProfile/>
          </ProtectedRoutes>
          }/>
          <Route path='/profile-admin/:id' element={
          <ProtectedRoutes>
          <Header/><AdminProfile/>
          </ProtectedRoutes>
          }/>

          <Route path='/profile/:id' element={
          <ProtectedRoutes>
          <Header/><PublicProfile/>
          </ProtectedRoutes>
          }/>
          <Route path='/profileClg/:id' element={
          <ProtectedRoutes>
          <Header/><PendingProfile/>
          </ProtectedRoutes>
          }/>

          <Route path='/college-list/:id' element={
          <ProtectedRoutes>
          <Header/><CollegesLi/>
          </ProtectedRoutes>
          }/>
          <Route path='/notification' element={
          <ProtectedRoutes>
          <Header/><Notification/>
          </ProtectedRoutes>
          }/>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;