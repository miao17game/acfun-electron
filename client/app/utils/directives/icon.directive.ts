import { Directive, ElementRef, Input, OnInit, OnChanges } from "@angular/core";

@Directive({
  selector: "icon"
})
export class IconDirective implements OnInit, OnChanges {
  @Input() type: string;
  @Input() class: string;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.el.nativeElement.className = `fa fa-${this.type} ${this.class || ""}`;
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    for (const name in changes) {
      if (name === "type") {
        this.el.nativeElement.className = `fa fa-${this.type} ${this.class || ""}`;
      }
    }
  }
}
