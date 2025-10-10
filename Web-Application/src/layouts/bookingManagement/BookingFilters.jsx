import React from "react";
import { Search, Filter, Calendar, MapPin, CheckCircle } from "lucide-react";

const BookingFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  stationFilter,
  setStationFilter,
  dateFilter,
  setDateFilter,
  resetFilters,
  filteredCount,
  totalCount,
  uniqueStations,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search by Name or NIC
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="relative">
            <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Station Name
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={stationFilter}
              onChange={(e) => setStationFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer"
            >
              <option value="All">All Stations</option>
              {uniqueStations.map((station) => (
                <option key={station} value={station}>
                  {station}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold text-gray-900">{filteredCount}</span>{" "}
          of <span className="font-semibold text-gray-900">{totalCount}</span>{" "}
          bookings
        </p>
        {(searchTerm ||
          statusFilter !== "All" ||
          stationFilter !== "All" ||
          dateFilter) && (
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingFilters;
