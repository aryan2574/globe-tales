export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: Date;
  updatedAt: Date;
  roles: string[];
  isDeleted: boolean;
  experiencePoints?: number;
  level?: string;
}
