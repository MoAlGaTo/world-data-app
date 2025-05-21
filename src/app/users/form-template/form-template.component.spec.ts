import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTemplateComponent } from './form-template.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

describe('FormTemplateComponent', () => {
  let component: FormTemplateComponent;
  let fixture: ComponentFixture<FormTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormTemplateComponent,
        ReactiveFormsModule,
        RouterModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {},
              queryParams: {},
              data: {}
            }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe("Test of @Input() values", () => {

    it("should display redirectionQuestionMessage value", () => {
      expect(component.redirectionQuestionMessage).toBeUndefined();

      const newValue = "redirection message test";
      component.redirectionQuestionMessage = newValue;

      fixture.detectChanges();
      const submitButton: Element | null = fixture.nativeElement.querySelector('.submit-button');

      expect(component.redirectionQuestionMessage).toBe(newValue);

      expect(submitButton?.nextElementSibling?.textContent?.trim()).toBe(newValue);
    })

    it("should display buttonMessage value", () => {
      expect(component.buttonMessage).toBeUndefined();

      const newValue = "button message test";
      component.buttonMessage = newValue;

      fixture.detectChanges();
      const submitButton: Element | null = fixture.nativeElement.querySelector('.submit-button');

      expect(component.buttonMessage).toBe(newValue);

      expect(submitButton?.textContent?.trim()).toBe(newValue);
    })

    it("should display redirectionMessage value", () => {
      expect(component.redirectionMessage).toBeUndefined();

      const newValue = "redirection message test";
      component.redirectionMessage = newValue;

      fixture.detectChanges();
      const submitButton: Element | null = fixture.nativeElement.querySelector('.submit-button');

      expect(component.redirectionMessage).toBe(newValue);

      expect(submitButton?.nextElementSibling?.firstElementChild?.textContent?.trim()).toBe(newValue);
    })

    it("should display redirectionRoute value", () => {
      expect(component.redirectionMessage).toBeUndefined();
      const newValue = "redirectionRoute/message/test";
      component.redirectionMessage = newValue;
      expect(component.redirectionMessage).toBe(newValue);
    })
  })
});
