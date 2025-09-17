import React, { useState, useEffect } from 'react';
import './Countdown.css';

interface CountdownProps {
  targetDate: string; // ISO date string (e.g., "2024-12-31")
  text?: string; // Optional text to display before the countdown
  className?: string; // Optional CSS class for styling
}

const Countdown: React.FC<CountdownProps> = ({ 
  targetDate, 
  text = "", 
  className = "" 
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) {
    return (
      <div className={`countdown ${className}`}>
        {text && <span className="countdown-text">{text}</span>}
        <span className="countdown-expired">Event has passed</span>
      </div>
    );
  }

  return (
    <div className={`countdown ${className}`}>
      <div className="countdown-timer">
        <div className="countdown-unit">
          <span className="countdown-value">{timeLeft.days}</span>
          <span className="countdown-label">days</span>
        </div>
        <div className="countdown-unit">
          <span className="countdown-value">{timeLeft.hours}</span>
          <span className="countdown-label">hours</span>
        </div>
        <div className="countdown-unit">
          <span className="countdown-value">{timeLeft.minutes}</span>
          <span className="countdown-label">minutes</span>
        </div>
        <div className="countdown-unit">
          <span className="countdown-value">{timeLeft.seconds}</span>
          <span className="countdown-label">seconds</span>
        </div>
      </div>
      {text && <span className="countdown-text">{text}</span>}
    </div>
  );
};

export default Countdown;
