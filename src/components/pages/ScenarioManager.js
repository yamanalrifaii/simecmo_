// ScenarioManager.js
import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import Dashboard from '../Dashboard';
import { Oxygenation } from '../Scenarios/Oxygenation';
import { Hemodynamics } from '../Scenarios/Hemodynamics';
import { ecmoparameters } from '../Scenarios/ecmoparameters';
import { Cardiovascular } from '../Scenarios/Cardiovascular';
import '../../css/ScenarioManager.css';
import ScenarioIntroduction from './ScenarioIntroduction';

const scenarioConfigs = {
  oxygenation: {
    ...Oxygenation,
    steps: [
      { header: 'Introduction', id: 'intro' },
      { header: 'Hemoglobin', id: 'hb', parameter: 'hb' },  // Changed from 'Hb'
      { header: 'Mixed Venous Oxygen', id: 'mvo2', parameter: 'mvo2' },  // Changed from 'MVO2'
      { header: 'Diffusing Capacity', id: 'dlco', parameter: 'dlco' },  // Changed from 'DLCO'
      { header: 'Shunt Fraction', id: 'shunt', parameter: 'shunt_fraction' },
      { header: 'Fraction of Delivered Oxygen', id: 'fdo2', parameter: 'fdo2' }  
    ]
  },
  hemodynamics: {
    ...Hemodynamics,
    steps: [
      { header: 'Introduction', id: 'intro' },
      { header: 'Arterial Resistance', id: 'arterial', parameter: 'arterial_r' },
      { header: 'Venous Resistance', id: 'venous', parameter: 'venous_r' },
      { header: 'Pulmonary Vascular Resistance', id: 'pvr', parameter: 'pvr' },
      { header: 'Systemic Vascular Resistance', id: 'svr', parameter: 'svr' },
    ]
  }, 
  cardiovascular: {
    ...Cardiovascular,
    steps: [
      { header: 'Introduction', id: 'intro' },
      { header: 'Heart Rate', id: 'hr', parameter: 'cv_heartrate_value' },
      { header: 'Volume Status', id: 'volume', parameter: 'cv_volume_value' },
      { header: 'LV Contractility', id: 'lv', parameter: 'cv_eeslv_value' },
      { header: 'RV Contractility', id: 'rv', parameter: 'cv_eesrv_value' },
    ]
  }, 
  ecmoparameters: {
    ...ecmoparameters,
    steps: [
      { header: 'Introduction', id: 'intro' },
      { header: 'ECMO Speed', id: 'rpm', parameter: 'rpm' },
      { header: 'Oxygenator Resistance', id: 'oxygenator_resistance', parameter: 'oxygenator_resistance' },
      { header: 'Sweep Gas Flow', id: 'sweep', parameter: 'sweep_flow' },
      { header: 'Diffusion', id: 'diffusion', parameter: 'diffusion' },
    ]
  }
};

const ScenarioManager = ({ values, setValues }) => {

  const { scenarioId } = useParams();
  console.log('Current scenarioId:', scenarioId);
  console.log('Available scenarios:', Object.keys(scenarioConfigs));
  const stepperRef = useRef(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentInstruction, setCurrentInstruction] = useState(0);

  
  // Add some debugging
  console.log('ScenarioId:', scenarioId);
  console.log('Available scenarios:', Object.keys(scenarioConfigs));
  
  // Convert to lowercase for consistent comparison
  const normalizedScenarioId = scenarioId?.toLowerCase();
  const scenario = scenarioConfigs[normalizedScenarioId];
  
  console.log('Found scenario:', scenario);

  if (!scenario) {
    console.error(`No scenario found for ID: ${scenarioId}`);
    return <div>Scenario not found</div>;
  }

  const stepInstructions = {
    oxygenation: {
      hb: [
        "Let's explore how Hemoglobin (Hb) affects oxygen delivery. Try increasing the Hb value using the slider.",
        "Notice how bgDO2 (Oxygen Delivery) increases significantly. This happens because each hemoglobin molecule can carry more oxygen, directly boosting the blood's oxygen-carrying capacity.",
        "Higher Hb levels mean more oxygen binding sites are available, leading to better oxygen saturation in arterial blood.",
        "Look at the venous oxygen saturation (cvSys_O2sat). It also increases because more oxygen remains in the blood even after tissue extraction, thanks to the higher carrying capacity."
      ],
      mvo2: [
        "Mixed Venous Oxygen (MVO2) reflects tissue oxygen consumption. Let's adjust it and observe multiple effects.",
        "Watch how bgDO2 changes as you adjust MVO2. Higher MVO2 indicates less oxygen extraction by tissues, affecting overall oxygen delivery.",
        "Notice the relationship with arterial oxygen (caSys_pO2). As MVO2 changes, it affects the oxygen gradient between arterial and venous blood.",
        "Pay attention to venous CO2 (cvSys_pCO2) and bicarbonate (caSys_HCO3). They increase as MVO2 increases. These changes since the tissue metabolism and oxygen consumption vary with MVO2 levels."
      ],
      dlco: [
        "Diffusing Capacity (DLCO) controls gas exchange efficiency. Let's experiment with different values.",
        "Notice the huge increase in arterial oxygen levels (caSys_pO2). Higher DLCO allows more oxygen to diffuse from the lungs into the blood.",
        "Monitor both arterial and venous CO2 levels (caSys_pCO2, cvSys_pCO2). Better diffusion capacity means more efficient CO2 removal.",
        "Notice how venous oxygen (cvSys_pO2) responds. DLCO affects the overall oxygen availability in the circulation system."
      ],
      shunt: [
        "Shunt fraction represents blood bypassing oxygenation. Let's see its widespread effects.",
        "Observe arterial oxygenation (caSys_pO2, caSys_O2sat). Higher shunt fraction reduces these values as more blood skips the oxygenation process.",
        "Watch venous values (cvSys_pO2, cvSys_O2sat) change. The shunt affects the entire oxygen delivery system.",
        "Notice pH changes (caSys_pH, cvSys_pH) as the body compensates for altered oxygenation. These reflect the system's response to shunting."
      ],
      fdo2: [
        "Fraction of Delivered Oxygen (FDO2) directly controls oxygen availability. Let's adjust it and watch multiple parameters.",
        "Track arterial oxygen levels (caSys_pO2) and saturation (caSys_O2sat). These respond directly to FDO2 changes.",
        "Notice how venous values (cvSys_pO2, cvSys_O2sat) follow. Higher FDO2 improves oxygen availability throughout the system.",
        "Watch bgDO2 changes. This shows how FDO2 affects the overall oxygen delivery to tissues."
      ], 
      conclusion: [
        "You've explored how different oxygenation parameters interact to maintain tissue oxygen delivery:", 
        "• Hemoglobin (Hb) directly affects bgDO2 and both arterial/venous oxygen saturation (caSys_O2sat, cvSys_O2sat)",
        "• Mixed Venous Oxygen (MVO2) influences bgDO2, arterial oxygen (caSys_pO2), and acid-base balance (cvSys_pCO2, caSys_HCO3)",
        "• Diffusing Capacity (DLCO) controls gas exchange efficiency, affecting both oxygen and CO2 levels in arterial and venous blood",
        "• Shunt Fraction impacts arterial/venous oxygenation and pH balance across the entire system",
        "• FDO2 directly controls oxygen availability, affecting both arterial and venous parameters and overall oxygen delivery",
        "Understanding these relationships is crucial for optimizing ECMO oxygenation support."
      ]
    },
    hemodynamics: {
      arterial: [
        "Let's adjust Arterial Resistance and observe its effects on blood flow and pressure.",
        "Watch systolic, diastolic, and mean arterial pressures (paosys, paodia, paoavg). Higher resistance increases these pressures as the heart works harder.",
        "Notice changes in left and right cardiac output (col, cor). Increased arterial resistance affects how hard the heart must work to maintain flow.",
        "Observe how the pressure changes affect overall blood flow distribution in the system."
      ],
      venous: [
        "Venous Resistance affects ECMO drainage and oxygen delivery. Let's explore these relationships.",
        "Watch the ECMO unit flow (ecmoUnitFlow) change. Higher venous resistance typically reduces ECMO drainage efficiency.",
        "Notice how oxygen delivery (bgDO2) responds to venous resistance changes.",
        "Observe both arterial and venous oxygen saturation (caSys_O2sat, cvSys_O2sat). These reflect how venous resistance affects oxygen transport."
      ],
      pvr: [
        "Pulmonary Vascular Resistance (PVR) affects gas exchange. Let's adjust it and observe.",
        "Watch CO2 levels (caSys_pCO2) change as PVR affects pulmonary blood flow.",
        "Notice venous oxygen levels (cvSys_pO2) responding to altered pulmonary circulation.",
        "Monitor pH and bicarbonate (caSys_pH, caSys_HCO3) as they compensate for PVR-induced changes."
      ],
      svr: [
        "Systemic Vascular Resistance (SVR) affects systemic circulation. Let's explore its effects.",
        "Watch arterial oxygen saturation (caSys_O2sat) respond to SVR changes.",
        "Notice how pH (caSys_pH) adjusts to maintain balance with changing SVR.",
        "Observe bicarbonate levels (cvSys_HCO3) compensating for SVR-induced changes."
      ], 
      conclusion: [
        "You've learned how vascular resistances affect blood flow and pressure in ECMO support:",
        "• Arterial Resistance impacts systemic pressures (paosys, paodia, paoavg) and cardiac output (col, cor)",
        "• Venous Resistance affects ECMO drainage (ecmoUnitFlow) and oxygen delivery (bgDO2, O2sat)",
        "• Pulmonary Vascular Resistance (PVR) influences gas exchange and acid-base balance",
        "• Systemic Vascular Resistance (SVR) affects systemic oxygenation and pH compensation",
        "These relationships are essential for maintaining optimal tissue perfusion during ECMO support."
      ]
    },
    cardiovascular: {
      hr: [
        "Heart Rate directly affects cardiac performance. Let's adjust it and observe flow changes.",
        "Watch left ventricular flow changes. Higher heart rates typically increase cardiac output.",
        "Notice ECMO flow (ecmoUnitFlow) adjusting to heart rate changes.",
        "Observe central venous pressure (pcv) and systemic vascular resistance (svr) responses."
      ],
      volume: [
        "Volume status affects cardiac filling and ECMO function. Let's explore these relationships.",
        "Watch ECMO inlet pressure (ecmop1) respond to volume changes.",
        "Notice pulmonary capillary wedge pressure (ppcw) and pulmonary artery pressure (ppasys) adjustments.",
        "Observe how cardiac output (col, cor) and diastolic pressure (paodia) respond to volume changes."
      ],
      lv: [
        "Left Ventricular contractility (eeslv) affects systemic perfusion. Let's adjust it.",
        "Watch ECMO flow (ecmoUnitFlow) and left ventricular flow respond to contractility changes.",
        "Notice oxygen saturation (caSys_O2sat) changes with varying LV function.",
        "Observe central venous and wedge pressures (pcv, ppcw) adjusting to LV changes."
      ],
      rv: [
        "Right Ventricular contractility (eesrv) affects pulmonary circulation. Let's explore its effects.",
        "Watch pulmonary artery systolic pressure (ppasys) respond to RV changes.",
        "Notice wedge pressure (ppcw) adjustments with varying RV function.",
        "Observe base excess (caSys_BE) and oxygen delivery (bgDO2) responses."
      ],
      conclusion: [
        "You've explored how cardiac parameters interact with ECMO support:",
        "• Heart Rate affects cardiac output, ECMO flow, and systemic resistance",
        "• Volume Status influences filling pressures, ECMO drainage, and cardiac performance",
        "• Left Ventricular Function impacts systemic perfusion and oxygenation",
        "• Right Ventricular Function affects pulmonary circulation and oxygen delivery",
        "Understanding these cardiac-ECMO interactions is crucial for optimizing patient support."
      ]
    },
    ecmoparameters: {
      rpm: [
        "ECMO pump speed (RPM) is a key determinant of support. Let's adjust it and observe.",
        "Watch pulmonary artery diastolic pressure (ppadia) and ECMO flow (ecmoUnitFlow) respond.",
        "Notice oxygen parameters (caSys_pO2, cvSys_pO2, caSys_O2sat) changing with flow.",
        "Observe CO2 levels (caSys_pCO2) adjusting to different pump speeds."
      ],
      oxygenator_resistance: [
        "Oxygenator resistance affects gas exchange efficiency. Let's explore its impact.",
        "Watch ECMO flow (ecmoUnitFlow) respond to resistance changes.",
        "Notice oxygen saturation changes (caSys_O2sat, cvSys_O2sat) across the circuit.",
        "Observe oxygen partial pressures (caSys_pO2, cvSys_pO2) and delivery (bgDO2)."
      ],
      sweep: [
        "Sweep gas flow controls gas exchange. Let's adjust it and observe multiple effects.",
        "Watch blood gas parameters (caSys_BE, pH values) respond to sweep changes.",
        "Notice oxygen parameters (bgDO2, caSys_pO2, cvSys_pO2) adjusting.",
        "Observe how different sweep flows affect overall gas exchange efficiency."
      ],
      diffusion: [
        "Membrane diffusion capacity determines gas exchange. Let's explore its effects.",
        "Watch oxygen levels (caSys_pO2, cvSys_pO2) respond to diffusion changes.",
        "Notice CO2 levels (caSys_pCO2, cvSys_pCO2) adjusting across the membrane.",
        "Observe oxygen delivery (bgDO2) and diastolic pressure (paodia) responses."
      ], 
      conclusion: [
        "You've discovered how ECMO machine parameters affect patient support:",
        "• Pump Speed (RPM) controls flow and affects oxygenation across the circuit",
        "• Oxygenator Resistance impacts circuit efficiency and gas exchange",
        "• Sweep Gas Flow determines CO2 removal and affects acid-base balance",
        "• Membrane Diffusion controls overall gas exchange effectiveness",
        "These technical parameters must be carefully balanced to provide optimal ECMO support."
      ]
    }
  };

  const renderInstructions = (step) => {
    if (step.id === 'intro' || step.id === 'conclusion') {
      return null;
    }
    
    const instructions = stepInstructions[scenarioId.toLowerCase()][step.id];
    
    return (
      <div className="relative w-full max-w-[600px] mx-auto my-3 p-4">
        <div className="overflow-hidden rounded-lg shadow-lg border border-gray-700">
          {/* Header */}
          <div className="bg-[#f4f4f5] p-4 border-b border-gray-700 bg-dark-grey">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg m-0">{step.header}</h3>
              <span className="bg-[#374151] text-[#f4f4f5] px-3 py-1 rounded text-sm">
                {currentInstruction + 1}/{instructions.length}
              </span>
            </div>
          </div>
          
          {/* Content */}
          <div className="bg-[#374151] p-6">
            <p className="text-[#f4f4f5] text-center leading-relaxed mb-9 text-lg md:text-xl">
              {instructions[currentInstruction]}
            </p>
            
            {/* Step Indicators */}
            <div className="flex justify-center gap-2 my-4 text-white">
              {instructions.map((_, index) => (
                <div 
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-200
                    ${index === currentInstruction 
                      ? 'bg-[#991b1b] scale-125' 
                      : 'bg-[#f4f4f5] opacity-20'}`}
                />
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-dark-grey p-4 border-t border-gray-700 flex justify-between">
            <button 
              className="bg-[#374151] text-white px-4 py-2 rounded flex items-center gap-2 hover:opacity-90 transition-opacity"
              onClick={() => setShowInstructions(false)}
            >
              <i className="pi pi-times text-sm text-white" />
              <span>Close</span>
            </button>
            
            <div className="flex gap-2">
              {currentInstruction > 0 && (
                <button 
                  className="bg-[#991b1b] text-white px-4 py-2 rounded flex items-center hover:opacity-90 transition-opacity"
                  onClick={() => setCurrentInstruction(prev => prev - 1)}
                >
                  <i className="pi pi-arrow-left text-sm" />
                </button>
              )}
              {currentInstruction < instructions.length - 1 && (
                <button 
                  className="bg-[#991b1b] text-white px-4 py-2 rounded flex items-center hover:opacity-90 transition-opacity"
                  onClick={() => setCurrentInstruction(prev => prev + 1)}
                >
                  <i className="pi pi-arrow-right text-sm" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = (step) => {
    if (step.id === 'intro') {
      return (
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            <ScenarioIntroduction scenario={scenarioId.toLowerCase()} />
          </div>
        </div>
      );
    }
  
    if (step.id === 'conclusion') {
      return (
        <div className="flex flex-col h-full">
          <div className="flex-grow p-8 flex items-center justify-center">
            <div className="max-w-3xl bg-[#f4f4f5] rounded-lg p-8">
              <h2 className="text-2xl font-bold text-[#374151] mb-6">Scenario Complete</h2>
              <div className="prose prose-lg">
                <div className="whitespace-pre-line text-[#374151]">
                  {scenario.conclusion}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        <div className="flex-grow">
          {/* {scenario.showVAECMOBox && (
            <div className="absolute top-4 right-4 bg-[#991b1b] text-[#f4f4f5] px-3 py-1 rounded-md text-sm font-semibold">
              VA ECMO
            </div>
          )} */}
          <div className="h-full">
            <Dashboard 
              values={values} 
              setValues={setValues} 
              scenarioType={scenarioId.toLowerCase()}
              currentStep={step}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col text-white">
      <div className="flex-grow">
        <Stepper 
          ref={stepperRef} 
          className="custom-stepper text-white"
          onSelect={(e) => {
            setCurrentStepIndex(e.index);
            setCurrentInstruction(0);
            setShowInstructions(true);
          }}
        >
          {scenario.steps.map((step) => (
            <StepperPanel key={step.id} header={step.header}>
              <div className="flex flex-col">
                {showInstructions && renderInstructions(step)}
                <div className="bg-white">
                  {renderContent(step)}
                </div>
                <div className="flex justify-between p-4 bg-[#f4f4f5] border-t">
                  {step.id !== 'intro' && (
                    <Button 
                      label="Back" 
                      icon="pi pi-arrow-left" 
                      severity="secondary" 
                      onClick={() => {
                        stepperRef.current.prevCallback();
                        setCurrentInstruction(0);
                        setShowInstructions(true);
                      }} 
                    />
                  )}
                  {step.id !== 'conclusion' && (
                    <div className={`${step.id === 'intro' ? 'ml-auto' : ''}`}>
                      <Button 
                        label="Next" 
                        icon="pi pi-arrow-right" 
                        iconPos="right" 
                        onClick={() => {
                          stepperRef.current.nextCallback();
                          setCurrentInstruction(0);
                          setShowInstructions(true);
                        }} 
                      />
                    </div>
                  )}
                </div>
              </div>
            </StepperPanel>
          ))}
        </Stepper>
      </div>
    </div>
  );
};

export default ScenarioManager;