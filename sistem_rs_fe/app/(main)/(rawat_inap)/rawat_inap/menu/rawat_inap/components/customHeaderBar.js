"use client";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

const HeaderBar = ({
  title,
  placeholder,
  onSearch,
  onAddClick,
  statusFilter,
  statusOptions = [],
  handleStatusChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4 mb-2">
      {title && <h4 className="text-lg font-semibold">{title}</h4>}

      <div className="flex gap-2 flex-wrap items-center">
        <span className="p-input-icon-left w-64">
          <i className="pi pi-search ml-3" />
          <InputText
            placeholder={placeholder}
            className="w-full pl-6"
            onChange={(e) => onSearch?.(e.target.value.toLowerCase())}
          />
        </span>

        <Dropdown
          value={statusFilter}
          options={statusOptions}
          onChange={handleStatusChange}
          placeholder="Pilih Status"
          className="w-60 md:w-40"
        />

        {onAddClick && (
          <Button
            label="Tambah"
            icon="pi pi-plus"
            onClick={onAddClick}
            className="whitespace-nowrap"
          />
        )}
      </div>
    </div>
  );
};

export default HeaderBar;
