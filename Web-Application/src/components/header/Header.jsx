import { Menu, Bell, Search, User } from 'lucide-react';

export default function Header({ onMenuClick }) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 lg:px-6 lg:py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          
          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2 w-80">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search stations, bookings, users..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Search Button */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </span>
          </button>
          
          {/* User Profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-800">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <button className="w-10 h-10 bg-gradient-to-br from-primary-500 to-success-500 rounded-full flex items-center justify-center text-white font-semibold hover:shadow-lg transition-all duration-200">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}