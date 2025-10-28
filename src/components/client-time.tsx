'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

interface ClientTimeProps {
  date: Date;
  formatString: string;
  className?: string;
}

export function ClientTime({ date, formatString, className }: ClientTimeProps) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // Date needs to be a valid date object for format to work
    if (date) {
      setFormattedDate(format(new Date(date), formatString, { locale: nl }));
    }
  }, [date, formatString]);

  if (!formattedDate) {
    return null; // Of een laad-skelet
  }

  return <span className={className}>{formattedDate}</span>;
}
