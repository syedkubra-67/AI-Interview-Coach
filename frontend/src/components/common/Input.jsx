import React from 'react';

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  className = '',
  disabled = false,
  icon,
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full bg-slate-900/50 backdrop-blur-md text-sm border text-white rounded-xl py-3 transition-all duration-200 outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500/50 disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-11' : 'pl-4'} 
            ${error ? 'border-rose-500/50' : 'border-slate-800'}`}
        />
      </div>
      {error && <p className="text-xs text-rose-400 mt-1 font-medium">{error}</p>}
    </div>
  );
};

export default Input;
