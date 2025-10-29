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
import React from 'react';

interface ActivityFiltersProps {
  onFilterChange: (filters: { sport: string; location: string }) => void;
}

const sports = ['Basketbal', 'Voetbal', 'Volleybal', 'Tennis', 'Hardlopen', 'Schermen', 'Padel', 'Hockey', 'Wielrennen'];

export function ActivityFilters({ onFilterChange }: ActivityFiltersProps) {
    const [filters, setFilters] = React.useState({ sport: '', location: '' });

    const handleFilterChange = (change: Partial<{ sport: string; location: string }>) => {
        const newFilters = { ...filters, ...change };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };
    
    const handleSportChange = (value: string) => {
        handleFilterChange({ sport: value === 'all' ? '' : value });
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFilterChange({ location: e.target.value });
    };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex items-center gap-2 text-lg font-semibold w-full md:w-auto">
            <Filter className="h-5 w-5 text-primary" />
            <span className="font-headline">Filteren op</span>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <Select onValueChange={handleSportChange} value={filters.sport}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Sporten</SelectItem>
            {sports.map((sport) => (
              <SelectItem key={sport} value={sport}>
                {sport}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input placeholder="Locatie (bijv. 'Vondelpark')" onChange={handleLocationChange} value={filters.location} />
      </div>
    </div>
  );
}
