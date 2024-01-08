export interface ExperienceItem {
    id: string;
    company: string;
    charge: string;
    description: string;
    functions: string[];
    dateStart: Date;
    dateEnd: Date;
    current: boolean;
}