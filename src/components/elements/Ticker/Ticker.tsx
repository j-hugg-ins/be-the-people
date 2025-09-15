import React, { useState, useEffect } from 'react';
import type { Supporter, TickerProps } from '@/types/supporter';
import './Ticker.css';

const Ticker: React.FC<TickerProps> = ({ 
  className = '', 
  maxRows = 8,
  namesPerRow = 8
}) => {
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Google Sheets Configuration
  const SHEET_ID = "14u0coPEVng0pW9zxgTUblAy-gU1iv_1w3Dz2m7HTlGo";
  const SHEET_NAME = "Sheet1";
  const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;

  const loadSupporters = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(SHEET_URL);
      const raw = await response.text();
      const json = JSON.parse(raw.match(/{.*}/s)?.[0] || '{}');
      const rows = json.table?.rows || [];
      
      const supportersData = rows.slice(1).map((row: any) => {
        const name = row.c?.[0]?.v ?? "";
        const org = row.c?.[1]?.v ?? "";
        return {
          name: name.trim(),
          organization: org.trim() || undefined
        };
      }).filter((supporter: Supporter) => supporter.name !== "");

      setSupporters(supportersData);
    } catch (err) {
      console.error("Error loading supporter data:", err);
      setError("Unable to load supporters list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSupporters();
    
    // Refresh supporters every 5 minutes
    const interval = setInterval(loadSupporters, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatSupporter = (supporter: Supporter): string => {
    return supporter.organization 
      ? `${supporter.name}, ${supporter.organization}`
      : supporter.name;
  };

  const createTickerRows = () => {
    if (loading) {
      return (
        <div className="ticker-row">
          <span className="chip">Loading supporters...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="ticker-row">
          <span className="chip">Supporters list temporarily unavailable</span>
        </div>
      );
    }

    if (supporters.length === 0) {
      return (
        <div className="ticker-row">
          <span className="chip">Be the first to join!</span>
        </div>
      );
    }

    // Create rows with enough content for seamless looping
    const rows = [];
    for (let rowIndex = 0; rowIndex < maxRows; rowIndex++) {
      // Create enough content to fill screen width + extra for seamless loop
      // We need at least 3x the screen width worth of content
      const rowContent = [];
      const contentPerRow = Math.max(namesPerRow * 3, 20); // Ensure minimum content
      
      // Create a shuffled copy of supporters for this row
      const shuffledSupporters = [...supporters].sort(() => Math.random() - 0.5);
      
      // Fill the row with randomized supporters
      for (let i = 0; i < contentPerRow; i++) {
        const supporter = shuffledSupporters[i % shuffledSupporters.length];
        rowContent.push(supporter);
      }

      // Calculate opacity: starts at 1.0 for top row, decreases to 0.1 for bottom row
      // With 8 rows: (1.0 - 0.1) / 7 = 0.129 per row
      const opacity = 1.0 - (rowIndex * 0.129);
      const finalOpacity = Math.max(opacity, 0.1);

      rows.push(
        <div 
          key={rowIndex} 
          className="ticker-row"
          style={{ opacity: finalOpacity }}
        >
          {rowContent.map((supporter, index) => (
            <React.Fragment key={`${supporter.name}-${rowIndex}-${index}`}>
              <span className="chip">
                {formatSupporter(supporter)}
              </span>
              {index < rowContent.length - 1 && (
                <span className="separator"> — </span>
              )}
            </React.Fragment>
          ))}
        </div>
      );
    }

    return rows;
  };

  return (
    <div className={`expanded-ticker-container ${className}`}>
      <div className="expanded-ticker">
        {createTickerRows()}
      </div>
    </div>
  );
};

export default Ticker;
