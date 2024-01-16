import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ExperienceItem } from 'src/app/interfaces/experience.interface';
import { AlertService } from 'src/app/services/alert.service';
import { CvDataService } from 'src/app/services/cv.data.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css']
})
export class ExperienceComponent {

  expForm: FormGroup;
  editExpMode: boolean = false;

  functionsList: string[] = ["Create amazing apps with Angular and .NET"];
  functionInput: string;

  isCheckedCurrentExp: boolean = false;
  experience: ExperienceItem[] = [
    // {
    //   id: crypto.randomUUID(),
    //   company: "IBM",
    //   charge: "Solutions Architech",
    //   description: "Improving and creating new solutions",
    //   functions: ["Gathering technical requeriments", "Creating structure models and plans"],
    //   dateStart: new Date('2021-01-01'),
    //   dateEnd: new Date('2021-01-01')
    // },
    // {
    //   id: crypto.randomUUID(),
    //   company: "IBM 2",
    //   charge: "Solutions Architech",
    //   description: "Improving and creating new solutions",
    //   functions: ["Gathering technical requeriments", "Creating structure models and plans"],
    //   dateStart: new Date('2021-01-01'),
    //   dateEnd: new Date('2021-01-01')
    // },
  ];

  experienceContent = [];

  constructor(
    private alertService: AlertService,
    private cvDataService: CvDataService
  ) {
    this.expForm = new FormGroup({
      id: new FormControl(''),
      company: new FormControl('', Validators.required),
      charge: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      functions: new FormArray([
        new FormGroup({
          name: new FormControl('', Validators.required)
        })
      ]),
      dateStart: new FormControl('', [Validators.required, this.dateValidator]),
      dateEnd: new FormControl('', []),
      current: new FormControl({ value: '', disabled: false })
    });
  }

  ngOnInit() {
    const storedData = this.cvDataService.getExperienceData();
    if (storedData) {
      this.experience = storedData;
    }

    const storedDataContent = this.cvDataService.getExperienceDataContent();
    if (storedDataContent) {
      this.experienceContent = storedData;
    }

    this.initializeExperienceContent();
  }

  dateValidator(control: FormControl) {
    const enteredDate = control.value;
    if (!enteredDate || isNaN(Date.parse(enteredDate))) {
      return { invalidDate: true };
    }
    return null;
  }

  formatList(list: [{ name: string }]) {
    if (!(list.length > 0)) {
      return [];
    }
    return list.map((obj) => obj.name);
  }

  initializeExperienceContent() {
    this.experienceContent = this.experience.map(item => [
      { text: item.company, bold: true, margin: [0, 10] },
      { text: item.charge, margin: [0, 5] },
      { text: new Date(item.dateStart).getFullYear() + ' - ' + new Date(item.dateEnd).getFullYear(), margin: [0, 5] },
      { text: 'Responsibilities:', margin: [0, 10] },
      { ul: item.functions.map(func => ({ text: func })), margin: [20, 0] },
    ])

    //Update data service
    this.cvDataService.setExperienceData(this.experience);
    this.cvDataService.setExperienceDataContent(this.experienceContent);
  }

  get functions(): FormArray {
    return this.expForm.get('functions') as FormArray;
  }

  triggerEditExperience(item: ExperienceItem) {
    this.expForm.patchValue(item);

    // Clear existing functions form array
    const functionsArray = this.expForm.get('functions') as FormArray;
    while (functionsArray.length > 0) {
      functionsArray.removeAt(0);
    }

    // Add form controls for each function in item.functions
    item.functions.forEach((func: string) => {
      functionsArray.push(
        new FormGroup({
          name: new FormControl(func, Validators.required)
        })
      );
    });

    this.editExpMode = true;

    if (item.current) {
      this.expForm.get('dateEnd')?.disable();
    } else {
      this.expForm.get('dateEnd')?.enable();
    }
  }

  addFunction() {
    const funct = new FormGroup({
      name: new FormControl('', Validators.required)
    });
    this.functions.push(funct);
  }

  deleteFunction(index: number) {
    this.functions.removeAt(index);
  }

  addExperience({ valid, value: { charge, description, company, dateStart, dateEnd, current } }: FormGroup) {
    if (!valid) {
      this.alertService.showMessageAlert("Some values are missing", 2);
    } else {

      const funcList = this.formatList(this.functions.value);

      const experienceData = {
        id: crypto.randomUUID(),
        charge,
        company,
        description,
        dateStart,
        dateEnd,
        functions: funcList,
        current
      };
      this.experience.push(experienceData);

      //Restore inputs
      this.expForm.reset();
      this.functions.clear();
      this.addFunction();

      this.initializeExperienceContent();
    }
  }

  editExperience({ valid, value: { id, company, charge, description, dateStart, dateEnd, current } }: FormGroup) {
    if (!valid) {
      this.alertService.showMessageAlert("Some values are missing", 2);
    } else {
      const funcList = this.formatList(this.functions.value);

      const editedExperienceItem: ExperienceItem = {
        id,
        company,
        charge,
        description,
        dateStart,
        dateEnd,
        functions: funcList,
        current
      };

      // Update the selected experience item with the edited values
      const selectedIndex = this.experience.findIndex(item => item.id === this.expForm.value.id);
      if (selectedIndex !== -1) {
        this.experience[selectedIndex] = editedExperienceItem;
      }

      this.expForm.reset();
      this.editExpMode = false;
    }
  }

  cancelEditExp() {
    this.editExpMode = false;
    this.expForm.reset();
  }

  onCheckboxChange() {
    this.isCheckedCurrentExp = this.expForm.value.current;
    if (this.isCheckedCurrentExp) {
      this.expForm.get('dateEnd')?.disable();
    } else {
      this.expForm.get('dateEnd')?.enable();
    }
  }
}
