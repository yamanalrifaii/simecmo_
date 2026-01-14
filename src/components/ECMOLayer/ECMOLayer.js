import React, { useState, useEffect } from 'react';
import vaECMO from '../../images/vaECMO.svg';
import ABG_Circuit from '../../images/ABG_Circuit.svg';
import PumpSettings from './PumpSettings';
import Blender1 from './Blender1';
import OxygenatorSettings from './OxygenatorSettings';
import OutputParameters from './OutputParameters';
import { Slider } from 'primereact/slider';
import '../../css/DataLayer.css';
import PatientParameters from './PatientParameters'; 
import '../../css/Blender.css';
import '../../css/PumpControls.css'; 


// Define output parameters for each step
const getStepOutputParams = (scenarioType, parameterName) => {
  const outputConfigs = {
    oxygenation: {
      'hb': ['bgDO2', 'caSys_O2sat', 'cvSys_O2sat'],
      'mvo2': ['bgDO2', 'caSys_pO2', 'cvSys_pCO2', 'caSys_HCO3'],
      'dlco': ['caSys_pO2', 'cvSys_pO2', 'caSys_pCO2', 'cvSys_pCO2'],
      'shunt_fraction': ['caSys_pO2', 'caSys_O2sat', 'cvSys_pO2', 'cvSys_O2sat', 'caSys_pH', 'cvSys_pH'],
      'fdo2': ['caSys_pO2', 'cvSys_pO2', 'caSys_O2sat', 'cvSys_O2sat', 'bgDO2']
    },
    hemodynamics: {
      'arterial_r': ['paosys', 'paodia', 'paoavg', 'col', 'cor'], 
      'venous_r': ['bgDO2', 'caSys_O2sat', 'cvSys_O2sat', 'ecmoUnitFlow'],
      'pvr': ['caSys_pCO2', 'cvSys_pO2', 'caSys_pH', 'caSys_HCO3'],
      'svr': ['caSys_O2sat', 'caSys_pH', 'cvSys_HCO3']
    }, 
    cardiovascular: {
      'cv_heartrate_value': [ 'ecmoUnitFlow', 'pcv', 'svr'],
      'cv_volume_value': ['ecmop1', 'ppcw', 'ppasys', 'paodia', 'col', 'cor'],
      'cv_eeslv_value': ['ecmoUnitFlow', 'caSys_O2sat', 'pcv', 'ppcw'],
      'cv_eesrv_value': ['ppasys', 'ppcw', 'caSys_BE', 'bgDO2']
    }, 
    ecmoparameters: {
      'rpm': ['ppadia', 'caSys_pO2', 'cvSys_pO2', 'caSys_O2sat', 'caSys_pCO2'],
      'oxygenator_resistance': ['ecmoUnitFlow', 'caSys_O2sat', 'cvSys_O2sat', 'caSys_pO2', 'cvSys_pO2', 'bgDO2'],
      'sweep_flow': ['caSys_BE', 'caSys_pH', 'cvSys_pH', 'bgDO2', 'caSys_pO2', 'cvSys_pO2'],
      'diffusion': ['caSys_pO2', 'cvSys_pO2', 'caSys_pCO2', 'cvSys_pCO2', 'bgDO2', 'paodia']
    }
  };

  return outputConfigs[scenarioType]?.[parameterName] || [];
};

// Define default values for each scenario/parameter combination
const getStepDefaultValues = (scenarioType, parameter) => {
  if (!scenarioType || !parameter) return {};

  const defaults = {
    oxygenation: {
      'hb': {
        bgDO2: '571.69',
        caSys_O2sat: '99.86',
        cvSys_O2sat: '67.15'
      },
      'mvo2': {
        bgDO2: '1314.06',
        caSys_pO2: '303.06',
        cvSys_pCO2: '20.92',
        caSys_HCO3: '19.97'
      },
      'dlco': {
        caSys_pO2: '70.19',
        cvSys_pO2: '41.20',
        caSys_pCO2: '31.92',
        cvSys_pCO2: '41.07'
      },
      'shunt_fraction': {
        caSys_pO2: '282.56',
        caSys_O2sat: '99.85',
        cvSys_pO2: '52.08',
        cvSys_O2sat: '86.28',
        caSys_pH: '7.46',
        cvSys_pH: '7.36'
      },
      'fdo2': {
        caSys_pO2: '92.60',
        cvSys_pO2: '44.30',
        caSys_O2sat: '96.72',
        cvSys_O2sat: '79.97',
        bgDO2: '1229.108'
      }
    },
    hemodynamics: {
      'pvr': {
        caSys_pCO2: '31.98', 
        cvSys_pO2: '51.51', 
        caSys_pH: '7.46', 
        caSys_HCO3: '22.41' 
      }, 
      'svr': {
        caSys_O2sat: '99.81',
        caSys_pH: '7.45',
        cvSys_HCO3: '23.28', 
      }, 
      'arterial_r': {
        paosys: '143.32', 
        paodia: '91.10',  
        paoavg: '107.24', 
        col: '4.36', 
        cor: '4.35' 
      }, 
      'venous_r' : {
        bgDO2: '1300.07', 
        caSys_O2sat: '99.82',  
        cvSys_O2sat: '85.83', 
        ecmoUnitFlow: '20.94'
      }
    }, 
    cardiovascular: {
      'cv_heartrate_value': {
        ecmoUnitFlow: '21.53',
        pcv: '4.96',
        svr: '79.32'
      },
      'cv_volume_value': {
        ecmop1: '-26',
        ppcw: '0.16',
        ppasys: '0.25',
        paodia: '37.22',
        col: '0.01',
        cor: '0.01'
      },
      'cv_eeslv_value': {
        ecmoUnitFlow: '22.14',
        caSys_O2sat: '99.97',
        pcv: '1.42',
        ppcw: '26.48',
      },
      'cv_eesrv_value': {
        ppasys: '9.18',
        ppcw: '4.69',
        caSys_BE: '-1.34',
        bgDO2: '1111.93'
      }
    }, 
    ecmoparameters: {
      'rpm': {
        ppadia: '60',
        caSys_pO2: '263.20',
        cvSys_pO2: '51.65',
        caSys_O2sat: '99.83',
        caSys_pCO2: '35'
      },
      'oxygenator_resistance': {
        ecmoUnitFlow: '6.06',
        caSys_O2sat: '99.83',
        cvSys_O2sat: '86.02',
        caSys_pO2: '263.20',
        cvSys_pO2: '51.65',
        bgDO2: '1312.18'
      },
      'sweep_flow': {
        caSys_BE: '-1.36',
        caSys_pH: '7.43',
        cvSys_pH: '7.36',
        bgDO2: '1297.38',
        caSys_pO2: '232.85',
        cvSys_pO2: '50.67'
      },
      'diffusion': {
        caSys_pO2: '159.15',
        cvSys_pO2: '48.37',
        caSys_pCO2: '36',
        cvSys_pCO2: '42',
        bgDO2: '860',
        paodia: '62'
      }
    }  
  };

  return defaults[scenarioType]?.[parameter] || {};
};

const ECMOLayer = ({ 
  values, 
  onParameterChange, 
  onOutputValuesChange,
  predictionValues,
  currentStep,
  scenarioType
}) => {
  const [visualizationMode, setVisualizationMode] = useState('cannulations');
  const [parameters, setParameters] = useState([]);
  
  // Initialize with minimum values
  const [pumpRPM, setPumpRPM] = useState(600); // Starting from 0.6k RPM
  const [blenderSettings, setBlenderSettings] = useState({
    fdo2: 0.21, // Minimum FdO2
    sweep: 0.0  // Starting sweep
  });
  const [oxygenatorSettings, setOxygenatorSettings] = useState({
    diffusion: 0.0001,  // Minimum diffusion
    resistance: 0.0     // Starting resistance
  });

  // Handle ECMO component changes without disabled state
  const handlePumpChange = (newRPM) => {
    setPumpRPM(newRPM);
    onParameterChange('rpm', newRPM / 1000);
  };

  const handleBlenderChange = (type, value) => {
    setBlenderSettings(prev => {
      const updated = { ...prev, [type]: value };
      if (type === 'sweep') onParameterChange('sweep_flow', value);
      if (type === 'fdo2') onParameterChange('fdo2', value);
      return updated;
    });
  };

  const handleOxygenatorChange = (type, value) => {
    setOxygenatorSettings(prev => {
      const updated = { ...prev, [type]: value };
      if (type === 'diffusion') onParameterChange('diffusion', value);
      if (type === 'resistance') onParameterChange('oxygenator_resistance', value);
      return updated;
    });
  };
  

  // Set up parameters based on scenario type
  useEffect(() => {
    const scenarioParams = {
      oxygenation: [
        { key: 'hb', min: 5, max: 20, step: 0.5, unit: 'g/dL' },
        { key: 'mvo2', min: 100, max: 1500, step: 5, unit: 'mL/min' },
        { key: 'dlco', min: 1, max: 100, step: 1, unit: 'mL/min/mmHg' },
        { key: 'shunt_fraction', min: 0, max: 100, step: 1, unit: '%' },
        { key: 'fdo2', min: 0.21, max: 1.00, step: 0.05, unit: '' }
      ],
      hemodynamics: [
        { key: 'arterial_r', min: 0, max: 60, step: 0.1, unit: 'mmHg·s/mL' },
        { key: 'venous_r', min: 0, max: 600, step: 0.1, unit: 'mmHg·s/mL' },
        { key: 'pvr', min: 0, max: 80, step: 0.10, unit: 'woods units' },
        { key: 'svr', min: 1, max: 100, step: 0.10, unit: 'woods units' }
      ],
      cardiovascular: [
        { key: 'cv_heartrate_value', min: 40, max: 210, step: 1, unit: 'bpm' },
        { key: 'cv_volume_value', min: 200, max: 5000, step: 5, unit: 'mL' },
        { key: 'cv_eeslv_value', min: 0.2, max: 10.0, step: 0.1, unit: 'mmHg/mL' },
        { key: 'cv_eesrv_value', min: 0.5, max: 5.0, step: 0.1, unit: 'mmHg/mL' }
      ],
      ecmoparameters: [
        { key: 'rpm', min: 0.6, max: 6.7, step: 0.1, unit: 'RPM' },
        { key: 'oxygenator_resistance', min: 0, max: 200.0, step: 0.1, unit: 'mmHg/L/min' },
        { key: 'sweep_flow', min: 0, max: 10, step: 0.5, unit: 'L/min' },
        { key: 'diffusion', min: 0.0001, max: 0.01, step: 0.1, unit: 'L/min' }
      ]
    };

    setParameters(scenarioParams[scenarioType] || []);
  }, [scenarioType]);

  // Get current step's output parameters
  const currentOutputParams = currentStep?.parameter ? 
    getStepOutputParams(scenarioType, currentStep.parameter) : [];

    const getCurrentOutputValues = () => {
      // Define default output values for the current scenario/parameter
      const defaultValues = getStepDefaultValues(scenarioType, currentStep?.parameter);

      console.log('Getting output values for:', {
        scenario: scenarioType,
        parameter: currentStep?.parameter,
        predictionValues,
        defaultValues: getStepDefaultValues(scenarioType, currentStep?.parameter)
      });
    
      // Initialize output values with the default values
      const updatedValues = {
        bloodGases: {
          pH: { arterial: '7.35', venous: '7.40' },
          pCO2: { arterial: '40.00', venous: '5.00' },
          pO2: { arterial: '349.00', venous: '44.00' },
          HCO3: { arterial: '24.00', venous: '23.00' },
          O2Sat: { arterial: '99.86', venous: '67.15' },
          hb: values?.[currentStep?.parameter] || '13.00',
          DO2: defaultValues.bgDO2 || '571.69' // Use the default value for bgDO2 if not provided by predictions
        },
        hemodynamics: {
          AoP: '90.00',
          PAP: '15.00',
          CO_LV: '1.50',
          CO_RV: '1.67'
        },
        pressures: {
          Delta_P: '7.00'
        }
      };
    
      // If currentOutputParams are available, override the defaults with prediction values if available
      if (currentOutputParams.length > 0) {
        currentOutputParams.forEach(param => {
          const value = predictionValues?.[param] !== undefined ? predictionValues[param] : defaultValues[param];
          if (value !== undefined) {
            switch(param) {
              case 'bgDO2':
                updatedValues.bloodGases.DO2 = String(Number(value).toFixed(2));
                break;
              case 'caSys_O2sat':
                updatedValues.bloodGases.O2Sat.arterial = String(Number(value).toFixed(2));
                break;
              case 'cvSys_O2sat':
                updatedValues.bloodGases.O2Sat.venous = String(Number(value).toFixed(2));
                break;
              case 'caSys_pO2':
                updatedValues.bloodGases.pO2.arterial = String(Number(value).toFixed(2));
                break;
              case 'cvSys_pO2':
                updatedValues.bloodGases.pO2.venous = String(Number(value).toFixed(2));
                break;
              case 'caSys_pCO2':
                updatedValues.bloodGases.pCO2.arterial = String(Number(value).toFixed(2));
                break;
              case 'cvSys_pCO2':
                updatedValues.bloodGases.pCO2.venous = String(Number(value).toFixed(2));
                break;
              case 'caSys_pH':
                updatedValues.bloodGases.pH.arterial = String(Number(value).toFixed(2));
                break;
              case 'cvSys_pH':
                updatedValues.bloodGases.pH.venous = String(Number(value).toFixed(2));
                break;
              case 'caSys_HCO3':
                updatedValues.bloodGases.HCO3.arterial = String(Number(value).toFixed(2));
                break;
              case 'paosys':
                updatedValues.hemodynamics.systolic = String(Number(value).toFixed(2));
                break;
              case 'paodia':
                updatedValues.hemodynamics.diastolic = String(Number(value).toFixed(2));
                break;
              case 'paoavg':
                updatedValues.hemodynamics.AoP = String(Number(value).toFixed(2));
                break;
              case 'ecmoUnitFlow':
                updatedValues.pressures.Delta_P = String(Number(value).toFixed(2));
                break;
              case 'col':
                updatedValues.hemodynamics.CO_LV = String(Number(value).toFixed(2));
                break;
              case 'cor':
                updatedValues.hemodynamics.CO_RV = String(Number(value).toFixed(2));
                break;
              // case 'left_flow':
              //   updatedValues.hemodynamics.CO_LV = String(Number(value).toFixed(2));
              //   break;
              case 'pcv':
                updatedValues.hemodynamics.PCV = String(Number(value).toFixed(2));
                break;
              case 'svr':
                updatedValues.hemodynamics.SVR = String(Number(value).toFixed(2));
                break;
              case 'ppcw':
                updatedValues.pressures.PCWP = String(Number(value).toFixed(2));
                break;
              case 'ecmop1':
                updatedValues.pressures.P1 = String(Number(value).toFixed(2));
            }
          }
        });
      }
    
      return updatedValues;
    };
    

  const outputValues = getCurrentOutputValues();

// In ECMOLayer.js
useEffect(() => {
  if (typeof onOutputValuesChange === 'function' && currentStep?.parameter) {
    // Get default values for the current step
    const stepDefaults = getStepDefaultValues(scenarioType, currentStep.parameter);
    
    // Only send the values when we don't have prediction values
    if (!predictionValues) {
      // Convert the values directly from stepDefaults
      const initialOutputs = {};
      currentOutputParams.forEach(param => {
        // Use the exact values from stepDefaults
        initialOutputs[param] = Number(stepDefaults[param]);
      });

      console.log('Sending initial values:', initialOutputs);
      onOutputValuesChange(initialOutputs);
    }
  }
}, [currentStep?.parameter, scenarioType, currentOutputParams, onOutputValuesChange, predictionValues]);
const isECMOScenario = scenarioType?.toLowerCase() === 'ecmoparameters';

const renderECMODiagram = () => (
  <div className="flex-grow flex justify-center relative">
    <div className="relative">
      <img 
        src={vaECMO} 
        width="700" 
        height="300" 
        alt="ECMO Cannulations" 
        className="mx-4 relative"
        style={{ top: '160px', left: '45px' }} 
      />
      <div className="absolute" style={{ top: '45%', left: '20%', transform: 'translate(-50%, -50%)' }}>
        <OxygenatorSettings
          diffusion={oxygenatorSettings.diffusion}
          oxygenatorResistance={oxygenatorSettings.resistance}
          onDiffusionChange={(value) => handleOxygenatorChange('diffusion', value)}
          onResistanceChange={(value) => handleOxygenatorChange('resistance', value)}
        />
      </div>
      <div className="absolute" style={{ top: '95%', right: '105%', transform: 'translate(-50%, -50%)' }}>
        <Blender1
          fdo2={blenderSettings.fdo2}
          sweep={blenderSettings.sweep}
          onFdo2Change={(value) => handleBlenderChange('fdo2', value)}
          onSweepChange={(value) => handleBlenderChange('sweep', value)}
        />
      </div>
      <div className="absolute" style={{ top: '35%', left: '66%', transform: 'translate(-50%, -50%)' }}>
        <PumpSettings
          rpm={pumpRPM}
          onRpmChange={handlePumpChange}
        />
      </div>
    </div>
  </div>
);

if (isECMOScenario) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 gap-4">
        <div className="flex-grow">
          {renderECMODiagram()}
        </div>
        <div className="w-64">
          <OutputParameters 
            hemodynamics={getCurrentOutputValues().hemodynamics}
            bloodGases={getCurrentOutputValues().bloodGases}
            pressures={getCurrentOutputValues().pressures}
            relevantParams={currentStep?.parameter ? 
              getStepOutputParams(scenarioType, currentStep.parameter) : []}
          />
        </div>
      </div>
    </div>
  );
} else {
  // Other scenarios - show parameters table and output only
  return (
    <div className="flex h-full">
      <div className="flex flex-1 gap-4 justify-between">
        <div className="w-3/5">
          <PatientParameters 
            parameters={parameters}
            values={values}
            onParameterChange={onParameterChange}
          />
        </div>
        <div className="w-2/5">
          <OutputParameters 
            hemodynamics={getCurrentOutputValues().hemodynamics}
            bloodGases={getCurrentOutputValues().bloodGases}
            pressures={getCurrentOutputValues().pressures}
            relevantParams={currentStep?.parameter ? 
              getStepOutputParams(scenarioType, currentStep.parameter) : []}
          />
        </div>
      </div>
    </div>
  );
}
};

export default ECMOLayer;