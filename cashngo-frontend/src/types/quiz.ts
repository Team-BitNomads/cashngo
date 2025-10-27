export interface Quiz {
  skill_name: string;
  questions: {
    text: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (success: boolean) => void;
}