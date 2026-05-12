import { Component, computed, inject, input } from '@angular/core';
import { GeoapifyService } from '../../core/map/services/geoapify-service';

@Component({
  selector: 'app-location-static-map',
  templateUrl: './location-static-map.component.html',
  styleUrls: ['./location-static-map.component.scss'],
})
export class LocationStaticMapComponent {
  lat = input.required<number>();
  lon = input.required<number>();
  zoom = input<number>(15);
  width = input<number>(260);
  height = input<number>(260);
  mapStyle = input<string>('osm-bright');
  markerColor = input<string>('f44336');
  markerSize = input<'small' | 'medium' | 'large'>('medium');
  retina = input<boolean>(true);

  private geoapifyService = inject(GeoapifyService);

  url = computed(() =>
    this.geoapifyService.buildGeoapifyStaticUrl({
      lat: this.lat(),
      lon: this.lon(),
      zoom: this.zoom(),
      width: this.width(),
      height: this.height(),
      style: this.mapStyle(),
      color: this.markerColor(),
      markerSize: this.markerSize(),
      retina: this.retina(),
    }),
  );
}
