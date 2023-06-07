import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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

  education: EducationItem[] = [];
  experience: ExperienceItem[] = [];

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() { }

  createPdf() {
    // const pdfDefinition: any = {
    //   content: [
    //     // {
    //     //   image: 'avatar.jpg',
    //     //   width: 200
    //     // },
    //     ,
    //     {
    //       columns: [
    //         { width: "30%", text: "Profile Image here" },
    //         { width: "70%", text: 'Esteban Toro ', fontSize: 15, bold: true, margin: [0, 20] }
    //       ]
    //     },
    //     {
    //       columns: [
    //         {
    //           width: "30%",
    //           ul: [
    //             'Nodejs',
    //             'Angular',
    //             'Nestjs',
    //             'Vuejs',
    //             'PostgreSQL',
    //             'SQL Server',
    //             'MySQL',
    //             'MongoDB'
    //           ]
    //         },
    //         {
    //           width: "70%",
    //           ul: [
    //             'Introduction',
    //             'Experience',
    //             'Education',
    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // };

    const pdfDefinition: any = {
      content: [
        {
          stack: [
            {
              canvas: [
                {
                  type: 'ellipse',
                  x: -30,
                  y: -20,
                  r1: 40,
                  r2: 20,
                  lineColor: 'black',
                },
              ],
            },
            {
              text: 'Esteban Toro',
              fontSize: 15,
              bold: true,
              margin: [0, 20],
            },
            {
              ul: [
                'Nodejs',
                'Angular',
                'Nestjs',
                'Vuejs',
                'PostgreSQL',
                'SQL Server',
                'MySQL',
                'MongoDB',
              ],
            },
          ],
          width: '30%',
        },
        {
          stack: [
            {
              text: 'Introduction',
              style: 'sectionHeading',
            },
            {
              text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eget suscipit enim, in tempus tellus. Vestibulum blandit magna sed elit tristique congue.',
              margin: [0, 10],
            },
            {
              text: 'Experience',
              style: 'sectionHeading',
              margin: [0, 20],
            },
            {
              text: 'Company A',
              bold: true,
              margin: [0, 10],
            },
            {
              text: 'Position: Full Stack Developer',
              margin: [0, 5],
            },
            {
              text: 'Duration: 2018 - 2021',
              margin: [0, 5],
            },
            {
              text: 'Responsibilities:',
              margin: [0, 10],
            },
            {
              ul: [
                'Developed and maintained web applications using Node.js and Angular.',
                'Collaborated with cross-functional teams to design and implement new features.',
                'Performed code reviews and ensured coding best practices.',
              ],
              margin: [20, 0],
            },
            {
              text: 'Education',
              style: 'sectionHeading',
              margin: [0, 20],
            },
            {
              text: 'Bachelor of Science in Computer Science',
              bold: true,
              margin: [0, 10],
            },
            {
              text: 'University XYZ',
              margin: [0, 5],
            },
            {
              text: 'Year: 2014 - 2018',
              margin: [0, 5],
            },
          ],
          width: '70%',
        },
      ],
      styles: {
        sectionHeading: {
          fontSize: 14,
          bold: true,
          margin: [0, 10],
        },
      },
    };

    const pdfDocGenerator = pdfMake.createPdf(pdfDefinition);

    pdfDocGenerator.getBase64((data) => {
      const base64 = `data:application/pdf;base64,${data}`;
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(base64);
    });
  }

  addEducation() { }
  addExperience() { }
}

