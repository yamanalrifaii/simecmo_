// services/ECMOStateService.js
class ECMOStateService {
    constructor() {
      // Configuration for input parameters in ECMO Layer
      this.ecmoParameters = {
        oxygenation: {
          sweep: { min: 0, max: 10, step: 0.1, unit: 'L/min' },
          fio2: { min: 0.21, max: 1, step: 0.01, unit: '' },
          rpm: { min: 1000, max: 4000, step: 100, unit: 'RPM' }
        },
        hemodynamics: {
          flow: { min: 0, max: 7, step: 0.1, unit: 'L/min' },
          pressure: { min: 0, max: 300, step: 10, unit: 'mmHg' }
        }
      };
  
      // Configuration for data layer parameters
      this.dataParameters = {
        oxygenation: {
          Hb: { min: 5, max: 20, step: 0.5, unit: 'g/dL' },
          shunt_fraction: { min: 0, max: 100, step: 1, unit: '%' },
          DLCO: { min: 1, max: 100, step: 1, unit: 'mL/min/mmHg' }
        },
        hemodynamics: {
          arterial_resistance: { min: 0, max: 100, step: 0.1, unit: 'mmHg·s/mL' },
          venous_resistance: { min: 0, max: 100, step: 0.1, unit: 'mmHg·s/mL' }
        }
      };
  
      // Output parameters for ML Layer visualization
      this.outputParameters = {
        oxygenation: [
          { key: 'pO2', label: 'PO2', unit: 'mmHg' },
          { key: 'O2sat', label: 'O2 Saturation', unit: '%' },
          { key: 'DO2', label: 'O2 Delivery', unit: 'mL/min' }
        ],
        hemodynamics: [
          { key: 'flow', label: 'Flow', unit: 'L/min' },
          { key: 'pressure', label: 'Pressure', unit: 'mmHg' }
        ]
      };
    }
  
    getECMOParameters(scenario) {
      return this.ecmoParameters[scenario] || {};
    }
  
    getDataParameters(scenario) {
      return this.dataParameters[scenario] || {};
    }
  
    getOutputParameters(scenario) {
      return this.outputParameters[scenario] || [];
    }
  
    validateParameter(paramConfig, value) {
      return value >= paramConfig.min && value <= paramConfig.max;
    }
  }
  
  export default new ECMOStateService();