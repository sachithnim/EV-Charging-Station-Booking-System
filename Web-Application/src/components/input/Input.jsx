import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({ 
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  icon: Icon,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className={`
        relative flex items-center border-2 rounded-xl bg-white transition-all duration-200
        ${focused ? 'border-primary-500 shadow-lg shadow-primary-500/10' : 'border-gray-200'}
        ${error ? 'border-red-500' : ''}
        hover:border-gray-300
      `}>
        {Icon && (
          <div className="pl-4 pr-2 text-gray-400 flex items-center">
            <Icon className="w-5 h-5" />
          </div>
        )}
        
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`flex-1 px-4 py-4 border-none outline-none text-base bg-transparent text-gray-800 placeholder-gray-400
            ${type === 'password' ? 'pr-12' : ''}  /* extra padding for eye icon */
          `}
          {...props}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      
      {error && (
        <span className="text-sm text-red-500 mt-1">{error}</span>
      )}
    </div>
  );
}