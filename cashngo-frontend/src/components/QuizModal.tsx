import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';
import type { QuizModalProps } from '@/types/quiz';

// Sample quiz questions (in a real app, these would come from an API)
const QUIZ_QUESTIONS = [
  {
    text: "Which of these best describes a 'function' in programming?",
    options: [
      "A container for storing data",
      "A reusable block of code that performs a specific task",
      "A way to style web pages",
      "A type of variable"
    ],
    correctAnswer: 1
  },
  {
    text: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyper Transfer Markup Logic",
      "Home Tool Markup Language"
    ],
    correctAnswer: 0
  },
  {
    text: "What is the purpose of CSS in web development?",
    options: [
      "To create interactive features",
      "To store data",
      "To style and layout web pages",
      "To handle server operations"
    ],
    correctAnswer: 2
  }
];

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Calculate score
    const correctAnswers = QUIZ_QUESTIONS.filter(
      (q, i) => q.correctAnswer === selectedAnswers[i]
    ).length;
    const percentageCorrect = (correctAnswers / QUIZ_QUESTIONS.length) * 100;
    
    // Consider 70% as passing score
    const passed = percentageCorrect >= 70;
    
    // Simulate API call delay
    setTimeout(() => {
      onComplete(passed);
      setIsSubmitting(false);
      setCurrentQuestion(0);
      setSelectedAnswers([]);
    }, 1000);
  };

  const question = QUIZ_QUESTIONS[currentQuestion];
  const hasAnswered = selectedAnswers[currentQuestion] !== undefined;

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      if (!isSubmitting) onClose();
    }}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="h-6 w-6 text-cyan-400" />
            General Skills Assessment
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-slate-400">
              Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
            </div>
            <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-cyan-500 quiz-progress-bar`}
                style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-4">
              {question.text}
            </h3>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-cyan-500 bg-cyan-500/20 text-white'
                      : 'border-slate-700 hover:border-slate-600 text-slate-300 hover:bg-slate-800/50'
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isSubmitting}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-end mt-6 pt-6 border-t border-slate-800">
            <Button
              onClick={handleNext}
              disabled={!hasAnswered || isSubmitting}
              className="px-8 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-medium"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  Processing...
                </span>
              ) : currentQuestion === QUIZ_QUESTIONS.length - 1 ? (
                'Submit'
              ) : (
                'Next Question'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;