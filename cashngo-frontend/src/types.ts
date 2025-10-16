export interface Gig {
id: string;
title: string;
price: number;
is_locked: boolean;
required_skill?: string;
}
// Add these new types
export interface Badge {
  id: string;
  name: string;
  icon_url: string; // URL for a small badge icon
}

export interface UserProfile {
  name: string;
  major: string;
  current_balance: number;
  badges: Badge[];
}
export interface QuizQuestion {
text: string;
options: string[];
correct_answer_index: number; // For now, we get this from the API. In a real app, you'd verify on the backend.
}
export interface Quiz {
quiz_id: string;
skill_name: string;
questions: QuizQuestion[];
}