import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CvService } from './cv.service';
import { Subject, debounceTime } from 'rxjs';

export interface CVFormData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    headline: string;
    profile: string;
  };
  education: EducationItem[];
  experience: ExperienceItem[];
}

export interface EducationItem {
  id: string;
  institute: string;
  degree: string;
  dateStart: Date;
  dateEnd: Date;
}

export interface ExperienceItem {
  id: string;
  company: string;
  charge: string;
  description: string;
  functions: string[];
  dateStart: Date;
  dateEnd: Date;
}

@Component({
  selector: 'app-cv-builder',
  templateUrl: './cv-builder.component.html',
  styleUrls: ['./cv-builder.component.scss']
})
export class CVBuilderComponent implements OnInit {

  @ViewChild('skillsSelect') skillsSelect: any;

  cvForm: FormGroup;
  eduForm: FormGroup;
  expForm: FormGroup;

  functionsList: string[] = ["Create amazing apps with Angular and .NET"];
  functionInput: string;

  editEduMode: boolean = false;
  editExpMode: boolean = false;

  userName: string = "";

  alertMessage: string = "";
  alertType: string = "";
  showAlert: boolean = false;

  pdfSrc: SafeResourceUrl;
  pdfDefinition: any = {};

  selectedSkill: string = "";
  searchQuery: string = "";
  searchQuery$: Subject<string> = new Subject<string>();

  showSpinner: boolean = false;
  skills: string[] = ['Nodejs', 'Angular', 'Nestjs', 'Vuejs', 'PostgreSQL', 'SQL Server', 'MySQL', 'MongoDB'];
  skillsRes: string[] = [];

  education: EducationItem[] = [
    // {
    //   id: crypto.randomUUID(),
    //   institute: "Universidad de Caldas",
    //   degree: "Software development diplomat",
    //   dateStart: new Date('2021-01-01'),
    //   dateEnd: new Date('2021-01-01')
    // }
  ];

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

  educationContent = [];
  experienceContent = [];


  constructor(
    private sanitizer: DomSanitizer,
    private cvService: CvService) {

    this.cvForm = new FormGroup({
      name: new FormControl('Esteban Toro Aristizabal', Validators.required),
      email: new FormControl('estebantoro.greenman@gmail.com', [Validators.required, Validators.email]),
      phone: new FormControl('+57 3107905771', Validators.required),
      headline: new FormControl('Fullstack Junior Developer', Validators.required),
      profile: new FormControl('Software developer with web fullstack development and RPA automations', Validators.required)
    });

    this.eduForm = new FormGroup({
      id: new FormControl(''),
      degree: new FormControl(null, Validators.required),
      institute: new FormControl('', Validators.required),
      dateStart: new FormControl('', [Validators.required, this.dateValidator]),
      dateEnd: new FormControl('', [Validators.required, this.dateValidator])
    });

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
      dateEnd: new FormControl('', [Validators.required, this.dateValidator])
    });

  }


  ngOnInit() {
    // Initialize educationContent and experienceContent arrays
    this.initializeEducationContent();
    this.initializeExperienceContent();
  }

  dateValidator(control: FormControl) {
    const enteredDate = control.value;
    if (!enteredDate || isNaN(Date.parse(enteredDate))) {
      return { invalidDate: true };
    }
    return null;
  }

  initializePdfDefinition() {
    this.pdfDefinition = {
      content: [
        {
          columns: [
            {
              stack: [
                { text: this.cvForm.value.name || '', fontSize: 18, bold: true },
                { text: this.cvForm.value.headline || '', fontSize: 14, margin: [0, 12] },
                { text: this.cvForm.value.email || '', fontSize: 10, },
                { text: this.cvForm.value.phone || '', fontSize: 10, margin: [0, 12] },
                { ul: this.skills },
              ],
              width: '30%',
            },
            {
              stack: [
                { text: 'Profile', style: 'sectionHeading', margin: [0, 20], color: '#000', background: '#00FF00' },
                { text: this.cvForm.value.profile || '', margin: [0, 10] },
                { text: 'Experience', style: 'sectionHeading', margin: [0, 20], color: '#000', background: '#00FF00' },
                ...this.experienceContent,
                { text: 'Education', style: 'sectionHeading', margin: [0, 20], color: '#000', background: '#00FF00' },
                ...this.educationContent,
              ],
              width: '70%',
            },
          ],
        },
      ],
      styles: {
        sectionHeading: { fontSize: 14, bold: true, margin: [0, 10] },
      },
    };
  }

  // Function to initialize educationContent based on education array
  initializeEducationContent() {
    this.educationContent = this.education.map(item => [
      { text: item.degree, bold: true, margin: [0, 10] },
      { text: item.institute, margin: [0, 5] },
      { text: new Date(item.dateStart).getFullYear() + ' - ' + new Date(item.dateEnd).getFullYear(), margin: [0, 5] },
    ]);
  }

  // Function to initialize experienceContent based on experience array
  initializeExperienceContent() {
    this.experienceContent = this.experience.map(item => [
      { text: item.company, bold: true, margin: [0, 10] },
      { text: 'Position: ' + item.charge, margin: [0, 5] },
      { text: 'Duration: ' + new Date(item.dateStart).getFullYear() + ' - ' + new Date(item.dateEnd).getFullYear(), margin: [0, 5] },
      { text: 'Responsibilities:', margin: [0, 10] },
      { ul: item.functions.map(func => ({ text: func })), margin: [20, 0] },
    ])
  }

  viewPdf() {
    this.userName = this.cvForm.value.name || '';
    this.pdfDefinition = {
      content: [
        {
          columns: [
            {
              stack: [
                { text: this.cvForm.value.name || '', fontSize: 18, bold: true },
                { text: this.cvForm.value.headline || '', fontSize: 14, margin: [0, 12] },
                { text: this.cvForm.value.email || '', fontSize: 10, },
                { text: this.cvForm.value.phone || '', fontSize: 10, margin: [0, 12] },
                { ul: null },
              ],
              width: '30%',
            },
            {
              stack: [
                { text: 'Profile', style: 'sectionHeading', margin: [0, 20], color: '#000', background: '#00FF00' },
                { text: this.cvForm.value.profile || '', margin: [0, 10] },
                { text: 'Experience', style: 'sectionHeading', margin: [0, 20], color: '#000', background: '#00FF00' },
                ...this.experienceContent,
                { text: 'Education', style: 'sectionHeading', margin: [0, 20], color: '#000', background: '#00FF00' },
                ...this.educationContent,
              ],
              width: '70%',
            },
          ],
        },
      ],
      styles: {
        sectionHeading: { fontSize: 14, bold: true, margin: [0, 10] },
      },
    };
    this.pdfDefinition.content[0].columns[0].stack[4].ul = this.skills.map(skill => ({ text: skill }));

    const pdfDocGenerator = pdfMake.createPdf(this.pdfDefinition);

    // Add to the DOM
    pdfDocGenerator.getBase64((data) => {
      const base64 = `data:application/pdf;base64,${data}`;
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(base64);
    });

    // Scroll to the PDF section
    setTimeout(() => {
      const cvSection = document.getElementById('cv-section');
      window.scrollTo({ top: cvSection.offsetTop, behavior: 'smooth' });

    }, 500);
  }

  downloadPdf() {
    this.userName = this.cvForm.value.name || '';

    this.pdfDefinition = {
      content: [
        {
          columns: [
            {
              stack: [
                { text: this.cvForm.value.name || '', fontSize: 18, bold: true },
                { text: this.cvForm.value.headline || '', fontSize: 14, margin: [0, 12] },
                { text: this.cvForm.value.email || '', fontSize: 10, },
                { text: this.cvForm.value.phone || '', fontSize: 10, margin: [0, 12] },
                { ul: [] },
              ],
              width: '30%',
            },
            {
              stack: [
                { text: 'Profile', style: 'sectionHeading', margin: [0, 20], color: '#000', background: '#00FF00' },
                { text: this.cvForm.value.profile || '', margin: [0, 10] },
                { text: 'Experience', style: 'sectionHeading', margin: [0, 20], color: '#000', background: '#00FF00' },
                ...this.experienceContent,
                { text: 'Education', style: 'sectionHeading', margin: [0, 20], color: '#000', background: '#00FF00' },
                ...this.educationContent,
              ],
              width: '70%',
            },
          ],
        },
      ],
      styles: {
        sectionHeading: { fontSize: 14, bold: true, margin: [0, 10] },
      },
    };
    this.pdfDefinition.content[0].columns[0].stack[4].ul = this.skills.map(skill => ({ text: skill }));

    const pdfDocGenerator = pdfMake.createPdf(this.pdfDefinition);
    pdfDocGenerator.download(`CV-${this.userName.replace(" ", "-")}.pdf`);
  }




  addEducation({ valid, value: { degree, institute, dateStart, dateEnd } }: FormGroup) {
    if (!valid) {
      this.showMessageAlert("Some values are missing", 2);
    } else {
      const educationData = {
        id: crypto.randomUUID(),
        degree,
        institute,
        dateStart,
        dateEnd,
      };
      this.education.push(educationData);
      this.eduForm.reset();
      this.initializeEducationContent();
    }
  }

  triggerEditEducation(item: EducationItem) {
    this.eduForm.patchValue(item);
    this.editEduMode = true;
  }

  editEducation({ valid, value: { id, degree, institute, dateStart, dateEnd } }: FormGroup) {
    if (!valid) {
      this.showMessageAlert("Some values are missing", 2);
    } else {
      const editedEducationItem: EducationItem = {
        id,
        degree,
        institute,
        dateStart,
        dateEnd,
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








  get functions(): FormArray {
    return this.expForm.get('functions') as FormArray;
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







  addExperience({ valid, value: { charge, description, company, dateStart, dateEnd } }: FormGroup) {
    if (!valid) {
      this.showMessageAlert("Some values are missing", 2);
    } else {

      const funcList = this.formatList(this.functions.value);

      const experienceData = {
        id: crypto.randomUUID(),
        charge,
        company,
        description,
        dateStart,
        dateEnd,
        functions: funcList
      };
      this.experience.push(experienceData);


      //Restore inputs
      this.expForm.reset();
      this.functions.clear();
      this.addFunction();

      this.initializeExperienceContent();
    }
  }

  formatList(list: [{ name: string }]) {
    if (!(list.length > 0)) {
      return [];
    }
    return list.map((obj) => obj.name);
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
  }

  editExperience({ valid, value: { id, company, charge, description, dateStart, dateEnd } }: FormGroup) {
    if (!valid) {
      this.showMessageAlert("Some values are missing", 2);
    } else {
      const funcList = this.formatList(this.functions.value);

      const editedExperienceItem: ExperienceItem = {
        id,
        company,
        charge,
        description,
        dateStart,
        dateEnd,
        functions: funcList
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








  addSkill() {
    const contains = this.skills.includes(this.selectedSkill || "");
    if (this.selectedSkill && !contains) {
      this.skills.push(this.selectedSkill)
    }
    else {
      this.showMessageAlert(`${this.selectedSkill} is already in skills`, 2);
    }
  }

  deleteSkill(skillToDelete: string) {
    const index = this.skills.findIndex(skill => skill === skillToDelete);
    if (index !== -1) {
      this.skills.splice(index, 1);
    }
  }

  handleSearchChange() {
    this.showSpinner = true;

    if (this.searchQuery !== "") {
      // Delay the API request by 500 milliseconds
      this.searchQuery$
        .pipe(debounceTime(500))
        .subscribe(async (query) => {
          const skillRes = await this.cvService.getSkills(query);

          if (skillRes.length > 0) {
            this.skillsRes = [...skillRes];
            this.skillsSelect.selected = true;
          } else {
            this.showMessageAlert(`${query} has no results!`, 3);
          }

          this.showSpinner = false;
        });

      // Emit the search query to trigger the API request
      this.searchQuery$.next(this.searchQuery);
    } else {
      this.showSpinner = false;
    }
  }







  async showMessageAlert(message: string, delay: number) {
    this.alertMessage = message;
    this.showAlert = true;

    setTimeout(() => {
      this.alertMessage = "";
      this.showAlert = false;
    }, delay * 1000);
  }





}
