import { useSelector } from "react-redux";
import { useGetAllUserSkillProgressQuery } from "../Redux/api";
import { useGetAllSkillsQuery } from "../../Skill/Redux/api";
import { SKILL_IMAGE_MAP } from "../../../utils/skillIcons";
import {
  selectSkillsWithStatus,
  SKILL_METADATA,
} from "../../Skill/Redux/skillSelectors";

import "./ProgressView.css";

const DAYS_TO_SHOW = 25;

function buildHeatmap(progressList) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const practicedDates = new Set(
    progressList
      .filter((p) => p.lastPracticed)
      .map((p) => {
        const d = new Date(p.lastPracticed);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      }),
  );

  return Array.from({ length: DAYS_TO_SHOW }, (_, i) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (DAYS_TO_SHOW - 1 - i));
    day.setHours(0, 0, 0, 0);
    return practicedDates.has(day.getTime()) ? "l1" : "";
  });
}

function RingChart({ pct, color, label }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <div className="ring-chart">
      <svg
        width="70"
        height="70"
        viewBox="0 0 70 70"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx="35"
          cy="35"
          r={r}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="6"
        />
        <circle
          cx="35"
          cy="35"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
          strokeLinecap="round"
        />
      </svg>
      <div className="ring-pct">{pct}%</div>
      <div className="ring-label">{label}</div>
    </div>
  );
}

export default function ProgressView() {
  const { currentUser } = useSelector((state) => state.user);

  const { isLoading: loadingSkills } = useGetAllSkillsQuery();
  const { isLoading: loadingProgress } = useGetAllUserSkillProgressQuery();
  const skillsWithStatus = useSelector(selectSkillsWithStatus);

  if (loadingSkills || loadingProgress)
    return <div className="loading">Loading...</div>;

  const avgCompletion = skillsWithStatus.length
    ? Math.round(
        skillsWithStatus.reduce((s, p) => s + p.progressPercent, 0) /
          skillsWithStatus.length,
      )
    : 0;

  const avgAccuracy = skillsWithStatus.length
    ? Math.round(
        skillsWithStatus.reduce((s, p) => s + p.accuracy, 0) /
          skillsWithStatus.length,
      )
    : 0;

  const heatmap = buildHeatmap(skillsWithStatus);

  const weeklyXp =
    skillsWithStatus.length > 0
      ? skillsWithStatus[0].weeklyXp
      : Array(7).fill(0);

  const maxXp = Math.max(...weeklyXp, 1);

  return (
    <div className="bento-dashboard">
      <header className="dash-header">
        <h1>My Progress</h1>
      </header>

      <div className="bento-grid">
        <div className="card span-2">
          <h3>Weekly XP</h3>
          <div className="bar-chart">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="bar-col">
                <span className="tooltip-text">{weeklyXp[i] || 0} XP</span>

                <div
                  className="bar"
                  style={{ height: `${((weeklyXp[i] || 0) / maxXp) * 100}%` }}
                />
                <span>{["S", "M", "T", "W", "T", "F", "S"][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Rings */}
        <div className="card span-2">
          <h3>Performance</h3>
          <div className="rings-container">
            <RingChart pct={avgAccuracy} color="#22C67A" label="Accuracy" />
            <RingChart pct={avgCompletion} color="#7B5EFF" label="Completion" />
            <RingChart
              pct={Math.min((currentUser?.CurrentLevel || 1) * 10, 100)}
              color="#FFB800"
              label="Level"
            />
          </div>
        </div>

        <div className="card span-4">
          <h3>Skills Breakdown</h3>
          <div className="skills-grid-list">
            {skillsWithStatus.map((skill) => {
              const meta = SKILL_METADATA[skill.name] || SKILL_METADATA.chat;
              const iconSrc =
                SKILL_IMAGE_MAP[skill.name] || SKILL_IMAGE_MAP.chat;

              return (
                <div key={skill.skillId} className="skill-row">
                  <div
                    className="skill-icon"
                    style={{
                      backgroundColor: `${meta.color}15`,
                      color: meta.color,
                    }}
                  >
                    <img src={iconSrc} alt={skill.name} />
                  </div>
                  <div className="skill-info">
                    <div className="skill-header">
                      <span>{skill.name}</span>
                      <span>{skill.progressPercent}%</span>
                    </div>
                    <div className="bar-bg">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${skill.progressPercent}%`,
                          backgroundColor: meta.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card span-4">
          <h3>Activity Heatmap</h3>
          <div className="heatmap">
            {heatmap.map((cls, i) => (
              <div
                key={i}
                className={`heat-cell ${cls}`}
                title={cls === "l1" ? "Practiced!" : ""}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
