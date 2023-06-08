import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';

interface EducationItem {
  institute: string;
  degree: string;
  dateStart: Date;
  dateEnd: Date;
}

interface ExperienceItem {
  company: string;
  charge: string;
  description: string;
  functions: string[];
  dateStart: Date;
  dateEnd: Date;
}

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent implements OnInit {
  pdfSrc: SafeResourceUrl;

  yearControl = new FormControl();

  onYearSelected(event: MatDatepickerInputEvent<Date>) {
    console.log(event.value);
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


  pdfDefinition: any = {
    content: [
      {
        columns: [
          {
            stack: [
              { text: 'Esteban Toro', fontSize: 18, bold: true },
              { text: 'Software Developer', fontSize: 14, margin: [0, 12] },
              { ul: this.skills },
            ],
            width: '30%',
          },
          {
            stack: [
              { text: 'Profile', style: 'sectionHeading', margin: [0, 20], color: '#000', background: '#00FF00' },
              { text: 'Software developer with a holistic and creative focus. I can work in the backend and the frontend', margin: [0, 10] },
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

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() { }

  createPdf() {
    const pdfDocGenerator = pdfMake.createPdf(this.pdfDefinition);

    //Add to the dom
    pdfDocGenerator.getBase64((data) => {
      const base64 = `data:application/pdf;base64,${data}`;
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(base64);
    });
  }

  downloadPdf() {
    const pdfDocGenerator = pdfMake.createPdf(this.pdfDefinition);
    pdfDocGenerator.download('my-cv.pdf');
  }



  addEducation() { }
  addExperience() { }
}

