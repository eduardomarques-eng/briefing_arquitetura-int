import React from 'react';
import { UseFormRegisterReturn, FieldError } from 'react-hook-form';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ReactCurrencyInput, { CurrencyInputProps as ReactCurrencyInputProps } from 'react-currency-input-field';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CurrencyInputProps extends Omit<ReactCurrencyInputProps, 'name'> {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ label, registration, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-[#5A5A5A] mb-2">{label}</label>
        <ReactCurrencyInput
          {...props}
          name={registration.name}
          onBlur={registration.onBlur}
          onValueChange={(value, name, values) => {
            // We need to manually trigger the onChange from react-hook-form
            // But react-currency-input-field's onChange signature is different
            // We'll pass the value to the registration's onChange
            const event = {
              target: {
                name: registration.name,
                value: value || ''
              }
            };
            registration.onChange(event);
          }}
          ref={(e) => {
            registration.ref(e);
            if (typeof ref === 'function') {
              ref(e);
            } else if (ref) {
              ref.current = e;
            }
          }}
          className={cn(
            "w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1A1A1A] focus:border-[#1A1A1A] outline-none transition-all duration-200 text-[#1A1A1A] placeholder:text-gray-400",
            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
            className
          )}
        />
        {error && <p className="text-red-500 text-xs mt-2">{error.message}</p>}
      </div>
    );
  }
);
CurrencyInput.displayName = 'CurrencyInput';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, registration, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-[#5A5A5A] mb-2">{label}</label>}
        <input
          {...registration}
          {...props}
          ref={ref}
          className={cn(
            "w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1A1A1A] focus:border-[#1A1A1A] outline-none transition-all duration-200 text-[#1A1A1A] placeholder:text-gray-400",
            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
            className
          )}
        />
        {error && <p className="text-red-500 text-xs mt-2">{error.message}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ label, registration, error, className, onIncrement, onDecrement, ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-[#5A5A5A] mb-2">{label}</label>
        <div className="relative flex items-center">
          {onDecrement && (
            <button
              type="button"
              onClick={onDecrement}
              className="absolute left-2 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              -
            </button>
          )}
          <input
            type="number"
            {...registration}
            {...props}
            ref={ref}
            className={cn(
              "w-full px-12 py-3 text-center bg-[#FAFAFA] border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1A1A1A] focus:border-[#1A1A1A] outline-none transition-all duration-200 text-[#1A1A1A] placeholder:text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
              error && "border-red-500 focus:ring-red-500 focus:border-red-500",
              className
            )}
          />
          {onIncrement && (
            <button
              type="button"
              onClick={onIncrement}
              className="absolute right-2 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              +
            </button>
          )}
        </div>
        {error && <p className="text-red-500 text-xs mt-2">{error.message}</p>}
      </div>
    );
  }
);
NumberInput.displayName = 'NumberInput';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, registration, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-[#5A5A5A] mb-2">{label}</label>
        <textarea
          {...registration}
          {...props}
          ref={ref}
          className={cn(
            "w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1A1A1A] focus:border-[#1A1A1A] outline-none transition-all duration-200 resize-y min-h-[120px] text-[#1A1A1A] placeholder:text-gray-400",
            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
            className
          )}
        />
        {error && <p className="text-red-500 text-xs mt-2">{error.message}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

interface RadioGroupProps {
  label: string;
  options: { label: string; value: string }[];
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

export const RadioGroup = ({ label, options, registration, error }: RadioGroupProps) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-[#5A5A5A] mb-3">{label}</label>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <label key={option.value} className="relative flex items-center cursor-pointer group">
            <input
              type="radio"
              value={option.value}
              {...registration}
              className="peer sr-only"
            />
            <div className="px-5 py-2.5 rounded-full border border-gray-200 bg-[#FAFAFA] text-[#5A5A5A] text-sm font-medium transition-all duration-200 peer-checked:bg-[#1A1A1A] peer-checked:text-white peer-checked:border-[#1A1A1A] hover:border-gray-300 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-[#1A1A1A]">
              {option.label}
            </div>
          </label>
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-2">{error.message}</p>}
    </div>
  );
};

interface CheckboxGroupProps {
  label: string;
  options: { label: string; value: string }[];
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

export const CheckboxGroup = ({ label, options, registration, error }: CheckboxGroupProps) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-[#5A5A5A] mb-3">{label}</label>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <label key={option.value} className="relative flex items-center cursor-pointer group">
            <input
              type="checkbox"
              value={option.value}
              {...registration}
              className="peer sr-only"
            />
            <div className="px-5 py-2.5 rounded-full border border-gray-200 bg-[#FAFAFA] text-[#5A5A5A] text-sm font-medium transition-all duration-200 peer-checked:bg-[#1A1A1A] peer-checked:text-white peer-checked:border-[#1A1A1A] hover:border-gray-300 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-[#1A1A1A]">
              {option.label}
            </div>
          </label>
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-2">{error.message}</p>}
    </div>
  );
};

interface ImageRadioGroupProps {
  label: string;
  options: { label: string; value: string; imageUrl: string }[];
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

export const ImageRadioGroup = ({ label, options, registration, error }: ImageRadioGroupProps) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-[#5A5A5A] mb-4">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {options.map((option) => (
          <label key={option.value} className="relative flex flex-col cursor-pointer group">
            <input
              type="radio"
              value={option.value}
              {...registration}
              className="peer sr-only"
            />
            <div className="overflow-hidden rounded-xl border-2 border-transparent transition-all duration-200 peer-checked:border-[#1A1A1A] peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-[#1A1A1A]">
              <div className="relative h-40 w-full">
                <img 
                  src={option.imageUrl} 
                  alt={option.label} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <span className="text-white font-medium text-sm">{option.label}</span>
              </div>
            </div>
            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/80 border border-gray-200 flex items-center justify-center opacity-0 scale-50 transition-all duration-200 peer-checked:opacity-100 peer-checked:scale-100 peer-checked:bg-[#1A1A1A] peer-checked:border-[#1A1A1A]">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </label>
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-2">{error.message}</p>}
    </div>
  );
};

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-2xl font-serif font-medium text-[#1A1A1A] border-b border-gray-100 pb-4 mb-8 mt-12 first:mt-0">
    {children}
  </h3>
);

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  helperText?: string;
}

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ label, registration, error, helperText, className, ...props }, ref) => {
    const [fileCount, setFileCount] = React.useState(0);
    const [localError, setLocalError] = React.useState<string | null>(null);

    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-[#5A5A5A] mb-2">{label}</label>
        <div className={cn(
          "relative flex flex-col items-center justify-center w-full px-4 py-8 bg-[#FAFAFA] border-2 border-dashed border-gray-200 rounded-xl transition-all duration-200 hover:bg-gray-50 hover:border-gray-300",
          (error || localError) && "border-red-500 bg-red-50",
          className
        )}>
          <svg className="w-8 h-8 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <p className="text-sm text-gray-600 font-medium text-center">
            {fileCount > 0 ? `${fileCount} arquivo(s) selecionado(s)` : 'Clique para selecionar ou arraste os arquivos'}
          </p>
          {helperText && <p className="text-xs text-gray-400 mt-2 text-center">{helperText}</p>}
          <input
            type="file"
            {...registration}
            {...props}
            onChange={(e) => {
              if (props.multiple && e.target.files && e.target.files.length > 5) {
                setLocalError('Por favor, selecione no máximo 5 arquivos.');
                e.target.value = '';
                setFileCount(0);
                registration.onChange(e);
                return;
              }
              setLocalError(null);
              setFileCount(e.target.files?.length || 0);
              registration.onChange(e);
            }}
            ref={(e) => {
              registration.ref(e);
              if (typeof ref === 'function') {
                ref(e);
              } else if (ref) {
                ref.current = e;
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        {(error || localError) && <p className="text-red-500 text-xs mt-2">{error?.message || localError}</p>}
      </div>
    );
  }
);
FileInput.displayName = 'FileInput';
