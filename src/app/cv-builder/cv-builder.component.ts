import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  institute: string;
  degree: string;
  dateStart: Date;
  dateEnd: Date;
}

export interface ExperienceItem {
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

  cvForm: FormGroup;

  pdfSrc: SafeResourceUrl;
  pdfDefinition: any = {};

  constructor(private sanitizer: DomSanitizer, private formBuilder: FormBuilder) {
    this.cvForm = this.formBuilder.group({
      name: ['Esteban Toro Aristizabal', Validators.required],
      email: ['estebantoro.greenman@gmail.com', [Validators.required, Validators.email]],
      phone: ['+57 3107905771', Validators.required],
      headline: ['Fullstack Junior Developer', Validators.required],
      profile: ['Software developer with web fullstack development and RPA automations', Validators.required],
      education: this.formBuilder.array([]),
      experience: this.formBuilder.array([])
    });
    this.initializePdfDefinition();
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

  skills: string[] = ['Nodejs', 'Angular', 'Nestjs', 'Vuejs', 'PostgreSQL', 'SQL Server', 'MySQL', 'MongoDB'];

  education: EducationItem[] = [
    {
      institute: "Universidad de Caldas",
      degree: "Software development diplomat",
      dateStart: new Date('2021-01-01'),
      dateEnd: new Date('2021-01-01')
    }
  ];

  experience: ExperienceItem[] = [
    {
      company: "IBM",
      charge: "Solutions Architech",
      description: "Improving and creating new solutions",
      functions: ["Gathering technical requeriments", "Creating structure models and plans"],
      dateStart: new Date('2021-01-01'),
      dateEnd: new Date('2021-01-01')
    }
  ];

  educationContent = this.education.map(item => [
    { text: item.degree, bold: true, margin: [0, 10] },
    { text: item.institute, margin: [0, 5] },
    { text: item.dateStart.getFullYear() + ' - ' + item.dateEnd.getFullYear(), margin: [0, 5] },
  ]);

  experienceContent = this.experience.map(item => [
    { text: item.company, bold: true, margin: [0, 10] },
    { text: 'Position: ' + item.charge, margin: [0, 5] },
    { text: 'Duration: ' + item.dateStart.getFullYear() + ' - ' + item.dateEnd.getFullYear(), margin: [0, 5] },
    { text: 'Responsibilities:', margin: [0, 10] },
    { ul: item.functions, margin: [20, 0] },
  ]);

  ngOnInit() { }

  createPdf() {
    this.initializePdfDefinition();
    const pdfDocGenerator = pdfMake.createPdf(this.pdfDefinition);

    // Add to the DOM
    pdfDocGenerator.getBase64((data) => {
      const base64 = `data:application/pdf;base64,${data}`;
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(base64);
    });
  }

  downloadPdf() {
    this.initializePdfDefinition();
    const pdfDocGenerator = pdfMake.createPdf(this.pdfDefinition);
    pdfDocGenerator.download('my-cv.pdf');
  }

  sendData() {
    console.log("Form DATA");
    const formData: CVFormData = this.cvForm.value;
    console.log(formData);
    // if (this.cvForm.valid) {
    //   const formData: CVFormData = this.cvForm.value;
    //   console.log(formData);
    //   // You can now use the formData to send the data to the server or perform any other operations
    // } else {
    //   // Handle form validation errors if needed
    //   console.log('Form is not valid');
    // }
  }

  addEducation() { }
  addExperience() { }
}

