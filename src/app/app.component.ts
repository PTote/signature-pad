import { Component, ViewChild } from '@angular/core';
import { SignaturePadComponent } from './components/signature-pad/signature-pad.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('signaturePad') signaturePad!: SignaturePadComponent

  title = 'signature-pad';

  tester(){
    const tester = this.signaturePad.emitBase64IMG();
    console.log(tester);
  }
}
