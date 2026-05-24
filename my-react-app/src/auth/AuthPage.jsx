import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from 'react-router-dom';
import {
  useRegisterUserMutation,
  useUpdateUserMutation,
} from "../features/User/Redux/api";
import { setUser } from "../features/User/Redux/userSlice";
import LoginTab from "./LoginForm";
import RegisterTab from "./RegisterForm";
import PlacementTest from "./PlacementTest";
import LevelPicker from "./LevelPicker";
import logo from "../../public/logo.png";

import "./auth.css";

export default function AuthPage({ onAuthSuccess }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const [tab, setTab] = useState(location.pathname === "/register" ? "register" : "login");
  const [step, setStep] = useState("form");
  const [alert, setAlert] = useState(null);
  const [registrationResult, setRegistrationResult] = useState(null); // תוצאת רישום זמנית

  const [registerUser, { isLoading: registering }] = useRegisterUserMutation();
  const [updateUser] = useUpdateUserMutation();

  
  const getErrorMessage = (err) => {
    if (err?.data?.errors) {
      return Object.values(err.data.errors).flat().join(", ");
    }
    if (err?.data?.message) {
      return err.data.message;
    }
    if (err?.status === "FETCH_ERROR") {
      return "לא ניתן ליצור קשר עם השרת. וודא שהוא מופעל.";
    }
    return "משהו השתבש, נסה שוב מאוחר יותר.";
  };
  const handleRegisterNext = async (formData) => {
    setAlert(null);
    try {
      const dataToSend = new FormData();
      dataToSend.append("Name", formData.name);
      dataToSend.append("Email", formData.email);
      dataToSend.append("Password", formData.password);
      if (formData.file) {
        dataToSend.append("file", formData.file);
      }

      const result = await registerUser(dataToSend).unwrap();

      setRegistrationResult(result);
      setStep("level");
     } catch (err) {
        const msg = err?.data;
        if (typeof msg === 'string' && msg.toLowerCase().includes('already exists')) {
            setAlert({
                type: 'error',
                msg: 'This email is already registered. '
            });
            setTab('login');
            setStep('form');
        } else {
            setAlert({ type: 'error', msg: getErrorMessage(err) });
        }
    }
};

  // ── שלב 2: בחירת רמה — עדכון ואז כניסה לאפליקציה ──
  const handleLevelFinalize = async (levelId) => {
    setAlert(null);
    try {
      const user = registrationResult?.user || registrationResult?.User;
      const token = registrationResult?.token || registrationResult?.Token;
      const userId = user?.userId || user?.id;

      if (!userId) throw new Error("User ID not found");

      const dataToSend = new FormData();
      dataToSend.append("Name", user?.name || user?.Name);
      dataToSend.append("Email", user?.email || user?.Email);
      dataToSend.append("CurrentLevel", levelId);

      await updateUser({ id: userId, data: dataToSend }).unwrap();

      // ✅ רק עכשיו — אחרי בחירת רמה — נכנסים לאפליקציה
      dispatch(setUser({ token, user: { ...user, CurrentLevel: levelId } }));
      onAuthSuccess();
    } catch (err) {
      console.error("Update level error:", err);
      // גם אם העדכון נכשל — נכנסים עם הרמה שנבחרה
      const user = registrationResult?.user || registrationResult?.User;
      const token = registrationResult?.token || registrationResult?.Token;
      dispatch(setUser({ token, user: { ...user, CurrentLevel: levelId } }));
      onAuthSuccess();
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-owl">
            {" "}
            <img src={logo} alt="logo" width="150px" />
          </span>
        </div>

        {/* ─── Step: FORM ─── */}
        {step === "form" && (
          <>
            <div className="auth-tabs">
              <button
                className={`auth-tab ${tab === "login" ? "active" : ""}`}
                onClick={() => {
                  setTab("login");
                  setAlert(null);
                }}
              >
                🔐 Login
              </button>
              <button
                className={`auth-tab ${tab === "register" ? "active" : ""}`}
                onClick={() => {
                  setTab("register");
                  setAlert(null);
                }}
              >
                ✨ Sign Up
              </button>
            </div>

            {alert && (
              <div className={`alert ${alert.type}`}>
                {alert.type === "error" ? "⚠️" : "✅"} {alert.msg}
              </div>
            )}

            {tab === "login" ? (
              <LoginTab
                onAuthSuccess={onAuthSuccess}
                setAlert={setAlert}
                setTab={setTab}
              />
            ) : (
              <RegisterTab
                onNextStep={handleRegisterNext}
                setTab={setTab}
                isLoading={registering}
              />
            )}
          </>
        )}

        {/* ─── Step: LEVEL PICKER ─── */}
        {step === "level" && (
          <>
            {alert && (
              <div className={`alert ${alert.type}`}>⚠️ {alert.msg}</div>
            )}
            <LevelPicker
              onSelectLevel={handleLevelFinalize}
              onStartTest={() => setStep("test")}
            />
          </>
        )}

        {/* ─── Step: PLACEMENT TEST ─── */}
        {step === "test" && (
          <PlacementTest
            onComplete={handleLevelFinalize}
            onBack={() => setStep("level")}
          />
        )}
      </div>
    </div>
  );
}
