import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { usersApi } from '../api/users.api';

type Currency = {
  code: string;
  symbol: string;
  name: string;
};

const currencies: Record<string, Currency> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  NPR: { code: 'NPR', symbol: 'Rs.', name: 'Nepali Rupee' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
};

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (code: string) => Promise<void>;
  formatCurrency: (amount: number | string) => string;
  availableCurrencies: Currency[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currencyCode, setCurrencyCode] = useState<string>('NPR');

  useEffect(() => {
    if (user?.currency) {
      setCurrencyCode(user.currency);
    }
  }, [user]);

  const currency = currencies[currencyCode] || currencies['NPR'];

  const setCurrency = async (code: string) => {
    if (!user) return;
    try {
      await usersApi.update(user.id, { currency: code });
      setCurrencyCode(code);
    } catch (error) {
      console.error('Failed to update currency', error);
      throw error;
    }
  };

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return `${currency.symbol} 0`;

    // Simple formatting
    let formattedNum = num.toLocaleString();

    // Handle 'k' or 'm' if they were already there? No, usually amount is raw numbers.
    // But the user had "$ 54k" in their mockup.

    return `${currency.symbol} ${formattedNum}`;
  };

  const availableCurrencies = Object.values(currencies);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency, availableCurrencies }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
