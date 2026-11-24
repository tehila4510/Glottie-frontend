import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Sidebar       from './Sidebar';
import UserAvatar from '../features/User/Components/userAvatar';


import '../styles/variables.css';
import AppRouter from './router';
import { NAV_CONFIG } from '../utils/navConfig';

import home from "../../public/home.png";
import streak from "../../public/streak.png";
import xp from "../../public/xp.png";

import Particles from './Particles';
const TITLES = NAV_CONFIG.reduce((acc, item) => {
  acc[item.path] = <span>{item.icon} {item.label}</span>;
  return acc;
}, {});

export default function GlottieApp() {
const { currentUser, isLoggedIn } = useSelector((state) => state.user);
  const location = useLocation(); 
if (!isLoggedIn) {
    return (
      <div className="scroll-area" style={{ height: '100vh', overflowY: 'auto' }}>
        <AppRouter />
      </div>
    );
  }
  return (
    <>
      <Particles />
      <div className="app">
        <Sidebar /> 
      <main className="main">
        <div className="topbar">
          <div className="topbar-title">{TITLES[location.pathname] ||  <span> <img src={home} alt="logo" width="20px" />  home</span>}</div>
          <div className="topbar-stats">
             <div className="topbar-streak"><span> <img src={streak} alt="logo" width="30px" /></span> {currentUser?.streak || 0}</div>
             <div className="topbar-xp"><span> <img src={xp} alt="logo" width="33px" /></span>  {currentUser?.xp || 0} XP</div>
                         <div className="topbar-hearts"><span style={{ fontSize: '18px', marginRight: '4px' }}>❤️</span> {currentUser?.hearts !== undefined ? currentUser.hearts : 5} Hearts</div>

             <UserAvatar size={38} />
          </div>
        </div>

        <div className="scroll-area" style={{ height: 'calc(100vh - 65px)', overflowY: 'auto' }}>
          <AppRouter />
        </div>
      </main>
      </div>
    </>
  );
}
