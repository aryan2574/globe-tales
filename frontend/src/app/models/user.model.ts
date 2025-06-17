export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
