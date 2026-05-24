import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ProgressView from '../features/UserSkillProgress/Components/ProgressView';
import ErrorsView from '../features/UserAnswer/Components/ErrorsView';
import ProfileView from '../features/User/Components/ProfileView';
import ChatView from '../features/Chat/Components/ChatView';
import HomeView from '../Pages/HomeView';
import QuizPage from '../features/Quiz/Components/QuizPage';
import AuthPage from '../auth/AuthPage.jsx'; 
// ייבוא עמוד האותנטיקציה הראשי שלך
import commingSoon from "../../public/comming soon.png";
import { useParams, useNavigate } from 'react-router-dom';

function QuizRoute() {
  const { skillId } = useParams();
  const navigate = useNavigate();
  return <QuizPage skillId={parseInt(skillId)} onClose={() => navigate('/')} />;
}

const AppRouter = () => {
  const { isLoggedIn } = useSelector((state) => state.user);

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!isLoggedIn ? <AuthPage onAuthSuccess={() => {}} /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/register" 
        element={!isLoggedIn ? <AuthPage onAuthSuccess={() => {}} /> : <Navigate to="/" replace />} 
      />

      <Route path="/" element={isLoggedIn ? <HomeView /> : <Navigate to="/login" replace />} />
      <Route path="/progress" element={isLoggedIn ? <ProgressView /> : <Navigate to="/login" replace />} />
      <Route path="/errors" element={isLoggedIn ? <ErrorsView /> : <Navigate to="/login" replace />} />
      <Route path="/profile" element={isLoggedIn ? <ProfileView /> : <Navigate to="/login" replace />} />
      <Route path="/chat" element={isLoggedIn ? <ChatView /> : <Navigate to="/login" replace />} />
      <Route path="/settings" element={isLoggedIn ? <PlaceholderPage /> : <Navigate to="/login" replace />} />
      <Route path="/help" element={isLoggedIn ? <PlaceholderPage /> : <Navigate to="/login" replace />} />
      <Route path="/quiz/:skillId" element={isLoggedIn ? <QuizRoute /> : <Navigate to="/login" replace />} />

      <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
    </Routes>
  );
};

const PlaceholderPage = ({ icon, title }) => (
  <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, minHeight: '60vh' }}>
    <div style={{ fontSize: 56 }}>{icon}</div>
    <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: 'var(--text)' }}>{title}</div>
    <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Coming soon!</div>
    <span> <img src={commingSoon} alt="logo" width="200px" /></span>
  </div>
);

export default AppRouter;