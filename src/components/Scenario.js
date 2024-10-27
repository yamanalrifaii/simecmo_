import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import Dashboard from './Dashboard';
import '../css/Scenarios.css';

const Scenario = ({ scenarios, values, setValues }) => {
    const { scenarioId } = useParams();
    const scenario = scenarios[scenarioId];
    const stepperRef = useRef(null);
    const [currentInstruction, setCurrentInstruction] = useState(0);
    const [showOverlay, setShowOverlay] = useState(false);
  
    useEffect(() => {
      if (scenario && scenario.simulationLogic) {
        scenario.simulationLogic(setValues);
      }
    }, [scenario, setValues]);
  
    const nextInstruction = () => {
      if (currentInstruction < scenario.instructions.length - 1) {
        setCurrentInstruction(currentInstruction + 1);
      } else {
        setShowOverlay(false);
      }
    };

  const renderOverlay = () => {
    if (!showOverlay) return null;
  
    const { text } = scenario.instructions[currentInstruction];
  
    return (
      <div className="fixed inset-0 z-50 pointer-events-none">
        <div
          className="fixed bg-white p-4 rounded-lg shadow-lg pointer-events-auto"
          style={{
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: '80%',
            zIndex: 60,
          }}
        >
          <p className="text-lg font-semibold mb-4">{text}</p>
          <div className="flex justify-between">
            <Button 
              label="Close Guide" 
              icon="pi pi-times" 
              onClick={() => setShowOverlay(false)} 
              className="p-button-secondary"
            />
            <Button 
              label={currentInstruction === scenario.instructions.length - 1 ? "Finish" : "Next"} 
              icon="pi pi-chevron-right" 
              iconPos="right" 
              onClick={nextInstruction} 
            />
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="card flex flex-column h-full w-full relative">
      <Stepper ref={stepperRef} style={{ width: '100%' }} className="custom-stepper">
      <StepperPanel header="Introduction">
            <div className="flex flex-column h-[calc(100vh-200px)] justify-center items-center p-4">
              <div className="text-m md:text-xl lg:text-xl font-medium text-center max-w-4xl">
                {scenario.introduction}
              </div>
            </div>
            <div className="absolute bottom-4 right-5">
                <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
            </div>
          </StepperPanel>
        
        <StepperPanel header={`${scenario.name} Scenario`}>
          <div className="flex h-[calc(100vh-200px)] relative">
            <div className="flex-grow pr-4" style={{ width: '100%', position: 'relative' }}>
              {renderOverlay()}
              <Button
                label="Instructions"
                icon="pi pi-question-circle"
                onClick={() => { setShowOverlay(true); setCurrentInstruction(0); }}
                className="p-button-help"
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  zIndex: 10
                }}
              />
              {scenario.showVAECMOBox && (
                <div 
                  className="absolute bg-red text-white px-3 py-1 rounded-md text-sm font-semibold mb-4 flex"
                  style={{
                    top: '51px',
                    left: '76%',
                    transform: 'translateX(-50%)',
                    zIndex: 20
                  }}
                >
                  VA ECMO
                </div>
              )}
              <Dashboard values={values} setValues={setValues} />
            </div>
          </div>
          <div className="flex h-[calc(100vh-200px)] relative">
            <div className="absolute bottom-4 left-4">
                <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
            </div>
            <div className="absolute bottom-4 right-8">
                <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
            </div>
          </div>

        </StepperPanel>

        <StepperPanel header="Conclusion">
          <div className="flex flex-column h-[calc(100vh-200px)] justify-center items-center p-4">
            <div className="text-m md:text-xl lg:text-xl font-medium text-center max-w-4xl">
              {scenario.conclusion}
            </div>
          </div>
          <div className="flex pt-4 justify-content-between">
              <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
              <div>{/* Empty div to maintain spacing */}</div>
            </div>
        </StepperPanel>
      </Stepper>
    </div>
  );
};

export default Scenario;