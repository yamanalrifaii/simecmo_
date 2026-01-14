import React from 'react';
import { Knob } from 'primereact/knob';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const PumpSettings = ({
  rpm,
  onRpmChange,
  disabled = false
}) => {
  const handleChange = (newValue) => {
    if (disabled) return;
    const value = Math.min(6700, Math.max(600, newValue));
    onRpmChange(value);
  };

  const handleIncrement = () => handleChange(rpm + 100);
  const handleDecrement = () => handleChange(rpm - 100);

  const handleInputChange = (e) => {
    if (disabled) return;
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      handleChange(value);
    }
  };

  return (
    <div className={`bg-white p-1 rounded-lg shadow-md w-32 ${disabled ? 'opacity-70' : ''}`}>
      <style>{`
        .custom-knob .p-knob-value {
          stroke: ${disabled ? '#cccccc' : '#991b1b'} !important;
          font-size: 14px !important;
        }
        .custom-knob .p-knob-text {
          font-size: 16px !important;
        }
        .lcd-display {
          background-color: #e0e0e0;
          border: 1px solid #999;
          padding: 2px;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          text-align: center;
        }
        .control-button {
          color: black;
          border: none;
          padding: 2px 4px;
          font-size: 12px;
          cursor: ${disabled ? 'not-allowed' : 'pointer'};
          opacity: ${disabled ? '0.5' : '1'};
        }
      `}</style>
      <h2 className="text-xs font-semibold text-center mb-1">Flow</h2>
      <div className="mb-2 flex flex-col items-center">
        <Knob
          value={rpm}
          onChange={(e) => handleChange(e.value)}
          min={600}
          max={6700}
          valueTemplate={`${(rpm / 1000).toFixed(1)}K\nrpm`}
          className="custom-knob"
          size={80}
          step={100}
          valueColor={disabled ? '#cccccc' : '#991b1b'}
          rangeColor="#e5e7eb"
          disabled={disabled}
        />
      </div>
      <div className="flex items-center justify-center space-x-1 mt-2">
        <button 
          className="control-button" 
          onClick={handleDecrement}
          disabled={disabled}
        />
      </div>
      <div className="flex items-center justify-center space-x-1 mt-2">
        <button 
          className="control-button" 
          onClick={handleDecrement}
          disabled={disabled}
          aria-label="Decrease RPM"
        >
          -
        </button>
        <div className="lcd-display w-16">
          <InputText
            value={rpm.toFixed(1)}
            onChange={handleInputChange}
            className={`w-full text-right bg-transparent border-none text-xs p-0 ${disabled ? 'input-disabled' : ''}`}
            disabled={disabled}
            aria-label="RPM value"
          />
        </div>
        <button 
          className="control-button" 
          onClick={handleIncrement}
          disabled={disabled}
          aria-label="Increase RPM"
        >
          +
        </button>
      </div>
      <div className="text-xs text-center mt-2 text-gray-500">
        {disabled ? 'Controls disabled' : ``}
      </div>
    </div>
  );
};

export default PumpSettings; 