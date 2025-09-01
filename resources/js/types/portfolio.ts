export interface Portfolio {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  profileImage: string;
  skills: string[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  socialLinks: SocialLinks;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  isCurrentRole: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
  instagram?: string;
}