import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './components/Login';
import Signup from './components/Signup';
import Header from './components/Header';
import Home from './components/Home';
import CollegeSearch from './components/CollegeSearch';
import AddCourse from './components/AddCourse';
import MyColleges from './components/MyColleges';
import Colleges from './components/Colleges';
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
          <Route path='/course' element={<AddCourse/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
