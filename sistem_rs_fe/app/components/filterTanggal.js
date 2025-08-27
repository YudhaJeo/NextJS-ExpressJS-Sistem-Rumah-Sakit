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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Terapkan</label>
        <div className='flex gap-2'>
          <Button
            icon="pi pi-check"
            tooltip='Terapkan'
            className="p-inputtext"
            severity="info"
            onClick={handleDateFilter}
          />
          <Button
            tooltip='Reset'
            icon="pi pi-times"
            className="p-inputtext"
            severity="secondary"
            onClick={resetFilter}
          />
        </div>
      </div>
    </div>
  );
}

export default FilterTanggal;