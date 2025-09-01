import { Portfolio } from '../types/portfolio';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  ExternalLink, 
  Github, 
  Linkedin,
  Globe,
  GraduationCap,
  Briefcase,
  FolderOpen
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PortfolioDetailProps {
  portfolio: Portfolio;
  onBack: () => void;
}

export function PortfolioDetail({ portfolio, onBack }: PortfolioDetailProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button onClick={onBack} variant="outline" className="mb-4">
        ← Kembali ke Daftar Portfolio
      </Button>
      
      {/* Header Section */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative w-32 h-32 flex-shrink-0">
              <ImageWithFallback
                src={portfolio.profileImage}
                alt={portfolio.name}
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{portfolio.name}</h1>
              <p className="text-xl text-blue-600 font-semibold mb-4">{portfolio.title}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center justify-center md:justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{portfolio.location}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{portfolio.email}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{portfolio.phone}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Bergabung: {new Date(portfolio.createdAt).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-6">{portfolio.bio}</p>
              
              {/* Social Links */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                {portfolio.socialLinks.linkedin && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {portfolio.socialLinks.github && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={portfolio.socialLinks.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                )}
                {portfolio.socialLinks.website && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={portfolio.socialLinks.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Skills Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Badge className="w-5 h-5 mr-2" />
            Keahlian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {portfolio.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Experience Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            Pengalaman Kerja
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {portfolio.experience.map((exp, index) => (
            <div key={exp.id}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{exp.position}</h3>
                  <p className="text-blue-600 font-medium">{exp.company}</p>
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-1 sm:mt-0">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>
                    {new Date(exp.startDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' })} - 
                    {exp.endDate ? new Date(exp.endDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' }) : 'Sekarang'}
                    {exp.isCurrentRole && <Badge variant="outline" className="ml-2 text-xs">Saat ini</Badge>}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{exp.description}</p>
              {index < portfolio.experience.length - 1 && <Separator className="mt-6" />}
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Projects Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FolderOpen className="w-5 h-5 mr-2" />
            Proyek
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {portfolio.projects.map((project, index) => (
            <div key={project.id}>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="w-full lg:w-48 h-32 flex-shrink-0">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full rounded-lg object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center">
                        {project.title}
                        {project.featured && <Badge className="ml-2 text-xs">Featured</Badge>}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.liveUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Demo
                        </a>
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" />
                          GitHub
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              {index < portfolio.projects.length - 1 && <Separator className="mt-6" />}
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Education Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GraduationCap className="w-5 h-5 mr-2" />
            Pendidikan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {portfolio.education.map((edu, index) => (
            <div key={edu.id}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold">{edu.degree} - {edu.field}</h3>
                  <p className="text-blue-600">{edu.institution}</p>
                  {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-1 sm:mt-0">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>
                    {new Date(edu.startDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' })} - 
                    {new Date(edu.endDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
              {index < portfolio.education.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}