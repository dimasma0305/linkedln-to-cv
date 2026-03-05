export interface LinkedInProfile {
  firstName: string;
  lastName: string;
  name?: string;
  headline: string;
  summary: string;
  location: string;
  industry: string;
  connections?: number;
  profilePicture?: string;
  address?: string;
  birthDate?: string;
  geoLocation?: string;
  zipCode?: string;
  twitterHandles?: string;
  websites?: string;
  instantMessengers?: string;
  maidenName?: string;
}

export interface Position {
  companyName: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  employmentType: string;
}

export interface Education {
  school: string;
  degreeName: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  grade: string;
  activities: string;
  notes: string;
  description: string;
}

export interface Certification {
  name: string;
  authority: string;
  licenseNumber: string;
  startDate: string;
  endDate: string;
  url: string;
}

export interface Language {
  name: string;
  proficiency: string;
}

export interface Skill {
  Name: string;
  category?: string;
  endorsementCount?: number;
}

export interface Profile {
  firstName: string;
  lastName: string;
  headline: string;
  summary: string;
  location: string;
  industry: string;
  address?: string;
  birthDate?: string;
  geoLocation?: string;
  zipCode?: string;
  twitterHandles?: string;
  websites?: string;
  instantMessengers?: string;
  maidenName?: string;
  linkedin?: string;
  facebook?: string;
  whatsapp?: string;
  phone?: string;
  email?: string;
}

export interface Honor {
  title: string;
  description: string;
  issuedOn: string;
}

export interface Volunteer {
  organization: string;
  role: string;
  cause: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface Project {
  name: string;
  description: string;
  url: string;
  startDate: string;
  endDate: string;
}

export interface LinkedInData {
  profile: Profile;
  positions: Position[];
  education: Education[];
  skills: string[];
  certifications: Certification[];
  languages: Language[];
  honors: Honor[];
  volunteers: Volunteer[];
  projects: Project[];
} 