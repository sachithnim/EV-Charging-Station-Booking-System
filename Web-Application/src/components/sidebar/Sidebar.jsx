import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Zap, 
  Calendar, 
  Menu,
  X,
  ChevronLeft
} from 'lucide-react';

const sidebarItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: LayoutDashboard
  },
  {
    name: 'EV Owners',
    path: '/ev-owner-management',
    icon: Users
  },
  {
    name: 'Charging Stations',
    path: '/charging-station-management',
    icon: Zap
  },
  {
    name: 'Bookings',
    path: '/booking-management',
    icon: Calendar
  }
];

export default function Sidebar({ isOpen, onClose, isMobile }) {
  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out
        flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isMobile ? 'w-80' : 'w-64'}
        lg:translate-x-0 lg:static lg:shadow-none lg:border-r lg:border-gray-200 lg:h-screen
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-success-500 rounded-xl flex items-center justify-center text-white">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">ChargePoint</h2>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
          
          {/* Close button for mobile */}
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={isMobile ? onClose : undefined}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-primary-500 to-success-500 text-white shadow-lg shadow-primary-500/30' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary-600'
                    } group-hover:scale-110`} />
                    <span className="font-medium">{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-success-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@chargepoint.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}