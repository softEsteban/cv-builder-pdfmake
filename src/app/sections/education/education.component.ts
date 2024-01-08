import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EducationItem } from 'src/app/interfaces/education.interface';
import { AlertService } from 'src/app/services/alert.service';
import { CvDataService } from 'src/app/services/cv.data.service';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent {

  eduForm: FormGroup;
  editEduMode: boolean = false;

  isCheckedCurrentEdu: boolean = false;

  education: EducationItem[] = [
    // {
    //   id: crypto.randomUUID(),
    //   institute: "Universidad de Caldas",
    //   degree: "Software development diplomat",
    //   dateStart: new Date('2021-01-01'),
    //   dateEnd: null,
    //   current: true
    // },
    // {
    //   id: crypto.randomUUID(),
    //   institute: "Universidad de Caldas",
    //   degree: "Software development diplomat",
    //   dateStart: new Date('2021-01-01'),
    //   dateEnd: new Date('2021-01-01'),
    //   current: false
    // },
    // {
    //   id: crypto.randomUUID(),
    //   institute: "Universidad de Caldas",
    //   degree: "Software development diplomat",
    //   dateStart: new Date('2021-01-01'),
    //   dateEnd: new Date('2021-01-01'),
    //   current: false
    // },
    // {
    //   id: crypto.randomUUID(),
    //   institute: "Universidad de Caldas",
    //   degree: "Software development diplomat",
    //   dateStart: new Date('2021-01-01'),
    //   dateEnd: new Date('2021-01-01'),
    //   current: false
    // },
  ];

  educationContent = [];

  constructor(
    private alertService: AlertService,
    private cvDataService: CvDataService
  ) {
    this.eduForm = new FormGroup({
      id: new FormControl(''),
      degree: new FormControl(null, Validators.required),
      institute: new FormControl('', Validators.required),
      dateStart: new FormControl('', [Validators.required, this.dateValidator]),
      dateEnd: new FormControl('', []),
      current: new FormControl({ value: '', disabled: false })
    });
  }

  ngOnInit() {

    const storedData = this.cvDataService.getEducationData();
    if (storedData) {
      this.education = storedData;
    }

    const storedDataContent = this.cvDataService.getEducationDataContent();
    if (storedDataContent) {
      this.educationContent = storedData;
    }

    this.initializeEducationContent();
  }

  dateValidator(control: FormControl) {
    const enteredDate = control.value;
    if (!enteredDate || isNaN(Date.parse(enteredDate))) {
      return { invalidDate: true };
    }
    return null;
  }

  addEducation({ valid, value: { degree, institute, dateStart, dateEnd, current } }: FormGroup) {
    if (!valid) {
      this.alertService.showMessageAlert("Some values are missing", 2);
    } else {
      const educationData = {
        id: crypto.randomUUID(),
        degree,
        institute,
        dateStart,
        dateEnd,
        current
      };
      this.education.push(educationData);
      this.eduForm.reset();
      this.initializeEducationContent();
    }
  }

  triggerEditEducation(item: EducationItem) {
    this.eduForm.patchValue(item);
    this.editEduMode = true;

    if (item.current) {
      this.eduForm.get('dateEnd')?.disable();
    } else {
      this.eduForm.get('dateEnd')?.enable();
    }
  }

  editEducation({ valid, value: { id, degree, institute, dateStart, dateEnd, current } }: FormGroup) {
    if (!valid) {
      this.alertService.showMessageAlert("Some values are missing", 2);
    } else {
      const editedEducationItem: EducationItem = {
        id,
        degree,
        institute,
        dateStart,
        dateEnd,
        current
      };

      // Update the selected education item with the edited values
      const selectedIndex = this.education.findIndex(item => item.id === this.eduForm.value.id);
      if (selectedIndex !== -1) {
        this.education[selectedIndex] = editedEducationItem;
      }

      this.eduForm.reset();
      this.editEduMode = false;
    }
  }

  cancelEditEdu() {
    this.editEduMode = false;
    this.eduForm.reset();
  }

  initializeEducationContent() {
    this.educationContent = this.education.map(item => [
      { text: item.degree, bold: true, margin: [0, 10] },
      { text: item.institute, margin: [0, 5] },
      { text: new Date(item.dateStart).getFullYear() + ' - ' + new Date(item.dateEnd).getFullYear(), margin: [0, 5] },
    ]);

    //Update data service
    this.cvDataService.setEducationData(this.education);
    this.cvDataService.setEducationDataContent(this.educationContent);
  }

  onCheckboxChange() {
    this.isCheckedCurrentEdu = this.eduForm.value.current;
    if (this.isCheckedCurrentEdu) {
      this.eduForm.get('dateEnd')?.disable();
    } else {
      this.eduForm.get('dateEnd')?.enable();
    }
  }
}
