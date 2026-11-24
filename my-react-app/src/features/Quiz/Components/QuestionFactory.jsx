import { Fragment } from "react";
import MultipleChoice from "./Types/MultipleChoice";
import TextEntry from "./Types/TextEntry";
import ListeningCard from "./Types/ListeningCard";
import OrderingCard from "./Types/OrderingCard";
import TranslationCard from "./Types/TranslationCard";
import PronunciationCard from "./Types/PronunciationCard";
import MatchingCard from "./Types/MatchingCard";
import DragAndDropCard from "./Types/DragAndDropCard";
import MultipleAnswerCard from "./Types/MultipleAnswerCard";

const QuestionFactory = ({ question, onSpeak, ...props }) => {
  if (!question) return null;
  const mask = question.questionTypeMask;

  const getComponent = () => {
    if (mask & 2048) return <PronunciationCard question={question} {...props} />;
    if (mask & 131072) return <TranslationCard question={question} {...props} />;
    if (mask & 65536) return <MatchingCard question={question} {...props} />;
    if (mask & 1024) return <DragAndDropCard question={question} {...props} />;
    if (mask & 8) return <OrderingCard question={question} {...props} />;
    if (mask & 32 || mask & 64) return <ListeningCard question={question} {...props} />;
    if (mask & 4096) return <MultipleAnswerCard question={question} {...props} />;
    if (mask & 16 || mask & 256) return <TextEntry question={question} {...props} />;
    
    if (mask & 2 || mask & 512) {
      if (question.options?.length === 1) return <TextEntry question={question} {...props} />;
      return <MultipleChoice question={question} {...props} />;
    }
    return <MultipleChoice question={question} {...props} />;
  };

  return (
    <>
      <div className="question-audio-wrapper">
        <button 
          className="audio-replay-btn" 
          onClick={() => onSpeak(question.questionText)}
          title="Play Question"
        >
          🔊
        </button>
      </div>

      {/* key remounts the card for every new question, which resets its local state */}
      <Fragment key={question.questionId}>{getComponent()}</Fragment>
    </>
  );
};

export default QuestionFactory;