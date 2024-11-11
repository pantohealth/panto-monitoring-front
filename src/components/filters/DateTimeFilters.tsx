import { useState } from 'react';
import { useAtom } from 'jotai';
import { filterAtom, type FilterState } from '../../store/filters';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, Download, FileSpreadsheet, Clock, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface DateTimeFiltersProps {
  onExport: () => void;
  onExportExcel?: () => void;
  onSearch: (filters: FilterState) => void;
}

export function DateTimeFilters({ onExport, onExportExcel, onSearch }: DateTimeFiltersProps) {
  const [filters, setFilters] = useAtom(filterAtom);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (filters.isExactSearch && !filters.exactDateTime) {
      toast.error('Please enter an exact date/time for precise search');
      return;
    }

    if (!filters.isExactSearch && !filters.fromDateTime && !filters.toDateTime) {
      toast('Showing all records as no date range specified', {
        icon: 'ℹ️',
      });
    }

    setHasSearched(true);
    onSearch(filters);
  };

  const toggleSearchMode = () => {
    setFilters(prev => ({
      ...prev,
      isExactSearch: !prev.isExactSearch,
      fromDateTime: '',
      toDateTime: '',
      exactDateTime: ''
    }));
    setHasSearched(false);
  };

  const clearDates = () => {
    setFilters(prev => ({
      ...prev,
      fromDateTime: '',
      toDateTime: '',
      exactDateTime: ''
    }));
    onSearch({
      ...filters,
      fromDateTime: '',
      toDateTime: '',
      exactDateTime: ''
    });
    setHasSearched(false);
  };

  const hasDateSelected = hasSearched && (filters.fromDateTime || filters.toDateTime || filters.exactDateTime);

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex justify-end mb-4 gap-2">
        {hasDateSelected && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearDates}
            className="text-sm text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Dates
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSearchMode}
          className="text-sm"
        >
          <Clock className="w-4 h-4 mr-2" />
          {filters.isExactSearch ? 'Switch to Range Search' : 'Switch to Exact Time'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {filters.isExactSearch ? (
          <div className="md:col-span-2">
            <Input
              type="datetime-local"
              label="Exact Date/Time"
              value={filters.exactDateTime}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                exactDateTime: e.target.value
              }))}
            />
          </div>
        ) : (
          <>
            <div>
              <Input
                type="datetime-local"
                label="From Date/Time"
                value={filters.fromDateTime}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  fromDateTime: e.target.value
                }))}
              />
            </div>
            <div>
              <Input
                type="datetime-local"
                label="To Date/Time"
                value={filters.toDateTime}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  toDateTime: e.target.value
                }))}
              />
            </div>
          </>
        )}
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
            PDF
          </Button>
          <Button
            variant="secondary"
            onClick={onExportExcel}
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Excel
          </Button>
        </div>
      </div>
    </div>
  );
}