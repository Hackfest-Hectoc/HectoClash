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
import Test2  from './components/gameselect/duelsdragdrop';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path='/signin' element={<SignIn />}/>
        <Route path='/' element={<Home/>}/>
        <Route path='/home' element={<GameSelect/>}/>
        <Route path='/gamearea' element={<MathGame/>}/>
        <Route path='/Spectator' element={<Spectator/>}/>
        <Route path='/leaderboard' element={<LeaderBoard/>}/>
        <Route path='/profile' element={<Test/>}/>
        <Route path='/gamearea2' element={<Test2/>}/>
      </Routes>
    </Router>
  );
}

export default App
