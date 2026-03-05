export interface Education {
  schoolName: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Experience {
  companyName: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  name: string;
  endorsements: number;
}

export interface Profile {
  name: string;
  headline: string;
  summary: string;
  location: string;
  email: string;
  phone: string;
  websites: string[];
}

export interface LinkedInData {
  profile: Profile;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: any[];
  languages: any[];
  projects: any[];
} 