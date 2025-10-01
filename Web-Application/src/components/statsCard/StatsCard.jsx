export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  iconColor = 'blue',
  valueColor = 'gray'
}) {
  const iconColorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    gray: 'bg-gray-100 text-gray-600'
  };

  const valueColorClasses = {
    blue: 'text-blue-600',
    red: 'text-red-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    gray: 'text-gray-900'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${valueColorClasses[valueColor]}`}>
            {value}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColorClasses[iconColor]}`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>
    </div>
  );
}