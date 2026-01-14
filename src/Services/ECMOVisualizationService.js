 
  // services/ECMOVisualizationService.js
  class ECMOVisualizationService {
    constructor() {
      this.chartConfigs = {
        oxygenation: {
          caSys_pO2: { label: 'Arterial PO2', unit: 'mmHg', domain: [0, 500] },
          caSys_O2sat: { label: 'Arterial O2 Saturation', unit: '%', domain: [60, 100] },
          bgDO2: { label: 'Oxygen Delivery', unit: 'mL/min', domain: [0, 1500] },
          cvSys_pO2: { label: 'Venous PO2', unit: 'mmHg', domain: [0, 100] },
          cvSys_O2sat: { label: 'Venous O2 Saturation', unit: '%', domain: [0, 100] }
        },
        hemodynamics: {
          paosys: { label: 'Systolic Pressure', unit: 'mmHg', domain: [0, 200] },
          paodia: { label: 'Diastolic Pressure', unit: 'mmHg', domain: [0, 150] },
          paoavg: { label: 'Mean Arterial Pressure', unit: 'mmHg', domain: [0, 150] },
          left_flow: { label: 'Left Heart Flow', unit: 'L/min', domain: [0, 10] },
          right_flow: { label: 'Right Heart Flow', unit: 'L/min', domain: [0, 10] },
          ecmoUnitFlow: { label: 'ECMO Flow', unit: 'L/min', domain: [0, 10] }
        }
      };
    }
  
    getChartConfig(scenario, parameter) {
      return this.chartConfigs[scenario]?.[parameter] || {
        label: parameter,
        unit: '',
        domain: [0, 100]
      };
    }
  
    formatValue(value, unit) {
      if (typeof value !== 'number') return value;
      
      switch (unit) {
        case '%':
          return value.toFixed(1) + '%';
        case 'mmHg':
          return value.toFixed(0) + ' mmHg';
        case 'L/min':
          return value.toFixed(2) + ' L/min';
        case 'mL/min':
          return value.toFixed(0) + ' mL/min';
        default:
          return value.toFixed(2);
      }
    }
  
    getAvailableOutputs(scenario) {
      return Object.entries(this.chartConfigs[scenario] || {}).map(([key, config]) => ({
        value: key,
        label: config.label
      }));
    }
  }
  
export default new ECMOVisualizationService();