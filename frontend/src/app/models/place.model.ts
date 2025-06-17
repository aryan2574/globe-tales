export interface Place {
  id: number;
  name: string;
  description?: string;
  coordinates: [number, number];
  type: string;
  tags: {
    [key: string]: string;
  };
}
