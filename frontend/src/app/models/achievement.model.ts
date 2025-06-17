export interface Achievement {
  code: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  icon?: string;
  points: number;
  requirements?: {
    type: string;
    value: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
