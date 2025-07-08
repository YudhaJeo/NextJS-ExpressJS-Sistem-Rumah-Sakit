'use client';

import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

const FilterTanggal = ({ startDate, endDate, setStartDate, setEndDate, handleDateFilter, resetFilter }) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Dari</label>
        <Calendar
          value={startDate}
          onChange={(e) => setStartDate(e.value)}
          dateFormat="yy-mm-dd"
          showIcon
          placeholder="Mulai"
          style={{ width: '170px', fontSize: '0.875rem' }}
          className="w-[160px]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sampai</label>
        <Calendar
          value={endDate}
          onChange={(e) => setEndDate(e.value)}
          dateFormat="yy-mm-dd"
          showIcon
          placeholder="Selesai"
          style={{ width: '170px', fontSize: '0.875rem' }}
          className="w-[160px]"
        />
      </div>
      <div className="flex gap-2 mt-4 mb-2">
        <Button
          icon="pi pi-filter"
          label="Terapkan"
          tooltip="Reset"
          className="p-1 text-xs h-7"
          severity="info"
          onClick={handleDateFilter}
        />
        <Button
          icon="pi pi-times"
          tooltip="Reset"
          className="p-1 text-xs h-7"
          severity="secondary"
          onClick={resetFilter}
        />
      </div>
    </div>
  );
}

export default FilterTanggal;