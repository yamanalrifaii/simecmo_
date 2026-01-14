// DataLayer.js
import React, { useState, useEffect } from "react";
import { Slider } from 'primereact/slider';
import '../../css/DataLayer.css';

function DataLayer({ scenarioType, onParameterChange }) {
  const [values, setValues] = useState({});
  const [parameters, setParameters] = useState([]);

  useEffect(() => {
    // Configure parameters based on the scenarioType
    const scenarioParams = {
      oxygenation: [
        { key: 'Hb', min: 5, max: 20, step: 0.5, unit: 'g/dL' },
        { key: 'MVO2', min: 100, max: 1500, step: 5, unit: 'mL/min' },
        { key: 'DLCO', min: 1, max: 100, step: 1, unit: 'mL/min/mmHg' },
        { key: 'shunt_fraction', min: 0, max: 100, step: 1, unit: '%' },
        { key: 'FDO2', min: 0.21, max: 1.00, step: 0.05, unit: '' }
      ],
      hemodynamics: [
        { key: 'arterial_r', min: 0, max: 60, step: 0.1, unit: 'mmHg·s/mL' },
        { key: 'venous_r', min: 0, max: 600, step: 0.1, unit: 'mmHg·s/mL' },
        { key: 'PVR', min: 0, max: 80, step: 0.10, unit: 'woods units' },
        { key: 'SVR', min: 1, max: 100, step: 0.10, unit: 'woods units' }
      ], 
      cardiovascular: [
        { key: 'cv_heartrate_value', min: 40, max: 210, step: 1, unit: 'bpm' },
        { key: 'cv_volume_value', min: 200, max: 5000, step: 5, unit: 'mL' },
        { key: 'cv_eeslv_value', min: 0.2, max: 10.0, step: 0.1, unit: 'mmHg/mL' },
        { key: 'cv_eesrv_value', min: 0.5, max: 5.0, step: 0.1, unit: 'mmHg/mL' }
    ], 
      ecmoParameters: [
        { key: 'rpm', min: 0.6, max: 6.7, step: 0.1, unit: 'RPM' },
        { key: 'oxygenator_resistance', min: 0, max: 200.0, step: 0.1, unit: 'mmHg/L/min' },
        { key: 'sweep_flow', min: 0, max: 10, step: 0.5, unit: 'L/min' },
        { key: 'diffusion', min: 0.0001, max: 0.01, step: 0.1, unit: 'L/min' }
      ]
    };

    setParameters(scenarioParams[scenarioType] || []);
    setValues(prevValues => {
      const updatedValues = {};
      (scenarioParams[scenarioType] || []).forEach(param => {
        updatedValues[param.key] = prevValues[param.key] || param.min;
      });
      return updatedValues;
    });
  }, [scenarioType]);

  const handleChange = (key, newValue) => {
    setValues(prev => ({ ...prev, [key]: newValue }));
    onParameterChange(key, newValue);
  };

  return (
    <div className="data-layer-container">
      <div className="section-container">
        <div className="section-header">
          <h3>Patient Parameters</h3>
        </div>
        <div className="parameters-group">
          {parameters.map(param => (
            <div key={param.key} className="parameter-row">
              <div className="parameter-header">
                <span className="parameter-label">
                  {param.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                <span className="parameter-value">
                  {values[param.key]} {param.unit}
                </span>
              </div>
              <div className="slider-container">
                <Slider
                  value={values[param.key]}
                  onChange={(e) => handleChange(param.key, e.value)}
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  className="modern-slider"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DataLayer;
