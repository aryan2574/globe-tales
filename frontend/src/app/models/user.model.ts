export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  latitude?: number | null;
  longitude?: number | null;
  createdAt: Date;
  updatedAt: Date;
}
