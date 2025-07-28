export interface RouteInfo {
  distance: number;
  duration: number;
  geometry: {
    coordinates: [number, number][];
    type: string;
  };
  steps: RouteStep[];
}

export interface RouteStep {
  distance: number;
  duration: number;
  instruction: string;
  geometry: {
    coordinates: [number, number][];
    type: string;
  };
}
