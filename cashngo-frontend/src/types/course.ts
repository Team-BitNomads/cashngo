// Course data interface
export interface Course {
  id: string;
  title: string;
  instructor: string;
  coverImageUrl: string;
  tags: string[];
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  price: number;
  curriculum: string[];
  primarySkill: string;
}