import { Component, input } from '@angular/core';
import { Location } from '../../../../core/location/models/location';
import { LocationStaticMapComponent } from '../../../../shared/location-static-map/location-static-map.component';

@Component({
  selector: 'app-content-location',
  templateUrl: './content-location.component.html',
  styleUrls: ['./content-location.component.scss'],
  imports: [LocationStaticMapComponent],
})
export class ContentLocationComponent {
  content = input.required<Location>();
}
