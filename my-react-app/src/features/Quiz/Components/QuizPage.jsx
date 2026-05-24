import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { updateCurrentUser } from "../../User/Redux/userSlice"; // וודאי שהנתיב נכון
import { useLazyGetUserQuery } from '../../User/Redux/api';

import {
  useStartSessionMutation,
  useEndSessionMutation,
  useLazyGetNextQuestionQuery,
  useSubmitAnswerMutation,
  useLoseHeartMutation,
} from "../Redux/api";

//components
import QuizProgress from "./QuizProgress";
import AnswerFeedback from "./AnswerFeedback";
import QuizResult from "./QuizResult";
import GameOverDialog from "./GameOverDialog";
import QuestionFactory from "./QuestionFactory";

import "../styles/quizStyles.css";
const MAX_QUESTIONS = 10;

export default function QuizPage({ onClose }) {
  const dispatch = useDispatch();
  const { skillId: paramSkillId } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const [phase, setPhase] = useState("loading");
  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userTypedAnswer, setUserTypedAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionResult, setSessionResult] = useState(null);
  const [isGameOverOpen, setIsGameOverOpen] = useState(false);

  const [startSession] = useStartSessionMutation();
  const [endSession] = useEndSessionMutation();
  const [fetchNext] = useLazyGetNextQuestionQuery();
  const [submitAnswer, { isLoading: submitting }] = useSubmitAnswerMutation();
  const [loseHeart] = useLoseHeartMutation();
  const [getUser] = useLazyGetUserQuery();

  const hasInitialized = useRef(false);


useEffect(() => {
  const handleBeforeUnload = (e) => {
    if (phase === "question" || phase === "feedback") {
      e.preventDefault();
      e.returnValue = ""; 
    }
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  return () => window.removeEventListener("beforeunload", handleBeforeUnload);
}, [phase]);
const finishSession = useCallback(
  async (sid) => {
    setPhase("loading");
    try {
      const result = await endSession(sid || sessionId).unwrap();
      const updatedUser = await getUser(currentUser.userId).unwrap();
      dispatch(updateCurrentUser(updatedUser));
      setSessionResult(result);
      setPhase("result");
    } catch (err) {
      console.error("Failed to finish session", err);
      onClose(); 
    }
  },
  [sessionId, endSession, dispatch, onClose, currentUser.userId, getUser] // הוספתי תלויות חסרות
);
  const loadNextQuestion = useCallback(
    async (sid, count) => {
      setPhase("loading");
      setFeedback(null);
      setSelectedOption(null);
      setUserTypedAnswer("");

      try {
        const currentSid = sid || sessionId;
        const q = await fetchNext({
          sessionId: currentSid,
          skillId: Number(paramSkillId),
        }).unwrap();

        if (!q) return finishSession(currentSid);

        setQuestion(q);
        setQuestionCount(count + 1);
        setPhase("question");
      } catch (err) {
        console.error("Failed to load next question", err);
        finishSession(sid || sessionId);
      }
    },
    [sessionId, paramSkillId, fetchNext, finishSession],
  );

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const init = async () => {
      try {
        const sid = await startSession().unwrap();
        setSessionId(sid);
        await loadNextQuestion(sid, 0);
      } catch (err) {
        console.error("Failed to start session", err);
      }
    };

    init();
  }, [startSession, loadNextQuestion]);



const handleAttemptClose = () => {
  if (phase === "question" || phase === "feedback") {
    const confirmExit = window.confirm("Are you sure you want to leave? All your progress in this quiz will be lost.");
    if (confirmExit) {
      onClose();
    }
  } else {
    onClose(); 
  }
};

  const handleSubmit = async () => {
    // const mask = question.questionTypeMask;
    // const isText = mask & 2 || mask & 512;
    // const isOrdering = mask & 8;

    // let userAnswerText = "";
    // let selectedOptionId = question.options?.[0]?.optionId || 0;

    // // let userAnswerText = isText
    // //   ? userTypedAnswer
    // //   : selectedOption?.optionText || "";
    // // let selectedOptionId = isOrdering ? 999 : selectedOption?.optionId || 0;

    // if (isText) {
    //   userAnswerText = userTypedAnswer;
    // } else if (isOrdering) {
    //   userAnswerText = selectedOption?.optionText || "";
    //   selectedOptionId = 999;
    // } else {
    //   userAnswerText = selectedOption?.optionText || "";
    //   selectedOptionId = selectedOption?.optionId || selectedOptionId;
    // }
const userAnswerText = selectedOption ? selectedOption.optionText : userTypedAnswer;
  const selectedOptionId = selectedOption ? selectedOption.optionId : 0;
    const dto = {
      answerRecordId: question.answerRecordId,
      userId: currentUser.userId,
      questionId: question.questionId,
      sessionId,
     userAnswerText: userAnswerText, 
    selectedOptionId: selectedOptionId,
    };

    try {
      const review = await submitAnswer({ answerDto: dto }).unwrap();
      setFeedback(review);
      setPhase("feedback");

      if (review.isCorrect) {
        setCorrectCount((c) => c + 1);
      } else {
        const result = await loseHeart().unwrap();
        dispatch(updateCurrentUser({ hearts: result.hearts }));
        if (!result.hasHearts) setIsGameOverOpen(true);
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
    }
  };
  const handlePlayAgain = () => {
    hasInitialized.current = false;
    setSessionId(null);
    setQuestionCount(0);
    setCorrectCount(0);
    setPhase("loading");
  };
const handleType = useCallback((val) => {
  setUserTypedAnswer(val);
}, []);
  if (phase === "result") {
    return (
      <QuizResult
        result={sessionResult}
        correctCount={correctCount}
        totalQuestions={questionCount}
        onHome={onClose}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  return (
    <div className="quiz-wrapper">
      <QuizProgress
        current={questionCount}
        total={MAX_QUESTIONS}
        hearts={currentUser?.hearts ?? 0}
        onClose={handleAttemptClose}
      />

      {phase === "loading" ? (
        <div className="quiz-loading">
          <div className="quiz-spinner" />
        </div>
      ) : (
        <>
          <QuestionFactory
            question={question}
            selectedOption={selectedOption}
            onSelect={setSelectedOption}
            userTypedAnswer={userTypedAnswer}
            onType={handleType}
            submitted={phase === "feedback"}
            feedback={feedback}
          />

          {phase === "question" && (
            <button
              className="quiz-submit-btn"
              disabled={submitting || (!selectedOption && !userTypedAnswer)}
              onClick={handleSubmit}
            >
              {submitting ? "Checking..." : "✅ Submit Answer"}
            </button>
          )}

          {phase === "feedback" && (
            <AnswerFeedback
              feedback={feedback}
              onNext={() =>
                questionCount >= MAX_QUESTIONS
                  ? finishSession()
                  : loadNextQuestion(sessionId, questionCount)
              }
            />
          )}
        </>
      )}

      <GameOverDialog open={isGameOverOpen} onConfirm={() => finishSession()} />
    </div>
  );
}
