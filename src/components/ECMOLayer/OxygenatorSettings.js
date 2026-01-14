import React, { useMemo } from 'react';
import { Slider } from 'primereact/slider';

function OxygenatorSettings({
    diffusion = 0.00100,
    oxygenatorResistance = 100.0,
    onDiffusionChange = () => {},
    onResistanceChange = () => {},
    disabled = false
}) {
    // Move useMemo hooks to the top level, before any conditional logic
    const diffusionDisplay = useMemo(() => {
        try {
            return diffusion.toFixed(5);
        } catch (e) {
            console.error('Error formatting diffusion:', e);
            return '0.00100';
        }
    }, [diffusion]);

    const resistanceDisplay = useMemo(() => {
        try {
            return oxygenatorResistance.toFixed(1);
        } catch (e) {
            console.error('Error formatting resistance:', e);
            return '100.0';
        }
    }, [oxygenatorResistance]);

    // Validation check after the hooks
    if (diffusion === undefined || oxygenatorResistance === undefined) {
        console.warn('OxygenatorSettings received undefined values:', { diffusion, oxygenatorResistance });
        return null;
    }

    const handleDiffusionChange = (newValue) => {
        if (disabled) return;
        const value = Math.min(0.01000, Math.max(0.00010, parseFloat(newValue.toFixed(5))));
        onDiffusionChange(value);
    };

    const handleResistanceChange = (newValue) => {
        if (disabled) return;
        const value = Math.min(200, Math.max(0, parseFloat(newValue.toFixed(1))));
        onResistanceChange(value);
    };

    const incrementDiffusion = () => handleDiffusionChange(diffusion + 0.00001);
    const decrementDiffusion = () => handleDiffusionChange(diffusion - 0.00001);
    const incrementResistance = () => handleResistanceChange(oxygenatorResistance + 0.5);
    const decrementResistance = () => handleResistanceChange(oxygenatorResistance - 0.5);

    return (
        <div className={`bg-white p-2 rounded-lg shadow-md w-48 ${disabled ? 'opacity-70' : ''}`}>
            <h3 className="text-dark-grey text-sm font-bold mb-2 text-center">Oxygenator Settings</h3>
            <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-dark-grey text-xs">Diffusion:</span>
                    <span className="text-dark-grey text-xs">{diffusionDisplay}</span>
                </div>
                <div className="flex items-center">
                    <button 
                        onClick={decrementDiffusion} 
                        className={`text-red text-xs px-2 py-1 rounded ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={disabled}
                    >-</button>
                    <Slider 
                        value={diffusion} 
                        onChange={(e) => handleDiffusionChange(e.value)} 
                        min={0.00010}
                        max={0.01000}
                        step={0.00001}
                        className="w-full mx-2"
                        disabled={disabled}
                    />
                    <button 
                        onClick={incrementDiffusion} 
                        className={`text-red text-xs px-2 py-1 rounded ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={disabled}
                    >+</button>
                </div>
            </div>
            <div>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-dark-grey text-xs">Oxygenator Resistance:</span>
                    <span className="text-dark-grey text-xs">{resistanceDisplay}</span>
                </div>
                <div className="flex items-center">
                    <button 
                        onClick={decrementResistance} 
                        className={`text-red text-xs px-2 py-1 rounded ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={disabled}
                    >-</button>
                    <Slider 
                        value={oxygenatorResistance} 
                        onChange={(e) => handleResistanceChange(e.value)} 
                        min={0}
                        max={200}
                        step={0.5}
                        className="w-full mx-2"
                        disabled={disabled}
                    />
                    <button 
                        onClick={incrementResistance} 
                        className={`text-red text-xs px-2 py-1 rounded ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={disabled}
                    >+</button>
                </div>
            </div>
        </div>
    );
}

export default OxygenatorSettings;