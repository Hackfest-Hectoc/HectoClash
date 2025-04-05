import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUpPage from './components/Signup/SignUpPage';
import SignIn from './components/Login/SignIn';
import Home from './components/Home/Home';
import GameSelect from './components/gameselect/gameselect';
import MathGame from './components/gameselect/playArea';
import Spectator from './components/gameselect/spectator';
import LeaderBoard from './components/gameselect/leaderBoard';
import Test from './components/gameselect/test';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path='/signin' element={<SignIn />}/>
        <Route path='/' element={<Home/>}/>
        <Route path='/home' element={<GameSelect/>}/>
        <Route path='/MathGame' element={<MathGame/>}/>
        <Route path='/Spectator' element={<Spectator/>}/>
        <Route path='/leaderboard' element={<LeaderBoard/>}/>
        <Route path='/test' element={<Test/>}/>
      </Routes>
    </Router>
  );
}

export default App
