import React, { useState, useEffect } from 'react';

interface Supporter {
  name: string;
  organization?: string;
}

interface SupporterTickerProps {
  className?: string;
}

const SupporterTicker: React.FC<SupporterTickerProps> = ({ className = '' }) => {
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
      ? `${supporter.name} — ${supporter.organization}`
      : supporter.name;
  };

  const renderChips = () => {
    if (loading) {
      return <span className="chip">Loading supporters...</span>;
    }

    if (error) {
      return <span className="chip">Supporters list temporarily unavailable</span>;
    }

    if (supporters.length === 0) {
      return <span className="chip">Be the first to join!</span>;
    }

    // Create chips for infinite scroll (duplicate the array)
    const allChips = [...supporters, ...supporters];
    
    return allChips.map((supporter, index) => (
      <span key={`${supporter.name}-${index}`} className="chip">
        {formatSupporter(supporter)}
      </span>
    ));
  };

  return (
    <div className={`ticker-container ${className}`}>
      <div className="ticker">
        <div className="ticker-track">
          {renderChips()}
        </div>
      </div>
    </div>
  );
};

export default SupporterTicker;
