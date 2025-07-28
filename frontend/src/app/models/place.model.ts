export interface Place {
  id: number;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  type: string;
  tags: {
    [key: string]: string;
  };
}
