import MultipleChoice    from "./types/MultipleChoice";
import TextEntry         from "./types/TextEntry";
import ListeningCard     from "./types/ListeningCard";
import OrderingCard      from "./types/OrderingCard";
import TranslationCard   from "./types/TranslationCard";
import PronunciationCard from "./types/PronunciationCard";
import MatchingCard      from "./types/MatchingCard";
import DragAndDropCard   from "./types/DragAndDropCard";
import MultipleAnswerCard from "./types/MultipleAnswerCard";


 const QuestionFactory =({ question, ...props }) => {

  if (!question) return null;
  const mask = question.questionTypeMask;

  // לוגיקת ה-Mask שלך נשארת בדיוק אותו דבר
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

export default QuestionFactory;