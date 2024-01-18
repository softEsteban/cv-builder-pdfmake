import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { CvDataService } from 'src/app/services/cv.data.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css']
})
export class PersonalInfoComponent {

  languagesSelect = [
    "English",
    "Spanish",
    "French",
    "German",
    "Mandarin Chinese",
    "Japanese",
    "Russian",
    "Portuguese",
    "Italian",
    "Arabic",
    "Hindi",
    "Dutch",
    "Korean",
    "Turkish",
    "Swedish",
    "Norwegian",
    "Danish",
    "Finnish",
    "Hebrew",
    "Greek",
    "Polish",
    "Czech",
    "Hungarian",
    "Thai",
    "Indonesian",
    "Malay",
    "Vietnamese",
    "Tagalog",
    "Swahili",
    "Hausa",
    "Urdu",
    "Bengali"
  ];

  proficiencyLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  cvForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.required),
    headline: new FormControl('', Validators.required),
    profile: new FormControl('', Validators.required),
    linkedin: new FormControl('', Validators.required),
    website: new FormControl('', Validators.required),
    portfolio: new FormControl('', Validators.required),
    languages: new FormArray([
      new FormGroup({
        language: new FormControl('', Validators.required),
        proficiency: new FormControl('', Validators.required)
      })
    ]),
  });

  uploadedPicture: string | ArrayBuffer | null = null;
  base64img: string = "";

  constructor(
    private cvDataService: CvDataService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    const storedData = this.cvDataService.getFormData();
    if (storedData) {
      this.cvForm.patchValue(storedData);
      
      //Add form controls to form array
      if(storedData.languages.length > 1 ){
        for (let index = 0; index < storedData.languages.length - 1; index++) {
          this.addLanguage();
        }
      }

      this.cvForm.get('languages').patchValue(storedData.languages);
    }

    const storedImage = this.cvDataService.getImage();
    if (storedImage) {
      this.uploadedPicture = storedImage;
    }

    // Listen to form value changes
    this.cvForm.valueChanges.subscribe(() => {
      this.cvDataService.setFormData(this.cvForm.value);
    });
  }

  onPictureChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Check the file size (in bytes)
      const fileSizeInBytes = file.size;

      // Set a maximum allowed size (in bytes) for the image
      const maxAllowedSize = 1000000;

      if (fileSizeInBytes > maxAllowedSize) {
        this.alertService.showMessageAlert("The maximum allowed size is 1.000.000 bytes", 2);
        return;
      }

      // Read file as file and store it in uploadedPicture
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadedPicture = reader.result as string;
      };
      reader.readAsDataURL(file);

      // Read as base64 and store it in base64img
      this.readFileAsBase64(file);
    }
  }

  changePicture() {
    // Reset the uploaded picture variable to null to clear the current image
    this.uploadedPicture = null;

    // Reset the file input field so the user can upload a new image
    const fileInput = document.getElementById('upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  readFileAsBase64(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.base64img = reader.result as string;
      // Update the service when the image is loaded
      this.cvDataService.setImage(this.base64img);
    };
    // Read the file as Data URL (base64)
    reader.readAsDataURL(file);
  }

  get languages(): FormArray {
    return this.cvForm.get('languages') as FormArray;
  }

  handleProfiencyClick(index: any, level: any) {
    this.cvForm.get('languages.' + index + '.proficiency').setValue(level)
  }

  addLanguage() {
    const language = new FormGroup({
      language: new FormControl('', Validators.required),
      proficiency: new FormControl('', Validators.required),
    });
    this.languages.push(language);
  }

  deleteLanguage(index: number) {
    this.languages.removeAt(index);
  }

}
