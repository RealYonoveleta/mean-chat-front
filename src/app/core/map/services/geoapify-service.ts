import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { StaticMapOptions } from '../geoapify';

@Injectable({
  providedIn: 'root',
})
export class GeoapifyService {
  buildGeoapifyStaticUrl(opts: StaticMapOptions): string {
    const {
      lat,
      lon,
      zoom = 15,
      width = 300,
      height = 300,
      style = 'osm-bright',
      color = 'f44336',
      markerSize = 'medium',
      retina = false,
    } = opts;

    const hexColor = `%23${color}`;
    const w = retina ? width * 2 : width;
    const h = retina ? height * 2 : height;

    const base = 'https://maps.geoapify.com/v1/staticmap';
    const params = [
      `style=${style}`,
      `width=${w}`,
      `height=${h}`,
      `center=lonlat:${lon},${lat}`,
      `zoom=${zoom}`,
      `marker=lonlat:${lon},${lat};type:material;color:${hexColor};size:${markerSize}`,
      `apiKey=${environment.geoapifyKey}`,
    ];

    return `${base}?${params.join('&')}`;
  }
}
