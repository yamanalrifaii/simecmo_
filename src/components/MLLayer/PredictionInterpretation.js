// src/components/MLLayer/PredictionInterpretation.js
import React, { useState, useEffect } from 'react';
import { predictionInterpreter } from '../services/PredictionInterpreterService';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';

const PredictionInterpretation = ({ 
  scenarioType, 
  currentStep,
  predictions, 
  currentValues,
  className = "" 
}) => {
  const [interpretation, setInterpretation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getInterpretation = async () => {
      if (!predictions?.length || !currentStep?.parameter) return;

      try {
        setLoading(true);
        setError(null);
        const result = await predictionInterpreter.interpretPredictions(
          scenarioType,
          currentStep.parameter,
          predictions,
          currentValues
        );
        setInterpretation(result);
      } catch (err) {
        setError(err.message || 'Failed to get interpretation');
      } finally {
        setLoading(false);
      }
    };

    getInterpretation();
  }, [predictions, currentStep, scenarioType]);

  if (!predictions?.length || !currentStep?.parameter) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Clinical Interpretation</h3>
      
      {loading && (
        <div className="flex items-center justify-center p-4">
          <ProgressSpinner 
            style={{ width: '50px', height: '50px' }}
            strokeWidth="4"
            animationDuration=".5s"
          />
          <span className="ml-2">Analyzing changes...</span>
        </div>
      )}

      {error && (
        <Message severity="error" text={error} className="w-full" />
      )}

      {interpretation && !loading && !error && (
        <div className="space-y-4">
          <div className="prose max-w-none">
            {interpretation.split('\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 text-sm leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          
          <div className="flex items-center mt-4 text-sm text-gray-500">
            <i className="pi pi-check mr-2" />
            <span>Analysis based on current parameter changes and predictions</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionInterpretation;