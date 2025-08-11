import { Route, Routes } from 'react-router';
import './App.css';
import Home from './Home';
import Payment from './payment';
import Form from './form';
import Admin from './admin';
import Attd from './Attd';
import TeamPanel from './TeamPanel';
import EventUp from './EventUp';
import Marks from './Marks';
import Leaderboard from './LeaderBoard';
import AttdDetail from './AttdDetail';
import Food from './Food';
import Pics from './pics';
import DomainStats from './DomainStats';
import FoodOrders from './foodDet';
import AllTeams from "./AllTeams";

function App() {
    return (
                <Routes >
        <Route path='/' element={<Home/>}/>
        <Route path='/registration' element={<Form/>}/>
        <Route path='/payment' element={<Payment/>}/>
        <Route path='/admin-login' element={<Admin/>}/>
        <Route path='/attd' element={<Attd/>}/>
        <Route path='/teampanel' element={<TeamPanel/>}/>
        <Route path='/event' element={<EventUp/>}/>
        <Route path='/marks' element={<Marks/>}/>
        <Route path="/all-teams" element={<AllTeams />}/>
        <Route path='/balaya' element={<Leaderboard/>}/>
        <Route path='/babu' element={<AttdDetail/>}/>
        <Route path='/food' element={<Food/>}/>
        <Route path='/photos'  element={<Pics/>}/>
        <Route path='/domain' element={<DomainStats/>}/>
        {/* <Route path='/foods' element={<FoodOrders/>}/> */}
        {/* <Route path='/admin' element={<Admin/>}/>
        <Route path='/teampanel' element={<TeamPanel/>}/>
        <Route path='/at' element={<AllTeamsAttendance/>}/>
        <Route path='/Score' element={<Score/>}/>
        <Route path='/allscore' element={<AllScore/>}/>
        <Route path='/high' element={<High/>}/> */}
      </Routes>           
    );
}

export default App