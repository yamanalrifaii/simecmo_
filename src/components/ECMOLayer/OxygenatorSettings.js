import React, { useState } from 'react';
import { Slider } from 'primereact/slider';

function OxygenatorSettings() {
    const [diffusion, setDiffusion] = useState(0.00505);
    const [oxygenatorResistance, setOxygenatorResistance] = useState(100);

    const handleDiffusionChange = (newValue) => {
        setDiffusion(Math.min(0.01000, Math.max(0.00010, parseFloat(newValue.toFixed(5)))));
    };

    const handleResistanceChange = (newValue) => {
        setOxygenatorResistance(Math.min(200, Math.max(0, parseFloat(newValue.toFixed(1)))));
    };

    const incrementDiffusion = () => handleDiffusionChange(diffusion + 0.00001);
    const decrementDiffusion = () => handleDiffusionChange(diffusion - 0.00001);
    const incrementResistance = () => handleResistanceChange(oxygenatorResistance + 0.5);
    const decrementResistance = () => handleResistanceChange(oxygenatorResistance - 0.5);

    return (
        <div className="bg-white p-2 rounded-lg shadow-md w-48">
            <h3 className="text-dark-grey text-sm font-bold mb-2 text-center">Oxygenator Settings</h3>
            <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-dark-grey text-xs">Diffusion:</span>
                    <span className="text-dark-grey text-xs">{diffusion.toFixed(5)}</span>
                </div>
                <div className="flex items-center">
                    <button onClick={decrementDiffusion} className="text-red text-xs px-2 py-1 rounded">-</button>
                    <Slider 
                        value={diffusion} 
                        onChange={(e) => handleDiffusionChange(e.value)} 
                        min={0.00010}
                        max={0.01000}
                        step={0.00001}
                        className="w-full mx-2"
                    />
                    <button onClick={incrementDiffusion} className="text-red text-xs px-2 py-1 rounded">+</button>
                </div>
            </div>
            <div>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-dark-grey text-xs">Oxygenator Resistance:</span>
                    <span className="text-dark-grey text-xs">{oxygenatorResistance.toFixed(1)}</span>
                </div>
                <div className="flex items-center">
                    <button onClick={decrementResistance} className="text-red text-xs px-2 py-1 rounded">-</button>
                    <Slider 
                        value={oxygenatorResistance} 
                        onChange={(e) => handleResistanceChange(e.value)} 
                        min={0}
                        max={200}
                        step={0.5}
                        className="w-full mx-2"
                    />
                    <button onClick={incrementResistance} className="text-red text-xs px-2 py-1 rounded">+</button>
                </div>
            </div>
        </div>
    );
}

export default OxygenatorSettings;


// import React from 'react';
// import { Slider } from 'primereact/slider';
// import { useScenarioData } from '../../Contexts/ScenarioDataContext';

// function OxygenatorSettings({ isSimulation, diffusion, setDiffusion, oxygenatorResistance, setResistance }) {
//     const { sessionData, updateSessionData } = useScenarioData();

//     // For simulations, get values from sessionData
//     const currentDiffusion = isSimulation ? sessionData?.diffusion : diffusion;
//     const currentResistance = isSimulation ? sessionData?.oxygenatorResistance : oxygenatorResistance;

//     const handleDiffusionChange = (newValue) => {
//         const updatedValue = Math.min(0.01000, Math.max(0.00010, parseFloat(newValue.toFixed(5))));
//         if (isSimulation) {
//             updateSessionData('diffusion', updatedValue);  // Simulation: Backend update
//         } else {
//             setDiffusion(updatedValue);  // Scenario: Local state update
//         }
//     };

//     const handleResistanceChange = (newValue) => {
//         const updatedValue = Math.min(200, Math.max(0, parseFloat(newValue.toFixed(1))));
//         if (isSimulation) {
//             updateSessionData('oxygenatorResistance', updatedValue);  // Simulation: Backend update
//         } else {
//             setResistance(updatedValue);  // Scenario: Local state update
//         }
//     };
//     const incrementDiffusion = () => handleDiffusionChange(currentDiffusion + 0.00001);
//     const decrementDiffusion = () => handleDiffusionChange(currentDiffusion - 0.00001);
//     const incrementResistance = () => handleResistanceChange(currentResistance + 0.5);
//     const decrementResistance = () => handleResistanceChange(currentResistance - 0.5);

//     return (
//         <div className="bg-white p-2 rounded-lg shadow-md w-48">
//             <h3 className="text-dark-grey text-sm font-bold mb-2 text-center">Oxygenator Settings</h3>
//             <div className="mb-4">
//                 <div className="flex justify-between items-center mb-1">
//                     <span className="text-dark-grey text-xs">Diffusion:</span>
//                     <span className="text-dark-grey text-xs">{currentDiffusion.toFixed(5)}</span>
//                 </div>
//                 <div className="flex items-center">
//                     <button onClick={decrementDiffusion} className="text-dark-grey text-xs px-2 py-1 bg-white rounded">-</button>
//                     <Slider 
//                         value={currentDiffusion} 
//                         onChange={(e) => handleDiffusionChange(e.value)} 
//                         min={0.00010}
//                         max={0.01000}
//                         step={0.00001}
//                         className="w-full mx-2"
//                     />
//                     <button onClick={incrementDiffusion} className="text-dark-grey text-xs px-2 py-1 bg-white rounded">+</button>
//                 </div>
//             </div>
//             <div>
//                 <div className="flex justify-between items-center mb-1">
//                     <span className="text-dark-grey text-xs">Oxygenator Resistance:</span>
//                     <span className="text-dark-grey text-xs">{currentResistance.toFixed(1)}</span>
//                 </div>
//                 <div className="flex items-center">
//                     <button onClick={decrementResistance} className="text-dark-grey text-xs px-2 py-1 bg-white rounded">-</button>
//                     <Slider 
//                         value={currentResistance} 
//                         onChange={(e) => handleResistanceChange(e.value)} 
//                         min={0}
//                         max={200}
//                         step={0.5}
//                         className="w-full mx-2"
//                     />
//                     <button onClick={incrementResistance} className="text-dark-grey text-xs px-2 py-1 bg-white rounded">+</button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default OxygenatorSettings;
