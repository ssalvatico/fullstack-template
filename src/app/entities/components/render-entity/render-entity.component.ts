import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-entities-render-entity',
  standalone: false,
  templateUrl: './render-entity.component.html',
  styleUrl: './render-entity.component.css',
})
export class RenderEntityComponent {
  @Input()
  public entityItems:unknown[] = []
}
