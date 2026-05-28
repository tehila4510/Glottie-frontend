import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetAllSkillsQuery } from "../features/Skill/Redux/api";
import { useGetAllUserSkillProgressQuery } from "../features/UserSkillProgress/Redux/api";
import { useNavigate } from "react-router-dom";
import LessonPath from "../features/Lesson/LessonPath";
import QuizPage from "../features/Quiz/Components/QuizPage";
import {
  selectSkillsWithStatus,
  SKILL_METADATA,
} from "../features/Skill/Redux/skillSelectors";

import logo from "../../public/logo.png";
import "./HomeView.css";
import streak from "../../public/streak.png";
import xp from "../../public/xp.png";
import level from "../../public/level.png";

import { SKILL_IMAGE_MAP } from "../utils/skillIcons"; 

export default function HomeView() {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showPath, setShowPath] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const { isLoading: loadingSkills, isFetching: fetchingSkills ,isError: errorSkills } =
    useGetAllSkillsQuery();
  const { isLoading: loadingProgress, isFetching: fetchingProgress } =
    useGetAllUserSkillProgressQuery();

  const skillsWithStatus = useSelector(selectSkillsWithStatus);

  if (loadingSkills || loadingProgress || fetchingSkills || fetchingProgress) {
    return (
      <div className="page">
        <div className="loading-spinner" />
      </div>
    );
  }
  if (errorSkills) return <div className="page"><div className="error-state">⚠️ Could not load skills.</div></div>;

  if (showPath && selectedSkill) {
    return (
      <div className="page">
        <LessonPath
          skill={selectedSkill}
          onBack={() => setShowPath(false)}
          onStartQuiz={() => {
            setShowPath(false);
            setShowQuiz(true);
          }}
        />
      </div>
    );
  }

  if (showQuiz && selectedSkill) {
    return (
      <QuizPage
        skill={selectedSkill}
        onClose={() => {
          setShowQuiz(false);
          setShowPath(true);
        }}
      />
    );
  }

  return (
    <div className="page">
      <div className="g-blob g-blob-1" />
      <div className="g-blob g-blob-2" />

      <div className="home-hero">
        <div className="hero-content">
          <div className="hero-greeting">
            Welcome back, {currentUser?.name}!
          </div>
          <div className="hero-title">
            Ready to conquer <span>Glottie</span>?
          </div>
          <div className="hero-sub">
            Pick a skill, unlock levels, and become a language master!
          </div>
          <div className="stats-row">
            <div className="stat-chip">
              <span>
                {" "}
                <img src={streak} alt="logo" width="25px" />
              </span>{" "}
              {currentUser?.streak || 0}-day streak
            </div>
            <div className="stat-chip">
              <span style={{ fontSize: "18px", marginRight: "4px" }}>❤️</span>{" "}
              {currentUser?.hearts !== undefined ? currentUser.hearts : 5}{" "}
              Hearts
            </div>
            <div className="stat-chip">
              <span>
                {" "}
                <img src={xp} alt="logo" width="25px" />
              </span>{" "}
              {currentUser?.xp || 0} XP
            </div>
            <div className="stat-chip">
              <span>
                {" "}
                <img src={level} alt="logo" width="25px" />
              </span>{" "}
              Level {currentUser?.currentLevel || 1}
            </div>
          </div>
        </div>
        <div className="hero-owl">
          <img src={logo} alt="logo" width="90px" />
        </div>
      </div>

      <div className="section-title">Choose a Skill</div>

      <div className="skills-grid">
        {skillsWithStatus?.map((skill) => {
          const meta = SKILL_METADATA[skill.name] || SKILL_METADATA.chat;
          const iconSrc = SKILL_IMAGE_MAP[skill.name] || SKILL_IMAGE_MAP.chat;
          return (
            <div
              key={skill.skillId}
              className={`skill-card-home ${!skill.unlocked ? "locked" : ""}`}
              style={{ "--card-color": meta.color }}
              onClick={() => skill.unlocked && setSelectedSkill(skill)}
            >
              <div className="skill-icon-home">
                <img src={iconSrc} alt={skill.name} />
              </div>
              <div className="skill-name-home">{skill.name}</div>
              <div className="skill-progress-text-home">
                {skill.unlocked
                  ? `${skill.progressPercent}%`
                  : `Level ${skill.recommendedLevelId} required`}
              </div>
              <div className="skill-bar-home">
                <div
                  className="skill-bar-fill"
                  style={{
                    width: `${skill.progressPercent}%`,
                    background: skill.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {selectedSkill && (
        <div className="cta-wrapper">
          <button
            className="btn-primary"
            onClick={() => {
              if (selectedSkill.name === "Chat with Glottie ") {
                navigate("/chat");
              } else {
                navigate(`/quiz/${selectedSkill.skillId}`);
              }
            }}
          >
            🚀 Start {selectedSkill.name}!
          </button>
        </div>
      )}
    </div>
  );
}
