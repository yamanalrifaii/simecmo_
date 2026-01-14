import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { predictionInterpreter } from '../../Services/PredictionInterpreterService';
import InterpretationPanel from '../../Services/InterpretationPanel';

const MLLayer = ({ scenarioType, currentStep, predictions, initialValues, error, loading }) => {
  const [activeTab, setActiveTab] = useState('trends');
  const [interpretationState, setInterpretationState] = useState({
    data: null,
    loading: false,
    error: null,
    lastParams: null
  });

  // Memoize color palette to prevent recreation
  const colorPalette = useMemo(() => ({
     // Blood gas parameters
  caSys_pO2: '#8884d8',
  cvSys_pO2: '#82ca9d',
  caSys_O2sat: '#ffc658',
  cvSys_O2sat: '#ff7300',
  bgDO2: '#d0ed57',
  caSys_pH: '#a4de6c',
  cvSys_pH: '#8dd1e1',
  caSys_HCO3: '#f45b69',
  cvSys_HCO3: '#888888',
  caSys_BE: '#b39ddb',
  
  // Hemodynamic parameters
  paosys: '#4caf50',
  paodia: '#2196f3',
  paoavg: '#9c27b0',
  col: '#ff5722',
  cor: '#795548',
  
  // ECMO parameters
  ecmop1: '#3f51b5',
  ppcw: '#009688',
  ppasys: '#e91e63',
  ecmoUnitFlow: '#ffd700',
  
  // Flow parameters
  left_flow: '#00bcd4',
  right_flow: '#cddc39',
  
  // Pressure parameters
  pcv: '#ff9800',
  svr: '#607d8b',
  
  // Default color for any unlisted parameters
  default: '#757575'
  }), []);

  // Memoize the parameter key for comparison
  const parameterKey = useMemo(() => {
    return `${scenarioType}-${currentStep?.parameter}-${JSON.stringify(predictions)}`;
  }, [scenarioType, currentStep?.parameter, predictions]);

  //Get interpretation
  const getInterpretation = useCallback(async () => {
    if (!predictions?.length || !currentStep?.parameter || !initialValues) return;

    if (interpretationState.lastParams === parameterKey) return;

    try {
      setInterpretationState(prev => ({
        ...prev,
        loading: true,
        error: null,
        lastParams: parameterKey
      }));

      const result = await predictionInterpreter.interpretPredictions(
        scenarioType,
        currentStep.parameter,
        predictions,
        initialValues
      );

      setInterpretationState(prev => ({
        ...prev,
        data: result,
        loading: false,
        error: null
      }));
    } catch (err) {
      console.error('Interpretation error:', err);
      setInterpretationState(prev => ({
        ...prev,
        data: null,
        loading: false,
        error: 'Failed to get AI interpretation'
      }));
    }
  }, [predictions, currentStep, scenarioType, initialValues, parameterKey]);

  // Effect for fetching interpretation
  useEffect(() => {
    let mounted = true;
    
    if (mounted && parameterKey !== interpretationState.lastParams) {
      getInterpretation();
    }

    return () => {
      mounted = false;
    };
  }, [getInterpretation, parameterKey]);

  // Prepare chart data
  const { trendData, comparisonData, outputParameters, finalPrediction } = useMemo(() => {
    if (!predictions?.length || !initialValues) {
      return { trendData: [], comparisonData: [], outputParameters: [], finalPrediction: {} };
    }

    const outputParams = Object.keys(initialValues);
    const final = predictions[predictions.length - 1] || {};

    return {
      trendData: [
        { time: 0, ...initialValues },
        ...predictions.map((pred, index) => ({
          time: index + 1,
          ...pred
        }))
      ],
      comparisonData: [
        { name: 'Initial', ...initialValues },
        { name: 'Predicted', ...final }
      ],
      outputParameters: outputParams,
      finalPrediction: final
    };
  }, [predictions, initialValues]);

  // Early return conditions
  if (error) {
    return <div className="p-4"><Message severity="error" text={error} /></div>;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" animationDuration=".5s" />
      </div>
    );
  }

  if (!currentStep?.parameter) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        Select a parameter to see predictions
      </div>
    );
  }

  if (!predictions?.length) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        No predictions available
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 p-4">
      {/* Visualization Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-2xl font-bold mb-4">
          {scenarioType?.charAt(0).toUpperCase() + scenarioType?.slice(1)} - {currentStep?.parameter?.toUpperCase()} Prediction Results
        </div>

        <div className="flex mb-4">
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === 'trends' 
                ? 'bg-red text-white rounded-l-md'
                : 'bg-gray-200 text-black rounded-l-md hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('trends')}
          >
            Trends
          </button>
          <button
            className={`px-4 py-2 font-semibold ${
              activeTab === 'comparison' 
                ? 'bg-red text-white rounded-r-md'
                : 'bg-gray-200 text-black rounded-r-md hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('comparison')}
          >
            Comparison
          </button>
        </div>

        <div className="h-96">
          {activeTab === 'trends' ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" label={{ value: 'Time Steps', position: 'bottom' }} />
                <YAxis />
                <Tooltip formatter={(value) => value?.toFixed(2)} labelFormatter={(label) => `Step ${label}`} />
                <Legend />
                {outputParameters.map(param => (
                  <Line
                    key={param}
                    type="monotone"
                    dataKey={param}
                    stroke={colorPalette[param]}
                    dot={{ r: 3 }}
                    name={param}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => value?.toFixed(2)} />
                <Legend />
                {outputParameters.map(param => (
                  <Bar
                    key={param}
                    dataKey={param}
                    fill={colorPalette[param]}
                    name={param}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-bold mb-4">Prediction Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {outputParameters.map(param => (
            <div key={param} className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-600">{param}</div>
              <div className="text-2xl font-bold" style={{ color: colorPalette[param] }}>
                {finalPrediction[param]?.toFixed(2)}
              </div>
              <div className="text-sm text-gray-400">
                Initial: {initialValues[param]?.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Interpretation Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">AI Clinical Interpretation</h2>
          {interpretationState.loading && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Generating interpretation...</span>
              <ProgressSpinner style={{ width: '30px', height: '30px' }} strokeWidth="4" animationDuration=".5s" />
            </div>
          )}
        </div>
        
        {interpretationState.error ? (
          <Message severity="error" text={interpretationState.error} className="w-full mb-4" />
        ) : interpretationState.data ? (
          <div className="mt-4">
            <InterpretationPanel interpretation={interpretationState.data} />
          </div>
        ) : !interpretationState.loading && (
          <div className="text-center text-gray-500 py-4">
            Waiting for interpretation...
          </div>
        )}
      </div>
    </div>
  );
};

export default MLLayer;