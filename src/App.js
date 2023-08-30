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
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/' element={<div><Header/><Home/></div>}/>
          <Route path='/mycollege' element={<div><Header/><MyColleges/></div>}/>
          <Route path='/colleges' element={<div><Header/><Colleges/></div>}/>
          <Route path='/search' element={<div><Header/><CollegeSearch/></div>}/>
          <Route path='/profile-clg' element={<div><Header/><CollegeProfile/></div>}/>
          <Route path='/profile-user' element={<div><Header/><UserProfile/></div>}/>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
