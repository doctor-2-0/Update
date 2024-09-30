declare module 'react-leaflet' {
  import { LatLngExpression, MapOptions, MarkerOptions, PopupOptions, Map } from 'leaflet';
  import { ReactNode } from 'react';

  export interface MapContainerProps extends MapOptions {
    center: LatLngExpression;
    zoom: number;
    children?: ReactNode;
  }

  export const MapContainer: React.FC<MapContainerProps>;

  export interface TileLayerProps {
    url: string;
    attribution?: string;
  }

  export const TileLayer: React.FC<TileLayerProps>;

  export interface MarkerProps extends MarkerOptions {
      position: LatLngExpression;
      children?: ReactNode;
  }
    
  export const Marker: React.FC<MarkerProps>;

  export interface PopupProps extends PopupOptions {
    children?: ReactNode;
  }

  export const Popup: React.FC<PopupProps>;

  export function useMap(): Map;
}