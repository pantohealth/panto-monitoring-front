import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, Download, FileSpreadsheet, Clock, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useFilterStore } from '../../store/filters';

interface DateTimeFiltersProps {
  onExport: () => void;
  onExportExcel?: () => void;
  onSearch?: (filters: {
    fromDateTime: string;
    toDateTime: string;
    exactDateTime: string;
    isExactSearch: boolean;
  }) => void;
}

export function DateTimeFilters({ onExport, onExportExcel, onSearch }: DateTimeFiltersProps) {
  const [hasSearched, setHasSearched] = useState(false);
  const filters = useFilterStore();
  
  const handleSearch = () => {
    if (!onSearch) return;

    if (filters.isExactSearch && !filters.exactDateTime) {
      toast.error('Please enter an exact date/time for exact search');
      return;
    }

    if (!filters.isExactSearch && !filters.fromDateTime && !filters.toDateTime) {
      toast('Showing all records as no date range specified', {
        icon: 'ℹ️',
      });
    }

    setHasSearched(true);
    onSearch({
      fromDateTime: filters.fromDateTime,
      toDateTime: filters.toDateTime,
      exactDateTime: filters.exactDateTime,
      isExactSearch: filters.isExactSearch
    });
  };

  const toggleSearchMode = () => {
    filters.setFilters({
      isExactSearch: !filters.isExactSearch,
      fromDateTime: '',
      toDateTime: '',
      exactDateTime: ''
    });
    setHasSearched(false);
  };

  const clearDates = () => {
    filters.resetFilters();
    if(onSearch){
    onSearch({
      fromDateTime: '',
      toDateTime: '',
      exactDateTime: '',
      isExactSearch: false
    });
  }
    setHasSearched(false);
  };

  const hasDateSelected = hasSearched && (filters.fromDateTime || filters.toDateTime || filters.exactDateTime);

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      {onSearch && (
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
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {onSearch && (
          <>
            {filters.isExactSearch ? (
              <div className="md:col-span-2">
                <Input
                  type="datetime-local"
                  label="Exact Date/Time"
                  value={filters.exactDateTime}
                  onChange={(e) => filters.setFilters({ exactDateTime: e.target.value })}
                />
              </div>
            ) : (
              <>
                <div>
                  <Input
                    type="datetime-local"
                    label="From Date/Time"
                    value={filters.fromDateTime}
                    onChange={(e) => filters.setFilters({ fromDateTime: e.target.value })}
                  />
                </div>
                <div>
                  <Input
                    type="datetime-local"
                    label="To Date/Time"
                    value={filters.toDateTime}
                    onChange={(e) => filters.setFilters({ toDateTime: e.target.value })}
                  />
                </div>
              </>
            )}
          </>
        )}
        <div className="flex items-end space-x-2">
          {onSearch && (
            <Button
              onClick={handleSearch}
              className="flex-1"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={onExport}
          >
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          {onExportExcel && (
            <Button
              variant="secondary"
              onClick={onExportExcel}
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Excel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}