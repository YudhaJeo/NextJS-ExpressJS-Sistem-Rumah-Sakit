export interface ColumnConfig<T> {
    field?: keyof T | string;
    header: string;
    filter?: boolean;
    body?: (rowData: T) => React.ReactNode;
    style?: React.CSSProperties;
}

export interface DataTableProps<T extends DataTableValue> {
    data: T[];
    loading?: boolean;
    columns: ColumnConfig<T>[];
}
