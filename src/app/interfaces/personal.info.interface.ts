import { EducationItem } from "./education.interface";
import { ExperienceItem } from "./experience.interface";

export interface PersonalInfo {
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