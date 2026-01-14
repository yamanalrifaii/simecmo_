class PredictionInterpreterService {
    constructor() {
      this.baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    }
  
    async interpretPredictions(scenarioType, parameter, predictions, currentValues) {
      try {
        const promptData = this.formatPromptData(scenarioType, parameter, predictions, currentValues);
        
        const response = await fetch(`${this.baseURL}/api/interpret`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(promptData)
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        return data.interpretation;
  
      } catch (error) {
        console.error('Interpretation error:', error);
        throw new Error('Failed to get interpretation: ' + error.message);
      }
    }
    
    formatPromptData(scenarioType, parameter, predictions, currentValues) {
      // Get first and last prediction to analyze the change
      const initial = predictions[0] || {};
      const final = predictions[predictions.length - 1] || {};
      
      const parameterDescriptions = {
        oxygenation: {
          fdo2: "Fraction of delivered oxygen",
          shuntfraction: "Shunt fraction",
          dlco: "Diffusion capacity",
          mvo2: "Mixed venous oxygen",
          hb: "Hemoglobin"
        },
        hemodynamics: {
          arterial_resistance: "Arterial resistance",
          venous_resistance: "Venous resistance",
          pvr: "Pulmonary vascular resistance",
          svr: "Systemic vascular resistance"
        }
      };
  
      const scenarioParams = parameterDescriptions[scenarioType] || {};
      const parameterName = scenarioParams[parameter] || parameter;
  
      return {
        scenarioType,
        parameter: parameterName,
        initialValues: this.formatValues(initial),
        finalValues: this.formatValues(final),
        parameterChange: {
          from: this.formatValue(initial.input_value),
          to: this.formatValue(final.input_value)
        }
      };
    }
  
    formatValues(values) {
      const formatted = {};
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'time' && key !== 'input_value') {
          formatted[key] = this.formatValue(value);
        }
      });
      return formatted;
    }
  
    formatValue(value) {
      return typeof value === 'number' ? value.toFixed(2) : value;
    }
  }
  
  export const predictionInterpreter = new PredictionInterpreterService();