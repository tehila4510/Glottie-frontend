import { useState, useEffect } from "react";
import "./types.css";

export default function OrderingCard({ question, onSelect, submitted }) {
  console.log("Rendering OrderingCard with question:", question);``
  const initialWords = question.options[0].optionText.split(" / ");
  
  const allWords = initialWords.map((word, index) => ({ word, id: index }));

  const [selectedWords, setSelectedWords] = useState([]);

  useEffect(() => {
    setSelectedWords([]);
  }, [question]);

  const handleWordClick = (clickedWord) => {
    if (submitted) return;
    const newSelection = [...selectedWords, clickedWord];
    setSelectedWords(newSelection);
    onSelect({ optionText: newSelection.map(s => s.word).join(" "), optionId: 999 });
  };

  const handleRemoveWord = (idToRemove) => {
    if (submitted) return;
    const newSelection = selectedWords.filter(s => s.id !== idToRemove);
    setSelectedWords(newSelection);
    onSelect({ optionText: newSelection.map(s => s.word).join(" "), optionId: 999 });
  };

  const remainingWords = allWords.filter(
    (w) => !selectedWords.some((s) => s.id === w.id)
  );

  return (
    <div className="quiz-card ordering-mode">
      <h3>Put the words in order:</h3>

      <div className="answer-zone" style={{ minHeight: '50px', border: '1px dashed #ccc', margin: '10px 0' }}>
        {selectedWords.map((item) => (
          <button key={item.id} className="word-bubble selected" onClick={() => handleRemoveWord(item.id)}>
            {item.word} ✕
          </button>
        ))}
      </div>

      <div className="words-container">
        {remainingWords.map((item) => (
          <button key={item.id} className="word-bubble" onClick={() => handleWordClick(item)}>
            {item.word}
          </button>
        ))}
      </div>
    </div>
  );
}