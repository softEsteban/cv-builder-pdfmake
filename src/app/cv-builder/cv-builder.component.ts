import { Component, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { AlertService } from '../services/alert.service';
import { CvDataService } from '../services/cv.data.service';

@Component({
  selector: 'app-cv-builder',
  templateUrl: './cv-builder.component.html',
  styleUrls: ['./cv-builder.component.scss']
})
export class CVBuilderComponent {

  @ViewChild('skillsSelect') skillsSelect: any;

  // Data from sections
  userName: string = "";
  uploadedPicture: string | ArrayBuffer | null = null;
  base64img: string = "";

  personalInfoData: any;
  skillsData: string[] = [];
  educationContent = [];
  experienceContent = [];


  // Pdfs variables
  pdfSrc: SafeResourceUrl;
  pdfDefinition: any = {};

  constructor(
    private sanitizer: DomSanitizer,
    public alertService: AlertService,
    private cvDataService: CvDataService) {

  }

  async createPdf() {

    // Get data from centralized data service
    this.personalInfoData = this.cvDataService.getFormData();
    this.base64img = this.cvDataService.getImage();
    this.skillsData = this.cvDataService.getSkillsData();
    this.educationContent = this.cvDataService.getEducationDataContent();
    this.experienceContent = this.cvDataService.getExperienceDataContent();

    // Build pdf structure

    this.userName = this.personalInfoData.name || '';

    this.pdfDefinition = {
      content: [
        {
          image: "",
          width: 100
        },
        {
          columns: [
            {
              stack: [
                { text: this.personalInfoData.name || '', fontSize: 18, bold: true },
                { text: this.personalInfoData.headline || '', fontSize: 14, margin: [0, 12] },
                { text: this.personalInfoData.email || '', fontSize: 8, },
                { text: this.personalInfoData.phone || '', fontSize: 8, margin: [0, 12] },
                { ul: null },

              ],
              width: '30%',
            },
            {
              stack: [
                { text: 'Profile', style: 'sectionHeading', margin: [0, 20], color: '#000' },
                { text: this.personalInfoData.profile || '', margin: [0, 10] },
                { text: 'Experience', style: 'sectionHeading', margin: [0, 20], color: '#000' },
                ...this.experienceContent,
                { text: 'Education', style: 'sectionHeading', margin: [0, 20], color: '#000' },
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

    // Add base64 image and skills list 
    this.pdfDefinition.content[0].image = this.base64img;
    this.pdfDefinition.content[1].columns[0].stack[4].ul = this.skillsData.map(skill => ({ text: skill }));
  }

  async viewPdf() {

    //Create PDF structure
    await this.createPdf();

    const pdfDocGenerator = pdfMake.createPdf(this.pdfDefinition);

    // Add to the DOM
    pdfDocGenerator.getBase64((data) => {
      const base64 = `data:application/pdf;base64,${data}`;
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(base64);
    });

    // Scroll to the PDF section
    setTimeout(() => {
      const cvSection = document.getElementById('cv-section');
      if (cvSection) {
        window.scrollTo({ top: cvSection.offsetTop, behavior: 'smooth' });
      }
    }, 500);
  }

  async downloadPdf() {

    //Create PDF structure
    await this.createPdf();

    const pdfDocGenerator = pdfMake.createPdf(this.pdfDefinition);
    pdfDocGenerator.download(`CV-${this.userName.replace(" ", "-")}.pdf`);
  }

}
