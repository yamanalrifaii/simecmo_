import React, { useState } from 'react';
import vaECMO from '../../images/vaECMO.svg';
import ABG_Circuit from '../../images/ABG_Circuit.svg'; // You'll need to create this SVG
import PumpSettings from './PumpSettings';
import Blender1 from './Blender1';
import OxygenatorSettings from './OxygenatorSettings';
import OutputParameters from './OutputParameters';

function ECMOLayer({ values }) {
  const [visualizationMode, setVisualizationMode] = useState('cannulations');
  const { LV_Contractility, RV_Contractility, HR, Lactate, O2Sat } = values;

  // Simulate cardiac output drop due to reduced contractility
  const CO = (LV_Contractility + RV_Contractility) * HR / 100;
  const updatedO2Sat = Math.max(0, O2Sat - (2 * Lactate));

  // Define hemodynamics, blood gases, and pressures data
  const hemodynamics = {
    AoP: '90',
    PAP: '15',
    PCWP: '10',
    CVP: '5',
    CO_LV: CO.toFixed(2),
    CO_RV: '1.67',
  };

  const bloodGases = {
    pH: { arterial: '7.35', venous: '7.40' },
    pCO2: { arterial: '40', venous: '5' },
    pO2: { arterial: '349', venous: '44' },
    HCO3: { arterial: '24', venous: '23' },
    BE: { arterial: '0.1', venous: '0.2' },
    O2Sat: { arterial: updatedO2Sat.toFixed(1), venous: '80' },
    Lactate: Lactate.toFixed(1),
    Hb: '13',
    DO2: '917',
  };

  const pressures = {
    P1: '-22',
    P2: '177',
    P3: '170',
    Delta_P: '7',
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              visualizationMode === 'circulations'
                ? 'bg-red text-white hover:bg-red'
                : 'bg-blue-700 text-dark-grey'
            }`}
            onClick={() => setVisualizationMode('circulations')}
          >
            Circulations
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              visualizationMode === 'cannulations'
                ? 'bg-red text-white'
                : 'bg-blue-700 text-dark-grey hover:bg-gray-100'
            }`}
            onClick={() => setVisualizationMode('cannulations')}
          >
            Cannulations
          </button>
        </div>
      </div>

      <div className="flex justify-between items-start flex-grow">
        <div className="flex-grow flex justify-center relative">
          <div className="relative">

            {visualizationMode === 'cannulations' ? (
              <>
                <img 
                  src={vaECMO} 
                  width="700" 
                  height="300" 
                  alt="ECMO diagram" 
                  className="mx-4 relative"
                  style={{ top: '160px', left: '45px' }} 
                />
                <div className="absolute" style={{ top: '45%', left: '20%', transform: 'translate(-50%, -50%)' }}>
                  <OxygenatorSettings />
                </div>
                <div className="absolute" style={{ top: '95%', right: '105%', transform: 'translate(-50%, -50%)' }}>
                  <Blender1 />
                </div>
                <div className="absolute" style={{ top: '35%', left: '66%', transform: 'translate(-50%, -50%)' }}>
                  <PumpSettings />
                </div>
              </>
            ) : (
            <>
              <img 
                src={ABG_Circuit} 
                width="700" 
                height="200" 
                alt="Circulations diagram" 
                className="mx-4 relative"
                style={{ left: '45px', bottom: '30px'}} 
              />
              <div className="absolute" style={{ top: '15%', left: '42%', transform: 'translate(-50%, -50%)' }}>
              <OxygenatorSettings />
                </div>
                <div className="absolute" style={{ top: '25%', right: '110%', transform: 'translate(-50%, -50%)' }}>
              <Blender1 />
                </div>
                <div className="absolute" style={{ top: '88%', left: '56%', transform: 'translate(-50%, -50%)' }}>
              <PumpSettings />
                </div>
            </>
            )}
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <OutputParameters 
            hemodynamics={hemodynamics} 
            bloodGases={bloodGases} 
            pressures={pressures} 
          />
        </div>
      </div>
    </div>
  );
}

export default ECMOLayer;

// import React from 'react';
// import VA_ECMO from '../../images/VA_ECMO.svg';
// import PumpSettings from './PumpSettings';
// import Blender1 from './Blender1';
// import OxygenatorSettings from './OxygenatorSettings';
// import OutputParameters from './OutputParameters';
// import { useScenarioData } from '../../Contexts/ScenarioDataContext';

// function ECMOLayer({ isSimulation }) {
//     const scenarioData = useScenarioData();
//     const sessionData = scenarioData?.sessionData;

//     // Fallback for undefined sessionData
//     if (isSimulation && !sessionData) {
//         return <div>Loading ECMO data...</div>;
//     }

//     // Use sessionData if it's a simulation, otherwise provide local default values
//     const { LV_Contractility = 0.6, RV_Contractility = 0.8, HR = 80, Lactate = 2.0, O2Sat = 99 } = isSimulation && sessionData ? sessionData : {};

//     const CO = (LV_Contractility + RV_Contractility) * HR / 100;
//     const updatedO2Sat = Math.max(0, O2Sat - (2 * Lactate));

//     const hemodynamics = {
//         AoP: '90',
//         PAP: '15',
//         PCWP: '10',
//         CVP: '5',
//         CO_LV: CO?.toFixed(2),
//         CO_RV: '1.67',
//     };

//     const bloodGases = {
//         pH: { arterial: '7.35', venous: '7.40' },
//         pCO2: { arterial: '40', venous: '5' },
//         pO2: { arterial: '349', venous: '44' },
//         HCO3: { arterial: '24', venous: '23' },
//         BE: { arterial: '0.1', venous: '0.2' },
//         O2Sat: { arterial: updatedO2Sat?.toFixed(1), venous: '80' },
//         Lactate: Lactate?.toFixed(1),
//         Hb: '13',
//         DO2: '917',
//     };

//     const pressures = {
//         P1: '-22',
//         P2: '177',
//         P3: '170',
//         Delta_P: '7',
//     };

//     return (
//         <div className="flex justify-between items-start">
//             <div className="flex-grow flex justify-center relative">
//                 <div className="relative">
//                     <img 
//                         src={VA_ECMO} 
//                         width="700" 
//                         height="300" 
//                         alt="ECMO diagram" 
//                         className="mx-4 relative"
//                         style={{ top: '160px', left: '45px' }} 
//                     />
//                     <div className="absolute" style={{ top: '45%', left: '20%', transform: 'translate(-50%, -50%)' }}>
//                         <OxygenatorSettings />
//                     </div>
//                     <div className="absolute" style={{ top: '95%', right: '105%', transform: 'translate(-50%, -50%)' }}>
//                         <Blender1 />
//                     </div>
//                     <div className="absolute" style={{ top: '35%', left: '66%', transform: 'translate(-50%, -50%)' }}>
//                         <PumpSettings />
//                     </div>
//                 </div>
//             </div>
//             <div className="flex-shrink-0">
//                 <OutputParameters 
//                     hemodynamics={hemodynamics} 
//                     bloodGases={bloodGases} 
//                     pressures={pressures} 
//                 />
//             </div>
//         </div>
//     );
// }

// export default ECMOLayer;
