// types.ts
export interface SortConfig {
  key: string | null;
  direction: "asc" | "desc";
}

export interface FilterConfig {
  key: string;
  type: "select" | "multiselect" | "range" | "toggle" | "text" | "number" | "date" | "daterange";
  value: any;
}

export interface ColumnConfig {
  key: string;
  header: string;
  filterable?: boolean;
  filterType?: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  hidden?: boolean;
}

export interface PaginationResponse<T> {
  data: any;
  total: number;
  page: number;
  totalPages: number;
}