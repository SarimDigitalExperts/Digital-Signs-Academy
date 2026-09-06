import React, { useEffect, useState, useRef } from 'react';
import { formatTimerHms } from '../utils/formatters';

interface TimerProps {
  startTime: number | null; // epoch ms
  totalDurationSeconds?: number; // default 7200 (2 hours)
  onTimeExpired: () => void;
  isPaused?: boolean;
}

export const Timer: React.FC<TimerProps> = ({
  startTime,
  totalDurationSeconds = 7200,
  onTimeExpired,
  isPaused = false,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(totalDurationSeconds);
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    if (!startTime || isPaused) return;

    const calculateRemaining = () => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(0, totalDurationSeconds - elapsedSeconds);
      setSecondsRemaining(remaining);

      if (remaining <= 0 && !hasExpiredRef.current) {
        hasExpiredRef.current = true;
        onTimeExpired();
      }
    };

    // Calculate immediately
    calculateRemaining();

    // Run every second
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, [startTime, totalDurationSeconds, onTimeExpired, isPaused]);

  const { hours, minutes, seconds } = formatTimerHms(secondsRemaining);

  const isWarning = secondsRemaining <= 1800 && secondsRemaining > 600; // <= 30 mins
  const isUrgent = secondsRemaining <= 600; // <= 10 mins

  let timeTextColor = 'text-blue-600';
  let labelText = 'Remaining Time';

  if (isUrgent) {
    timeTextColor = 'text-red-600 animate-pulse';
    labelText = 'Urgent: Ending Soon';
  } else if (isWarning) {
    timeTextColor = 'text-orange-500';
    labelText = '< 30 Mins Left';
  }

  return (
    <div
      className="flex flex-col items-end shrink-0 select-none"
      role="timer"
      aria-live="polite"
      aria-label={`Time remaining: ${hours} hours ${minutes} minutes ${seconds} seconds`}
    >
      <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-wider">
        {labelText}
      </span>
      <div className={`text-lg sm:text-2xl font-mono font-bold ${timeTextColor} tabular-nums leading-none tracking-tight mt-0.5`}>
        <span>{hours}</span>
        <span className="mx-1 opacity-70">:</span>
        <span>{minutes}</span>
        <span className="mx-1 opacity-70">:</span>
        <span>{seconds}</span>
      </div>
    </div>
  );
};

