import React from "react";
import { FieldErrors, Path, UseFormRegister } from "react-hook-form";

interface FormField {
  id: string;
  name: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  label: string;
  options?: { value: string; label: string }[];
}

export interface FormData {
  [key: string]: string;
}

export interface AuthFormProps<T extends FormData> {
  fields: FormField[];
  register: UseFormRegister<T>;
  errors: FieldErrors;
  submitLabel: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string;
  footer?: React.ReactNode;
  isLoading?: boolean;
}

export function AuthForm<T extends FormData>({
  fields,
  register,
  errors,
  submitLabel,
  onSubmit,
  error,
  footer,
  isLoading = false,
}: AuthFormProps<T>) {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={onSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field.id} className="space-y-1">
            <label htmlFor={field.id} className="block text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            
            {field.type === "select" ? (
              <select
                id={field.id}
                {...register(field.name as Path<T>, { required: field.required })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                <option value="">Select an option</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                {...register(field.name as Path<T>, { required: field.required })}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            )}
            
            {errors[field.name] && (
              <p className="text-red-500 text-xs mt-1">
                {field.label} is required
              </p>
            )}
          </div>
        ))}
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {submitLabel}
        </button>
      </form>
      
      {footer && <div className="mt-4 text-center text-sm">{footer}</div>}
    </div>
  );
} 