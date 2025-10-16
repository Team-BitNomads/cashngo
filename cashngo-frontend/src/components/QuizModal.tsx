import React, { useState } from 'react';
import type { Quiz } from '../types';

interface QuizModalProps {
  quiz: Quiz;
  onClose: () => void;
  onSubmit: (answers: number[]) => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ quiz, onClose, onSubmit }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(Array(quiz.questions.length).fill(-1));

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    // In a real app, you'd check if all questions are answered
    onSubmit(selectedAnswers);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl transform transition-all">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Skill Quiz: <span className="text-green-600">{quiz.skill_name}</span>
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>

        <div className="space-y-6">
          {quiz.questions.map((q, qIndex) => (
            <div key={qIndex}>
              <p className="font-semibold text-lg">{qIndex + 1}. {q.text}</p>
              <div className="mt-2 space-y-2">
                {q.options.map((option, oIndex) => (
                  <label key={oIndex} className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${selectedAnswers[qIndex] === oIndex ? 'bg-green-100 border-green-500' : 'border-gray-200 hover:border-green-300'}`}>
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      checked={selectedAnswers[qIndex] === oIndex}
                      onChange={() => handleAnswerSelect(qIndex, oIndex)}
                      className="hidden"
                    />
                    <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mr-3 ${selectedAnswers[qIndex] === oIndex ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}></span>
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t pt-4 flex justify-end">
          <button onClick={handleSubmit} className="px-6 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-700">
            Submit Answers
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;