import React from "react";
import { Search, Filter, Zap } from "lucide-react";
import Switch from "../switch/Switch";
import Button from "../button/Button";

const SlotFilters = ({
  searchTerm,
  setSearchTerm,
  connectorTypeFilter,
  setConnectorTypeFilter,
  onlyActive,
  setOnlyActive,
  resetFilters,
  filteredCount,
  totalCount,
  uniqueConnectorTypes,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search by Code or Type
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search slots..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Connector Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Connector Type
          </label>
          <div className="relative">
            <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={connectorTypeFilter}
              onChange={(e) => setConnectorTypeFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer"
            >
              <option value="">All Types</option>
              {uniqueConnectorTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="flex items-center gap-3 h-11">
            <span className="text-sm text-gray-600 whitespace-nowrap">Only Active</span>
            <Switch
              checked={onlyActive}
              onChange={() => setOnlyActive((v) => !v)}
            />
          </div>
        </div>
      </div>

      {/* Filter Summary */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold text-gray-900">{filteredCount}</span>{" "}
          of <span className="font-semibold text-gray-900">{totalCount}</span>{" "}
          slots
        </p>
        {(searchTerm || connectorTypeFilter || !onlyActive) && (
          <Button
            variant="secondary"
            size="sm"
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default SlotFilters;
