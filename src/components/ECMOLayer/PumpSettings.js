import React, { useState } from 'react';
import { Knob } from 'primereact/knob';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const PumpSettings = () => {
  const [flow, setFlow] = useState(3200);

  const handleChange = (newValue) => {
    setFlow(Math.min(6700, Math.max(600, newValue)));
  };

  const handleIncrement = () => {
    handleChange(flow + 100);
  };

  const handleDecrement = () => {
    handleChange(flow - 100);
  };

  const handleInputChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      handleChange(value);
    }
  };

  return (
    <div className="bg-white p-1 rounded-lg shadow-md w-32">
      <style>{`
        .custom-knob .p-knob-value {
          stroke: #991b1b !important;
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
          cursor: pointer;
        }
      `}</style>
      <h2 className="text-xs font-semibold text-center mb-1">Flow</h2>
      <div className="mb-2 flex flex-col items-center">
        <Knob
          value={flow}
          onChange={(e) => handleChange(e.value)}
          min={600}
          max={6700}
          valueTemplate={`${(flow / 1000).toFixed(1)}K\nrpm`}
          className="custom-knob"
          size={80}
          step={100}
          valueColor="#991b1b"
          rangeColor="#e5e7eb"
        />
      </div>
      <div className="flex items-center justify-center space-x-1 mt-2">
        <button className="control-button" onClick={handleDecrement}>-</button>
        <div className="lcd-display w-16">
          <InputText
            value={flow.toFixed(1)}
            onChange={handleInputChange}
            className="w-full text-right bg-transparent border-none text-xs p-0"
          />
        </div>
        <button className="control-button" onClick={handleIncrement}>+</button>
      </div>
    </div>
  );
};

export default PumpSettings;