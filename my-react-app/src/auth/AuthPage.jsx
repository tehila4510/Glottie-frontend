import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [updateUser] = useUpdateUserMutation();
  // בתוך AuthPage
  const [pendingAuth, setPendingAuth] = useState(null);
  // const currentUser = useSelector((state) => state.user.user);
  // const currentToken = useSelector((state) => state.user.token);

  const isRegisterPath = location.pathname === "/register";
  const [step, setStep] = useState("form");
  const [alert, setAlert] = useState(null);

  const [registerUser, { isLoading: registering }] = useRegisterUserMutation();
  // const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    setAlert(null);
    setStep("form");
  }, [location.pathname]);

  const getErrorMessage = (err) => {
    if (err?.data?.errors)
      return Object.values(err.data.errors).flat().join(", ");
    if (err?.data?.message) return err.data.message;
    return "Something went wrong, try again later.";
  };

  const handleRegisterNext = async (formData) => {
    setAlert(null);
    try {
      const dataToSend = new FormData();
      dataToSend.append("Name", formData.name);
      dataToSend.append("Email", formData.email);
      dataToSend.append("Password", formData.password);
      if (formData.file) dataToSend.append("AvatarUrl", formData.AvatarUrl);

      const result = await registerUser(dataToSend).unwrap();

      const user = result?.user || result?.User;
      const token = result?.token || result?.Token;
      // dispatch(setUser({ token, user }));

      setPendingAuth({ user, token });
      dispatch(setUser({ token, user: null }));

      setStep("level");
    } catch (err) {
      if (
        err?.status === 409 ||
        JSON.stringify(err).toLowerCase().includes("exists")
      ) {
        setAlert({
          type: "error",
          msg: "User already exists. Please log in instead.",
        });
        setTimeout(() => navigate("/login"), 2500);
      } else {
        setAlert({ type: "error", msg: getErrorMessage(err) });
      }
    }
  };

  const handleLevelFinalize = async (levelId) => {
    setAlert(null);
    const { user, token } = pendingAuth; 
  
  const userId = user?.userId || user?.id;
    try {
      const dataToSend = new FormData();
      dataToSend.append("Name", user?.name || user?.Name);
    dataToSend.append("Email", user?.email || user?.Email);
    dataToSend.append("CurrentLevel", levelId);
    const updatedUserFromServer = await updateUser({ id: userId, data: dataToSend }).unwrap();

   
    dispatch(
      setUser({
        token: token, 
        user: updatedUserFromServer, 
      })
    );
    onAuthSuccess();

    } catch (err) {
      console.error("Update level error FULL:", JSON.stringify(err));
      setAlert({
        type: "error",
        msg:
          "Level update failed: " +
          (err?.data?.message || err?.message || "unknown"),
      });
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
                className={`auth-tab ${!isRegisterPath ? "active" : ""}`}
                onClick={() => navigate("/login")}
              >
                🔐 Login
              </button>
              <button
                className={`auth-tab ${isRegisterPath ? "active" : ""}`}
                onClick={() => navigate("/register")}
              >
                ✨ Sign Up
              </button>
            </div>

            {alert && <div className={`alert ${alert.type}`}>{alert.msg}</div>}

            {!isRegisterPath ? (
              <LoginTab onAuthSuccess={onAuthSuccess} setAlert={setAlert} />
            ) : (
              <RegisterTab
                onNextStep={handleRegisterNext}
                isLoading={registering}
              />
            )}
          </>
        )}

        {step === "level" && (
          <LevelPicker
            onSelectLevel={handleLevelFinalize}
            onStartTest={() => setStep("test")}
          />
        )}

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
