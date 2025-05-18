import React, { useState, useEffect, forwardRef } from 'react';
import { Input } from "@/components/ui/input";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, className, placeholder, disabled, ...props }, ref) => {
    const [formattedValue, setFormattedValue] = useState<string>('');

    // Função para formatar o número de telefone no padrão brasileiro
    const formatPhoneNumber = (phoneNumber: string) => {
      // Remove todos os caracteres não numéricos
      const numericValue = phoneNumber.replace(/\D/g, '');
      
      if (numericValue.length <= 2) {
        return numericValue;
      } else if (numericValue.length <= 6) {
        return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
      } else if (numericValue.length <= 10) {
        return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 6)}-${numericValue.slice(6)}`;
      } else {
        return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7, 11)}`;
      }
    };

    // Atualiza o valor formatado sempre que o valor real mudar
    useEffect(() => {
      if (value) {
        const formattedPhone = formatPhoneNumber(value);
        setFormattedValue(formattedPhone);
      } else {
        setFormattedValue('');
      }
    }, [value]);

    // Processa a entrada do usuário
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Remove todos os caracteres não numéricos para o valor real
      const numericValue = inputValue.replace(/\D/g, '');
      
      // Chama a função onChange com o valor numérico (não formatado)
      onChange(numericValue);
      
      // Atualiza o valor de exibição formatado
      setFormattedValue(formatPhoneNumber(numericValue));
    };

    return (
      <Input
        ref={ref}
        value={formattedValue}
        onChange={handleChange}
        maxLength={16} // (99) 99999-9999
        className={className}
        placeholder={placeholder}
        disabled={disabled}
        {...props}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";