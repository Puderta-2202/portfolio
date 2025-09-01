import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Search, X, Filter } from 'lucide-react';

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onSkillFilter: (skill: string) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

const popularSkills = [
  'React', 'Node.js', 'TypeScript', 'Python', 'Figma', 
  'UI/UX Design', 'Machine Learning', 'PostgreSQL', 'AWS', 'Docker'
];

export function SearchAndFilter({ 
  onSearch, 
  onSkillFilter, 
  onClearFilters, 
  isLoading = false 
}: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleSkillFilter = (skill: string) => {
    if (!activeFilters.includes(skill)) {
      setActiveFilters([...activeFilters, skill]);
      onSkillFilter(skill);
    }
  };

  const removeFilter = (skill: string) => {
    setActiveFilters(activeFilters.filter(f => f !== skill));
    // For simplicity, we'll clear all filters and reapply remaining ones
    // In a real app, you'd want more sophisticated filter management
    if (activeFilters.length === 1) {
      onClearFilters();
    }
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchQuery('');
    onClearFilters();
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6 space-y-6">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Cari berdasarkan nama, posisi, keahlian, atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            Cari
          </Button>
        </form>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Filter Aktif:</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Hapus Semua
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                  {filter}
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-500" 
                    onClick={() => removeFilter(filter)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Popular Skills Filter */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter berdasarkan keahlian populer:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularSkills.map((skill) => (
              <Badge 
                key={skill}
                variant={activeFilters.includes(skill) ? "default" : "outline"}
                className="cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() => handleSkillFilter(skill)}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="text-xs text-gray-500 pt-2 border-t">
          💡 Tips: Gunakan kata kunci seperti "React developer", "UI designer", atau "data scientist" untuk hasil yang lebih spesifik
        </div>
      </CardContent>
    </Card>
  );
}