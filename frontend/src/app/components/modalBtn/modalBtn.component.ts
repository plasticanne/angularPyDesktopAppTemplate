import { Component, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
 
@Component({
  selector: 'modalBtn-component',
  templateUrl: 'modalBtn.component.html',
  styleUrls: ['modalBtn.component.css'],
  //styles:[`.modal-dialog{overflow:hidden;}`]
})
export class ModalBtnComponent {
  @Input() hasHeader
  @Input() hasCloseBtn
  @Input() keyboard
  @ViewChild('childModal') public childModal:ModalDirective;
constructor(){
    this.hasHeader == undefined &&(this.hasHeader=true)
    this.hasCloseBtn == undefined &&(this.hasCloseBtn=true)
    this.keyboard == undefined &&(this.keyboard=true)
}
  public showChildModal():void {
    this.childModal.show();
  }
 
  public hideChildModal():void {
    this.childModal.hide();
  }
  @Output() isHidden: EventEmitter<string> = new EventEmitter<string>();
  public onHidden(event) {
      this.isHidden.emit(event)
  }
  

}