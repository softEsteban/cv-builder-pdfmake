import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';

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

    getFileContent(): Observable<string> {
        const filePath = 'assets/photo.txt';
        return this.http.get(filePath, { responseType: 'text' });
    }

    async setMockData() {
        const mockForm = {
            "name": "Esteban Toro Aristizabal",
            "email": "estebantoro.ar@gmail.com",
            "phone": "+57 310 790 5771",
            "headline": "Software Analyst and Developer | Fullstack Developer | RPA Developer | Maker",
            "profile": `Software analyst and developer focused on creating solutions that meet user needs. Skilled in full-stack web and understand the entire software lifecycle. Adept at working with data models, building databases, creating scalable web APIs, and integrating services for web applications. Results-driven and good communicator. Have a strong maker's mindset and enjoy building on my own ideas.`,
            "linkedin": "https://www.linkedin.com/in/softesteban",
            "website": "https://etoro-roan.vercel.app/",
            "portfolio": "https://etoro-roan.vercel.app/",
            "languages": [
                {
                    "language": "Spanish",
                    "proficiency": "C2",
                },
                {
                    "language": "English",
                    "proficiency": "B2",
                }
            ]
        };

        const imageBase: string = await firstValueFrom(this.getFileContent());
        
        const mockSkills = ["MongoDB", "PostgreSQL", "Nodejs", "Nextjs", "Angular"];

        const mockEduData = [{
            "id": "523ad1d8-948a-42aa-bed9-f6c09cc61e85",
            "degree": "Analisis y desarrollo de software",
            "institute": "sena",
            "dateStart": "2024-01-06",
            "dateEnd": "2024-01-27",
            "current": ""
        }];

        const mockEduDataContent = [[
            [
                {
                    "text": "Análisis y Desarrollo de Software",
                    "bold": true,
                    "margin": [
                        0,
                        10
                    ]
                },
                {
                    "text": "SENA | Jan 11, 2024 - Invalid Date",
                    "margin": [
                        0,
                        5
                    ],
                    "fontSize": 10
                }
            ]

        ]]

        const mockExpData = [
            {
                "id": "bebc91f6-6328-4722-b4f2-15bca4ad1603",
                "charge": "Fullstack Team Leader",
                "company": "TITANQ INGENIERIA",
                "description": "Coordinate software development team to meet user requirements",
                "dateStart": "2024-01-04",
                "dateEnd": "2024-01-25",
                "functions": [
                    "Coordinate backend and frontend team",
                    "Talk to the client to analize requirements and deliver software",
                    "Develop database and API with the business model",
                    "Deploy solutions"
                ],
                "current": ""
            }
        ];

        const mockExpDataContent = [
            [
                {
                    "text": "Fullstack Team Leader",
                    "bold": true,
                    "margin": [
                        0,
                        5
                    ]
                },
                {
                    "text": "TITANQ INGENIERIA | Jan 3, 2024 - Jan 24, 2024",
                    "margin": [
                        0,
                        5
                    ],
                    "fontSize": 10
                },
                {
                    "ul": [
                        {
                            "text": "Coordinate backend and frontend team"
                        },
                        {
                            "text": "Talk to the client to analize requirements and deliver software"
                        },
                        {
                            "text": "Develop database and API with the business model"
                        },
                        {
                            "text": "Deploy solutions"
                        }
                    ],
                    "margin": [
                        20,
                        0
                    ],
                    "fontSize": 10
                }
            ]
        ];

        this.setFormData(mockForm);
        this.setImage(imageBase);
        this.setSkillsData(mockSkills);
        this.setEducationData(mockEduData);
        this.setEducationDataContent(mockEduDataContent);
        this.setExperienceData(mockExpData);
        this.setExperienceDataContent(mockExpDataContent);
    }

}
