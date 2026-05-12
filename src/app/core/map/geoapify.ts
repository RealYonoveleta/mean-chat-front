export interface StaticMapOptions {
  lat: number;
  lon: number;
  zoom?: number;
  width?: number;
  height?: number;
  style?: string;
  color?: string;
  markerSize?: 'small' | 'medium' | 'large';
  retina?: boolean;
}
