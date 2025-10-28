'use client';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface ActivityFiltersProps {
  onFilterChange: (filters: { sport: string; location: string }) => void;
}

const sports = ['Basketball', 'Soccer', 'Volleyball', 'Tennis', 'Running', 'Fencing'];

export function ActivityFilters({ onFilterChange }: ActivityFiltersProps) {
    
    const handleSportChange = (value: string) => {
        onFilterChange({ sport: value === 'all' ? '' : value, location: '' });
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange({ sport: '', location: e.target.value });
    };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-2 text-lg font-semibold w-full md:w-auto">
            <Filter className="h-5 w-5 text-primary" />
            <span className="font-headline">Filter by</span>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <Select onValueChange={handleSportChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sports</SelectItem>
            {sports.map((sport) => (
              <SelectItem key={sport} value={sport}>
                {sport}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input placeholder="Location (e.g., 'Central Park')" onChange={handleLocationChange} />
      </div>
    </div>
  );
}
