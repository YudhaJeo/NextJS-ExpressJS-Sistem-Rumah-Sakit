"use client";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const HeaderBar = ({ title, placeholder, onSearch, onAddClick }) => {
  return (
    <div className="flex justify-content-end items-center mt-4 mb-2 gap-3">
      <h4 className="text-lg font-semibold">{title}</h4>
      <div className="flex gap-2 flex-wrap">
        <span className="p-input-icon-left w-64">
          <i className="pi pi-search" />
          <InputText
            placeholder={placeholder}
            className="w-full"
            onChange={(e) => onSearch(e.target.value.toLowerCase())}
          />
        </span>
        <Button label="Tambah" icon="pi pi-plus" onClick={onAddClick} />
      </div>
    </div>
  );
};

export default HeaderBar;