import { useSelector, useDispatch } from 'react-redux';
import UserAvatar from '../features/User/Components/userAvatar';
import logo from "../../public/logo2.png"
import {NavLink,useNavigate} from 'react-router-dom';

import logoutIcon from "../../public/logout.png";
import { logout } from '../features/User/Redux/userSlice';
import {LEVELS} from "../utils/levels";

import { NAV_CONFIG } from '../utils/navConfig';


export default function Sidebar({ errorCount }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
 const { currentUser } = useSelector((state) => state.user);
  const totalXp = currentUser?.xp || 0;
  const currentLevel = currentUser?.currentLevel || 1;

  // חישוב המרחק לרמה הבאה
  const currentLevelInfo = LEVELS[currentLevel] || LEVELS[1];
  const nextLevelInfo = LEVELS[currentLevel + 1] || currentLevelInfo;
  
  const xpInThisLevel = totalXp - currentLevelInfo.minXp;
  const xpRequiredForNextLevel = nextLevelInfo.minXp - currentLevelInfo.minXp;
  
  // חישוב האחוז (מוגן ממקסימום רמה)
  const isMax = currentLevel >= 6;
  const xpPct = isMax ? 100 : Math.min(100, (xpInThisLevel / xpRequiredForNextLevel) * 100);
  const handleLogout = () => {
    dispatch(logout());
  };
return (
    <aside className="sidebar">
      <div className="sidebar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <span> <img src={logo} alt="logo" width="30px" /></span>
        <span className="logo-text">GLOTTIE</span>
      </div>

      <div className="nav-section">
        <div className="nav-label">Navigation</div>
        
        {NAV_CONFIG.map((n) => (
          <NavLink 
            key={n.id} 
            to={n.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{n.icon}</span>
            <span>{n.label}</span>
            {n.badge && errorCount > 0 && (
              <span className="nav-badge">{errorCount}</span>
            )}
          </NavLink>
        ))}

        <div className="nav-item" onClick={handleLogout} style={{ marginTop: 8, color: 'var(--red)', cursor: 'pointer' }}>
          <span className="nav-icon"><span> <img src={logoutIcon} alt="logo" width="30px" /></span></span>
          <span>Logout</span>
        </div>
      </div>

      <NavLink 
        to="/profile" 
        className={({ isActive }) => `sidebar-profile ${isActive ? 'active' : ''}`}
        style={{ marginTop: 'auto', textDecoration: 'none', color: 'inherit' }}
      >
        <div className="profile-mini">
          <div className="avatar">      
            <UserAvatar size={38} />
          </div>
          <div>
            <div className="profile-name">
              {currentUser?.firstName} {currentUser?.lastName}
            </div>
            <div className="profile-level">
              ⭐ Level {currentLevel}
            </div>
          </div>
        </div>

      <div className="xp-mini">
            <div className="xp-bar-bg">
               <div className="xp-bar-fill" style={{ width: `${xpPct}%` }} />
            </div>
            <div className="xp-label">
              {isMax ? "Max Level" : `${xpInThisLevel} / ${xpRequiredForNextLevel} XP`}
            </div>
         </div>
        
        
      </NavLink>


      
    </aside>
  );


  
}

