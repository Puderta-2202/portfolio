import { Portfolio } from '../types/portfolio';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PortfolioCardProps {
  portfolio: Portfolio;
  onClick: (id: string) => void;
}

export function PortfolioCard({ portfolio, onClick }: PortfolioCardProps) {
  const skillColors = ['skill-tag', 'skill-tag-secondary', 'skill-tag-tertiary'];
  
  return (
    <Card 
      className="cursor-pointer gradient-card hover-lift h-full overflow-hidden"
      onClick={() => onClick(portfolio.id)}
    >
      <CardHeader className="text-center pb-4 relative">
        <div className="absolute top-0 left-0 right-0 h-20 gradient-tertiary"></div>
        <div className="relative w-28 h-28 mx-auto mb-4 mt-4">
          <ImageWithFallback
            src={portfolio.profileImage}
            alt={portfolio.name}
            className="w-full h-full rounded-full object-cover border-4 border-white shadow-xl"
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent to-white/20"></div>
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{portfolio.name}</h3>
        <div className="inline-block px-4 py-1 gradient-primary rounded-full">
          <p className="text-white font-medium text-sm">{portfolio.title}</p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{portfolio.location}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{portfolio.email}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{portfolio.phone}</span>
        </div>
        
        <p className="text-sm text-gray-700 line-clamp-3">
          {portfolio.bio}
        </p>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-800">Keahlian Utama:</p>
          <div className="flex flex-wrap gap-1">
            {portfolio.skills.slice(0, 4).map((skill, index) => (
              <Badge key={index} className={`text-xs ${skillColors[index % skillColors.length]} border-none`}>
                {skill}
              </Badge>
            ))}
            {portfolio.skills.length > 4 && (
              <Badge variant="outline" className="text-xs border-2 border-purple-300 text-purple-600">
                +{portfolio.skills.length - 4} lainnya
              </Badge>
            )}
          </div>
        </div>
        
        <div className="pt-2">
          <div className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
            <ExternalLink className="w-4 h-4 mr-2" />
            Lihat Portfolio Lengkap
          </div>
        </div>
      </CardContent>
    </Card>
  );
}