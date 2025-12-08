import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  SlidersHorizontal,
  Filter,
  Calendar,
  Funnel,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { id } from "zod/v4/locales";

interface SortConfig {
  key: string | null;
  direction: "asc" | "desc";
}

interface FilterConfig {
  key: string;
  type:
    | "select"
    | "multiselect"
    | "range"
    | "toggle"
    | "text"
    | "number"
    | "date"
    | "daterange";
  value: any;
}

interface ColumnConfig {
  key: string;
  header: string | React.ReactNode;
  filterable?: boolean;
  filterType?: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  hidden?: boolean;
  generated?:boolean;
}

const DynamicTable: React.FC<{
  data?: any[];
  columns?: ColumnConfig[];
  itemsPerPage?: number;
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  className?: string;
  onRowClick?: (row: any) => void;
}> = ({
  data = [],
  columns = [],
  itemsPerPage = 10,
  searchable = false,
  filterable = false,
  sortable = false,
  className = "",
  onRowClick = null,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [activeFilterPanel, setActiveFilterPanel] = useState<string | null>(
    null
  );

  // Get column configuration for filter type
  const getColumnFilterType = (key: string) => {
    const column = columns.find((col) => col.key === key);
    return column?.filterType || "select";
  };

  // Get unique values for filter dropdowns
  const getUniqueValues = (key: string) => {
    const values = data.map((item) => item[key]).filter(Boolean);
    return [...new Set(values)].sort();
  };

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Apply search
    if (searchable && searchTerm) {
      filtered = filtered.filter((item) =>
        columns.some((col) => {
          const value = item[col.key];
          return (
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          );
        })
      );
    }

    // Apply filters - ONLY for columns marked as filterable
    if (filterable && filters.length > 0) {
      filtered = filters.reduce((currentData, filter) => {
        // Skip if this filter isn't for a filterable column
        const column = columns.find((col) => col.key === filter.key);
        if (!column || column.filterable !== true) return currentData;

        if (
          filter.value === null ||
          filter.value === undefined ||
          filter.value === ""
        )
          return currentData;

        switch (filter.type) {
          case "select":
            return currentData.filter(
              (item) => item[filter.key] === filter.value
            );
          case "multiselect":
            return currentData.filter((item) =>
              filter.value.includes(item[filter.key])
            );
          case "range":
            if (filter.value.min !== undefined && filter.value.min !== "") {
              currentData = currentData.filter(
                (item) => item[filter.key] >= filter.value.min
              );
            }
            if (filter.value.max !== undefined && filter.value.max !== "") {
              currentData = currentData.filter(
                (item) => item[filter.key] <= filter.value.max
              );
            }
            return currentData;
          case "toggle":
            return currentData.filter(
              (item) => !!item[filter.key] === filter.value
            );
          case "text":
            return currentData.filter((item) =>
              item[filter.key]
                ?.toString()
                .toLowerCase()
                .includes(filter.value.toLowerCase())
            );
          case "number":
            return currentData.filter((item) =>
              item[filter.key]?.toString().includes(filter.value.toString())
            );
          case "date":
            if (filter.value) {
              const filterDate = new Date(filter.value).setHours(0, 0, 0, 0);
              return currentData.filter((item) => {
                const itemDate = new Date(item[filter.key]).setHours(
                  0,
                  0,
                  0,
                  0
                );
                return itemDate === filterDate;
              });
            }
            return currentData;
          case "daterange":
            if (filter.value.start) {
              const startDate = new Date(filter.value.start).setHours(
                0,
                0,
                0,
                0
              );
              currentData = currentData.filter((item) => {
                const itemDate = new Date(item[filter.key]).setHours(
                  0,
                  0,
                  0,
                  0
                );
                return itemDate >= startDate;
              });
            }
            if (filter.value.end) {
              const endDate = new Date(filter.value.end).setHours(
                23,
                59,
                59,
                999
              );
              currentData = currentData.filter((item) => {
                const itemDate = new Date(item[filter.key]).setHours(
                  23,
                  59,
                  59,
                  999
                );
                return itemDate <= endDate;
              });
            }
            return currentData;
          default:
            return currentData;
        }
      }, filtered);
    }

    // Apply sorting
    if (sortable && sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key as keyof typeof a];
        const bVal = b[sortConfig.key as keyof typeof b];

        if (aVal === undefined || aVal === null)
          return sortConfig.direction === "asc" ? 1 : -1;
        if (bVal === undefined || bVal === null)
          return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }


    // dynamically add sno 
    return filtered.map((item, idx)=>{
      const newItem = {...item}
      columns.forEach((col)=>{
        if(col.generated && col.key === "sno"){
          newItem[col.key] = idx + 1
        }
      });

      return newItem
    })
  }, [
    data,
    searchTerm,
    filters,
    sortConfig,
    columns,
    searchable,
    filterable,
    sortable,
  ]);

  // Handle sorting
  const handleSort = (key: string) => {
    if (!sortable) return;
    const column = columns.find((col) => col.key === key);
    if (column?.sortable === false) return;

    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Handle filter change
  const handleFilterChange = (key: string, type: string, value: any) => {
    const column = columns.find((col) => col.key === key);
    if (!column || column.filterable !== true) return;

    setFilters((prev: any) => {
      const existingFilterIndex = prev.findIndex((f: any) => f.key === key);
      if (existingFilterIndex >= 0) {
        const updated = [...prev];
        updated[existingFilterIndex] = {
          ...updated[existingFilterIndex],
          value,
        };
        return updated;
      }
      return [...prev, { key, type, value }];
    });
    setCurrentPage(1);
  };

  // Remove a specific filter
  const removeFilter = (key: string) => {
    setFilters((prev) => prev.filter((f) => f.key !== key));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters([]);
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Pagination controls
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Get min/max values for range filters
  const getMinMaxValues = (key: string) => {
    const values = data.map((item) => item[key]).filter((v) => v !== undefined);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  };

  // Get date range for date filters
  const getDateRange = (key: string) => {
    const dates = data
      .map((item) => (item[key] ? new Date(item[key]) : null))
      .filter((d) => d !== null) as Date[];

    if (dates.length === 0) return { min: new Date(), max: new Date() };

    return {
      min: new Date(Math.min(...dates.map((d) => d.getTime()))),
      max: new Date(Math.max(...dates.map((d) => d.getTime()))),
    };
  };

  // Toggle filter panel
  const toggleFilterPanel = (key: string) => {
    setActiveFilterPanel(activeFilterPanel === key ? null : key);
  };

  // Render filter input based on type
  const renderFilterInput = (column: ColumnConfig) => {
    const filterType = column.filterType || "select";
    const currentFilter = filters.find((f) => f.key === column.key);
    const currentValue = currentFilter?.value;

    switch (filterType) {
      case "multiselect":
        return (
          <div className="space-y-2">
            <select
              multiple
              value={currentValue || []}
              onChange={(e) => {
                const options = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                handleFilterChange(column.key, "multiselect", options);
              }}
              className="w-full px-3 py-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white h-auto min-h-[42px]"
            >
              {getUniqueValues(column.key).map((value: any) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <div className="text-xs text-gray-500">
              Hold Ctrl/Cmd to select multiple
            </div>
          </div>
        );

      case "range":
        const { min, max } = getMinMaxValues(column.key);
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Min</label>
              <input
                type="number"
                min={min}
                max={max}
                value={currentValue?.min || ""}
                onChange={(e) =>
                  handleFilterChange(column.key, "range", {
                    ...currentValue,
                    min: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                placeholder={`Min (${min})`}
                className="w-full px-3 py-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Max</label>
              <input
                type="number"
                min={min}
                max={max}
                value={currentValue?.max || ""}
                onChange={(e) =>
                  handleFilterChange(column.key, "range", {
                    ...currentValue,
                    max: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                placeholder={`Max (${max})`}
                className="w-full px-3 py-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        );

      case "toggle":
        return (
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!!currentValue}
                onChange={(e) =>
                  handleFilterChange(column.key, "toggle", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                {currentValue ? "Yes" : "No"}
              </span>
            </label>
          </div>
        );

      case "text":
        return (
          <input
            type="text"
            value={currentValue || ""}
            onChange={(e) =>
              handleFilterChange(column.key, "text", e.target.value)
            }
            placeholder={`Filter ${column.header}`}
            className="w-full px-3 py-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={currentValue || ""}
            onChange={(e) =>
              handleFilterChange(
                column.key,
                "number",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            placeholder={`Filter ${column.header}`}
            className="w-full px-3 py-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        );

      case "date":
        return (
          <div className="relative">
            <DatePicker
              selected={currentValue ? new Date(currentValue) : null}
              onChange={(date: any) =>
                handleFilterChange(column.key, "date", date)
              }
              placeholderText={`Select date`}
              className="w-full px-3 py-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              dateFormat="yyyy-MM-dd"
            />
            <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        );

      case "daterange":
        const dateRange = getDateRange(column.key);
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Start Date
              </label>
              <div className="relative">
                <DatePicker
                  selected={
                    currentValue?.start ? new Date(currentValue.start) : null
                  }
                  onChange={(date: any) =>
                    handleFilterChange(column.key, "daterange", {
                      ...currentValue,
                      start: date,
                    })
                  }
                  selectsStart
                  startDate={
                    currentValue?.start ? new Date(currentValue.start) : null
                  }
                  endDate={
                    currentValue?.end ? new Date(currentValue.end) : null
                  }
                  minDate={dateRange.min}
                  maxDate={dateRange.max}
                  placeholderText="Start date"
                  className="w-full px-3 py-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  dateFormat="yyyy-MM-dd"
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                End Date
              </label>
              <div className="relative">
                <DatePicker
                  selected={
                    currentValue?.end ? new Date(currentValue.end) : null
                  }
                  onChange={(date: any) =>
                    handleFilterChange(column.key, "daterange", {
                      ...currentValue,
                      end: date,
                    })
                  }
                  selectsEnd
                  startDate={
                    currentValue?.start ? new Date(currentValue.start) : null
                  }
                  endDate={
                    currentValue?.end ? new Date(currentValue.end) : null
                  }
                  minDate={currentValue?.start || dateRange.min}
                  maxDate={dateRange.max}
                  placeholderText="End date"
                  className="w-full px-3 py-2 border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  dateFormat="yyyy-MM-dd"
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        );

      default: // select
        return (
          <select
            value={currentValue || "all"}
            onChange={(e) =>
              handleFilterChange(
                column.key,
                "select",
                e.target.value === "all" ? null : e.target.value
              )
            }
            className="w-full px-3 py-1  rounded-md focus:outline-none bg-white"
          >
            <option value="all">All</option>
            {getUniqueValues(column.key).map((value: any) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        );
    }
  };

  // Format filter value for display in chips
  const formatFilterValue = (filter: FilterConfig) => {
    switch (filter.type) {
      case "multiselect":
        return filter.value.join(", ");
      case "range":
        return [
          filter.value.min !== undefined ? `≥${filter.value.min}` : "",
          filter.value.max !== undefined ? `≤${filter.value.max}` : "",
        ]
          .filter(Boolean)
          .join(" and ");
      case "toggle":
        return filter.value ? "Yes" : "No";
      case "date":
        return new Date(filter.value).toLocaleDateString();
      case "daterange":
        return [
          filter.value.start
            ? new Date(filter.value.start).toLocaleDateString()
            : "",
          filter.value.end
            ? new Date(filter.value.end).toLocaleDateString()
            : "",
        ]
          .filter(Boolean)
          .join(" to ");
      default:
        return filter.value;
    }
  };

  // Column filter indicators
  const hasColumnFilter = (key: string) => {
    const column = columns.find((col) => col.key === key);
    return column?.filterable === true && filters.some((f) => f.key === key);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Search and Filter Controls */}
      {(searchable || filterable) && (
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2">
              {filterable && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-1 py-2 cursor-pointer  bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors text-[10px] font-[500]"
                >
                  <Funnel className="w-3 h-3" />
                  {filters.length > 0 ? (
                    <span className="flex items-center justify-center text-[13px] bg-purple-600 text-white rounded-full">
                      {filters.length}
                    </span>
                  ) : (
                    "Filter"
                  )}
                </button>
              )}
              {(searchTerm || filters.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors font-medium text-sm cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>
            {/* Search Bar - moved to right */}
            {searchable && (
              <div className="relative flex-1 max-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-1 border-2 border-gray-200 rounded-lg focus:outline-none outline-none w-full text-sm font-[400]"
                />
              </div>
            )}
          </div>

          {/* Filter Chips */}
          {filters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters
                .filter((filter) => {
                  const column = columns.find((col) => col.key === filter.key);
                  return column?.filterable === true;
                })
                .map((filter) => {
                  const column = columns.find((col) => col.key === filter.key);
                  return (
                    <div
                      key={filter.key}
                      className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-white rounded-full text-sm"
                    >
                      <span className="font-semibold">{column?.header}:</span>
                      <span>{formatFilterValue(filter)}</span>
                      <button
                        onClick={() => removeFilter(filter.key)}
                        className="text-white hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
            </div>
          )}

          {/* Filter Panel */}
          {filterable && showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 p-2 bg-[#55bd42] to-blue-50 rounded-lg border border-purple-200 shadow-sm">
              {columns
                .filter((col) => col.filterable === true)
                .map((column) => (
                  <div key={column.key} className="space-y-2">
                    <div
                      onClick={() => toggleFilterPanel(column.key)}
                      className="flex items-center justify-between p-1 rounded-sm cursor-pointer"
                    >
                      <label className="block text-sm text-white">
                        {column.header}
                      </label>
                      <button className="text-white hover:text-gray-50">
                        {activeFilterPanel === column.key ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {activeFilterPanel === column.key && (
                      <div className="mt-2">{renderFilterInput(column)}</div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Results Summary */}
      <div className="mb-4 text-[10px] text-gray-600">
        Showing {startIndex + 1}-
        {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
        {filteredData.length} results
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg mx-auto max-w-full">
        <table className="w-full overflow-x-auto">
          <thead className="bg-[#55bd42]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-1 py-2 text-left text-[10px] font-semibold text-white whitespace-nowrap tracking-wider ${
                    sortable && (column.sortable ?? true)
                      ? "cursor-pointer hover:bg-purple-700 hover:bg-opacity-50"
                      : ""
                  }`}
                  onClick={() =>
                    sortable &&
                    (column.sortable ?? true) &&
                    handleSort(column.key)
                  }
                >
                  <div className="flex items-center gap-1 leading-tight">
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-[10px]">{column.header}</span>
                      {hasColumnFilter(column.key) && (
                        <span className="text-[9px] font-normal text-yellow-200">
                          Filtered
                        </span>
                      )}
                    </div>
                    {sortable && (column.sortable ?? true) && (
                      <div className="flex flex-col">
                        <ChevronUp
                          className={`w-2.5 h-2.5 ${
                            sortConfig.key === column.key &&
                            sortConfig.direction === "asc"
                              ? "text-yellow-300"
                              : "text-white opacity-60"
                          }`}
                        />
                        <ChevronDown
                          className={`w-2.5 h-2.5 -mt-0.5 ${
                            sortConfig.key === column.key &&
                            sortConfig.direction === "desc"
                              ? "text-yellow-300"
                              : "text-white opacity-60"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr
                  key={index}
                  className={`hover:bg-purple-50 transition-colors duration-200 ${
                    onRowClick ? "cursor-pointer" : ""
                  } ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-3 py-3 whitespace-nowrap text-[12px] text-gray-800"
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500 font-medium"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[10px] text-gray-700">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 text-[10px] h-6 bg-white border-2 border-[#55bd42] rounded-md hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`w-6 h-6 text-[10px] cursor-pointer rounded-md font-medium ${
                      currentPage === pageNum
                        ? "bg-[#55bd42] text-white shadow-lg"
                        : "bg-white border-2 border-[#55bd42] hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 h-6 px-4 py-2 text-[10px] bg-white border-2 border-[#55bd42] rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const BookingTable: React.FC<{
  data?: any[];
  columns?: ColumnConfig[];
  heading?: any;
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  itemsPerPage?: number;
}> = ({
  data = [],
  columns = [],
  heading = "",
  searchable = true,
  filterable = true,
  sortable = true,
  itemsPerPage = 5,
}) => {
  const handleRowClick = (row: any) => {};
  const visibleColumns = columns.filter((col) => !col.hidden);
  const merged = heading ? Object.assign({}, ...heading) : "";
  return (
    <div className="from-gray-50 to-purple-50">
      {merged && (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[14px] font-bold text-gray-800 bg-[#55bd42] bg-clip-text text-transparent">
            {merged.heading}
          </h1>
          <h1 className="text-[12px] font-bold text-gray-800 bg-[#000] bg-clip-text text-transparent">
            {merged.price}
          </h1>
        </div>
      )}
      <DynamicTable
        data={data}
        columns={visibleColumns}
        itemsPerPage={itemsPerPage}
        searchable={searchable}
        filterable={filterable}
        sortable={sortable}
        onRowClick={handleRowClick}
        className="mx-auto"
      />
    </div>
  );
};

export default BookingTable;
