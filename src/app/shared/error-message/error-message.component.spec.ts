import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorMessageComponent } from './error-message.component';

describe('ErrorMessageComponent', () => {
  let component: ErrorMessageComponent;
  let fixture: ComponentFixture<ErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const messageElement = compiled.querySelector('p');
    expect(messageElement?.textContent).toContain(
      'An error occurred. Please try again later.'
    );
  });

  it('should display custom message when provided', () => {
    const customMessage = 'Custom error message';
    component.message = customMessage;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const messageElement = compiled.querySelector('p');
    expect(messageElement?.textContent).toContain(customMessage);
  });

  it('should update message when input changes', () => {
    const firstMessage = 'First error';
    component.message = firstMessage;
    fixture.detectChanges();

    let compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain(firstMessage);

    const secondMessage = 'Second error';
    component.message = secondMessage;
    fixture.detectChanges();

    compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain(secondMessage);
  });
});
