import { createSelector } from '@reduxjs/toolkit';
import { baseApi } from '../../../app/baseApi';

export const SKILL_METADATA = {
  Vocabulary: { color: '#3B8FFF' },
  Grammar: { color: '#7B5EFF' },
  Verbs: { color: '#FFB800' },
  Listening: { color: '#FF5C7A' },
  Reading: { color: '#22C67A' },
  Writing: { color: '#FF8C42' },
  Pronunciation: { color: '#5B8AFF' },
  Phrases: { color: '#C084FC' },
  chat: { color: '#6b29d6' },
};

const selectSkillsResult = baseApi.endpoints.getAllSkills.select();
const selectProgressResult = baseApi.endpoints.getAllUserSkillProgress.select();
const selectCurrentUser = (state) => state.user.currentUser;

export const selectSkillsWithStatus = createSelector(
  [selectSkillsResult, selectProgressResult, selectCurrentUser],
  (skillsResult, progressResult, currentUser) => {
    const skills = skillsResult.data || [];
    const progressList = progressResult.data || [];
    const currentLevel = currentUser?.currentLevel || 1;

    return skills.map((skill) => {
      const userProgress = progressList.find((p) => p.skillId === skill.skillId);
      const meta = SKILL_METADATA[skill.name] || SKILL_METADATA.chat;
      
      return {
        ...skill,
        color: meta.color,
        unlocked: currentLevel >= skill.recommendedLevelId,
        progressPercent: userProgress?.progressPercent || 0,
        accuracy: userProgress?.accuracy || 0,
        lastPracticed: userProgress?.lastPracticed || null,
        weeklyXp: userProgress?.weeklyXp || [],
      };
    });
  }
);