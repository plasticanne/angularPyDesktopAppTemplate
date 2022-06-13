import { Component, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements AfterViewInit{
  @Input() message

  @ViewChild('container') container: ElementRef;

  constructor(){}

  ngAfterViewInit() {

    this.container.nativeElement .scrollTop = this.container.nativeElement.scrollHeight;
  }
  ngAfterViewChecked(): void {
      //Called after every check of the component's view. Applies to components only.
      //Add 'implements AfterViewChecked' to the class.
      this.container.nativeElement .scrollTop = this.container.nativeElement.scrollHeight;
  }
}

@NgModule({
    imports: [CommonModule],
    exports: [MessageComponent],
    declarations: [MessageComponent]
})
export class MessageModule { }
