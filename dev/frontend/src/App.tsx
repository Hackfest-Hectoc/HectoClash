import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUpPage from './components/Signup/SignUpPage';
import SignIn from './components/Login/SignIn';
import Home from './components/Home/Home';
import Gameselect from './components/gameselect/gameselect';
import MathGame from './components/gameselect/playArea';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path='/signin' element={<SignIn />}/>
        <Route path='/' element={<Home/>}/>
        <Route path='/gameselect' element={<Gameselect/>}/>
        <Route path='/MathGame' element={<MathGame/>}/>
      </Routes>
    </Router>
  );
}

export default App
