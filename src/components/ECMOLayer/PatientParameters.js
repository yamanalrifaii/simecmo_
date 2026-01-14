import React, { useEffect } from 'react';
import { Slider } from 'primereact/slider';

const PatientParameters = ({ parameters = [], values = {}, onParameterChange }) => {
  // Initialize values when parameters change
  useEffect(() => {
    parameters.forEach(param => {
      if (values[param.key] === undefined) {
        onParameterChange(param.key, param.min);
      }
    });
  }, [parameters]);

  return (
    <div className="p-2 bg-white rounded-lg shadow">
      <div className="bg-gray-700 rounded overflow-hidden">
        <h3 className="text-white text-sm font-semibold p-2">Patient Parameters</h3>
        <div className="bg-white p-4">
          <div className="space-y-4">
            {parameters.map(param => (
              <div key={param.key} className="space-y-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {param.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <span className="text-sm text-gray-500">
                    {values[param.key]?.toFixed(2)} {param.unit}
                  </span>
                </div>
                <Slider
                  value={values[param.key] ?? param.min}
                  onChange={(e) => onParameterChange(param.key, e.value)}
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientParameters;