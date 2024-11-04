import React from 'react';
import { useAtom } from 'jotai';
import { filterAtom } from '@/store/filters';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface DateTimeFiltersProps {
  onExport: () => void;
}

export function DateTimeFilters({ onExport }: DateTimeFiltersProps) {
  const [filters, setFilters] = useAtom(filterAtom);

  const handleSearch = () => {
    // Trigger search with current filter values
    console.log('Searching with filters:', filters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Input
            type="datetime-local"
            label="From Date/Time"
            value={filters.fromDateTime}
            onChange={(e) => setFilters({ ...filters, fromDateTime: e.target.value })}
          />
        </div>
        <div>
          <Input
            type="datetime-local"
            label="To Date/Time"
            value={filters.toDateTime}
            onChange={(e) => setFilters({ ...filters, toDateTime: e.target.value })}
          />
        </div>
        <div className="flex items-end space-x-2">
          <Button
            onClick={handleSearch}
            className="flex-1"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button
            variant="secondary"
            onClick={onExport}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}