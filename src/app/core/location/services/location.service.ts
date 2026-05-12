import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Location } from '../models/location';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  async getLocation(): Promise<Location> {
    const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, maximumAge: 0, timeout: 10000 });
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  }
}
