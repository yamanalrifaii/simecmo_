// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import ECMOLayer from './ECMOLayer/ECMOLayer';
import MLLayer from './MLLayer/MLLayer';

function Dashboard({ scenarioType, currentStep, values, setValues }) {
  const [predictions, setPredictions] = useState([]);
  const [initialValues, setInitialValues] = useState(null);
  const [currentStates, setCurrentStates] = useState(null);
  const [firstInitialValues, setFirstInitialValues] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Reset states when scenario or parameter changes
  useEffect(() => {
    // Initialize parameter values when scenario type changes
    const scenarioParams = {
      oxygenation: [
        { key: 'hb', min: 5 },
        { key: 'mvo2', min: 100 },
        { key: 'dlco', min: 1 },
        { key: 'shunt_fraction', min: 0 },
        { key: 'fdo2', min: 0.21 }
      ],
      hemodynamics: [
        { key: 'arterial_r', min: 0 },
        { key: 'venous_r', min: 0 },
        { key: 'pvr', min: 0 },
        { key: 'svr', min: 1 }
      ],
      cardiovascular: [
        { key: 'cv_heartrate_value', min: 40 },
        { key: 'cv_volume_value', min: 200 },
        { key: 'cv_eeslv_value', min: 0.2 },
        { key: 'cv_eesrv_value', min: 0.5 }
      ],
      ecmoparameters: [
        { key: 'rpm', min: 0.6 },
        { key: 'oxygenator_resistance', min: 0 },
        { key: 'sweep_flow', min: 0 },
        { key: 'diffusion', min: 0.0001 }
      ]
    };
  
    if (scenarioParams[scenarioType]) {
      const initialValues = {};
      scenarioParams[scenarioType].forEach(param => {
        initialValues[param.key] = param.min;
      });
      setValues(initialValues); // Replace instead of merge
    }
  }, [scenarioType]);

  const handleOutputValuesChange = (values) => {
    console.log('Received initial values:', values);
    setInitialValues(values);
    setCurrentStates(values);
    setFirstInitialValues(prev => prev === null ? values : prev);
  };

 // In Dashboard.js, update the handleParameterChange function:

const handleParameterChange = async (parameter, value) => {
  // First normalize the parameter name
  const normalizedParameter = parameter.toLowerCase();
  
  // Map frontend parameter names to backend parameter names
  const parameterMap = {
    'cv_heartrate_value': 'heart_rate',
    'cv_volume_value': 'volume',
    'cv_eeslv_value': 'eeslv',
    'cv_eesrv_value': 'eesrv'
  };

  // Get the mapped parameter name for cardiovascular scenario
  const mappedParameter = scenarioType === 'cardiovascular' ? 
    parameterMap[parameter] || normalizedParameter : 
    normalizedParameter;

  console.log('Parameter mapping:', {
    original: parameter,
    normalized: normalizedParameter,
    mapped: mappedParameter,
    scenarioType
  });

  if (!initialValues) {
    console.error('No initial values available for prediction');
    return;
  }

  const previousValue = values[parameter];
  setValues(prev => ({ ...prev, [parameter]: value }));

  if (currentStep?.parameter.toLowerCase() === normalizedParameter) {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenario: scenarioType,
          parameter: mappedParameter,
          initialValue: previousValue || 0,
          targetValue: value,
          initialStates: currentStates || {}
        })
      });

      const data = await response.json();
      
      console.log('Prediction response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Prediction request failed');
      }

      setPredictions(data);
      
      if (data && data.length > 0) {
        const latestPrediction = data[data.length - 1];
        const { time, input_value, ...newStates } = latestPrediction;
        setCurrentStates(newStates);
      }

    } catch (err) {
      console.error('Prediction error:', err);
      setError(err.message);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  }
};

  const isECMOScenario = scenarioType === 'ecmoparameters';

  return (
    <div className="h-screen flex flex-col bg-white p-4">
      <div className="flex flex-1 gap-4 min-h-0">
        {isECMOScenario ? (
          <>
            <div className="w-3/4 bg-gray-100 rounded-lg shadow-lg p-2 flex flex-col">
              <h2 className="text-sm font-semibold mb-2 text-gray-700 text-center">ECMO Layer</h2>
              <div className="flex-1 overflow-auto">
                <ECMOLayer
                  values={values}
                  onParameterChange={handleParameterChange}
                  onOutputValuesChange={handleOutputValuesChange}
                  predictionValues={predictions[predictions.length - 1]}
                  currentStep={currentStep}
                  scenarioType={scenarioType}
                  showECMODiagram={true}
                />
              </div>
            </div>
            <div className="w-3/5 bg-gray-100 rounded-lg shadow-lg p-2 flex flex-col">
              <h2 className="text-sm font-semibold mb-2 text-gray-700 text-center">ML Layer</h2>
              <div className="flex-1 overflow-auto">
                <MLLayer 
                  scenarioType={scenarioType}
                  currentStep={currentStep}
                  values={values}
                  predictions={predictions}
                  initialValues={firstInitialValues}
                  currentStates={currentStates}
                  error={error}
                  loading={loading}
                  className="h-full"
                />
              </div>
            </div>
          </>
        ) : (
          // Other scenarios layout (cardio, hemo, oxygenation)
          <>
            <div className="w-3/5 bg-gray-100 rounded-lg shadow-lg p-2 flex flex-col">
              <h2 className="text-sm font-semibold mb-2 text-gray-700 text-center">Parameters</h2>
              <div className="flex-1 overflow-auto">
                <ECMOLayer
                  values={values}
                  onParameterChange={handleParameterChange}
                  onOutputValuesChange={handleOutputValuesChange}
                  predictionValues={predictions[predictions.length - 1]}
                  currentStep={currentStep}
                  scenarioType={scenarioType}
                  showECMODiagram={false}
                />
              </div>
            </div>
            <div className="w-3/4 bg-gray-100 rounded-lg shadow-lg p-2 flex flex-col">
              <h2 className="text-sm font-semibold mb-2 text-gray-700 text-center">ML Layer</h2>
              <div className="flex-1 overflow-auto">
                <MLLayer 
                  scenarioType={scenarioType}
                  currentStep={currentStep}
                  values={values}
                  predictions={predictions}
                  initialValues={firstInitialValues}
                  currentStates={currentStates}
                  error={error}
                  loading={loading}
                  className="h-full"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;