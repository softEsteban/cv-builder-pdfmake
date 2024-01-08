import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CvDataService {

    // Personal Info Data
    private formData: any = null;
    private storedImage: string | null = null;

    // Skills Data
    private skillsData: [];

    // Education Data
    private educationDataContent: [];
    private educationData: [];

    // Experience Data
    private experienceDataContent: [];
    private experienceData: [];

    constructor(private http: HttpClient) { }

    setFormData(data: any): void {
        this.formData = data;
    }

    getFormData(): any {
        return this.formData;
    }

    setImage(imageData: string): void {
        this.storedImage = imageData;
    }

    getImage(): string | null {
        return this.storedImage;
    }


    setSkillsData(data: any) {
        this.skillsData = data;
    }

    getSkillsData() {
        return this.skillsData;
    }


    setEducationDataContent(data: any) {
        this.educationDataContent = data;
    }

    setEducationData(data: any) {
        this.educationData = data;
    }

    getEducationDataContent() {
        return this.educationDataContent;
    }

    getEducationData() {
        return this.educationData;
    }


    setExperienceDataContent(data: any) {
        this.experienceDataContent = data;
    }

    setExperienceData(data: any) {
        this.experienceData = data;
    }

    getExperienceDataContent() {
        return this.experienceDataContent;
    }

    getExperienceData() {
        return this.experienceData;
    }

}
