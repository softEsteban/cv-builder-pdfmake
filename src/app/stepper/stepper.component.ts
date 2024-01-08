import { Component } from '@angular/core';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css']
})
export class StepperComponent {
  activeStep = 1;

  showStep(stepNumber: number): void {
    this.activeStep = stepNumber;
  }
}
