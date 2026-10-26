import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-entities-render-entity',
  imports: [],
  template: `<p>render-entity.component works!</p>`,
  styleUrl: './render-entity.component.css',
})
export class RenderEntityComponent {
  @Input()
  public entityList:[unknown][] = []
}
