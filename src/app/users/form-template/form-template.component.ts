import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-form-template',
  imports: [
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './form-template.component.html',
  styleUrl: './form-template.component.css'
})
export class FormTemplateComponent implements AfterViewInit {
  @Input() form: FormGroup
  @Input() buttonMessage: string
  @Input() redirectionQuestionMessage: string
  @Input() redirectionMessage: string
  @Input() redirectionRoute: string

  @Output() submitButtonClick: EventEmitter<void> = new EventEmitter<void>()

  ngAfterViewInit() {
    const video = document.querySelector('.background') as HTMLVideoElement;
    setTimeout(() => {
      video.muted = true;
      video.play();
    }, 700);
  }

  protected onSubmitButtonClick(): void {
    this.submitButtonClick.emit()
  }
}
