// ECMOParameters.js
export const ecmoparameters = {
    name: "ecmoparameters",
    introduction: "The ECMO Parameters Scenario explores the mechanical aspects of extracorporeal support and their physiological impacts. The key parameters in this scenario include: ECMO Speed (RPM): The rotational speed of the centrifugal pump that determines blood flow through the circuit. Oxygenator Resistance: The resistance to blood flow through the oxygenator membrane that affects overall circuit efficiency. Sweep Gas Flow: The flow of fresh gas through the oxygenator that controls gas exchange. ECMO Flow: The total blood flow through the circuit that determines the level of cardiopulmonary support. Understanding these parameters is crucial for optimizing ECMO support and managing complications.",
    conclusion: "Mastering ECMO parameter management is essential for providing optimal extracorporeal support while minimizing complications.",
    showVAECMOBox: true,
    instructions: [
      {
        text: "Start by examining the baseline ECMO parameters. Note the relationship between RPM settings and achieved flow rates.",
        position: { top: '10%', left: '5%', width: '20%', height: '80%' }
      },
      {
        text: "Adjust the ECMO speed (RPM) and observe its direct impact on circuit flow and patient hemodynamics.",
        position: { top: '40%', left: '30%', width: '40%', height: '30%' }
      },
      {
        text: "Monitor oxygenator resistance changes and their effects on circuit efficiency and gas exchange.",
        position: { top: '50%', left: '5%', width: '20%', height: '10%' }
      },
      {
        text: "Modify sweep gas flow rates while observing changes in blood gases and pH. Notice how this affects oxygenation and CO2 removal.",
        position: { top: '70%', left: '60%', width: '20%', height: '20%' }
      },
      {
        text: "Fine-tune ECMO flow while monitoring its effects on tissue perfusion and oxygenation parameters.",
        position: { top: '20%', left: '30%', width: '40%', height: '60%' }
      }
    ],
    simulationLogic: (setValues) => {
      setValues(prev => ({
        ...prev,
        RPM: 3000,
        OxygenatorResistance: 0.5,
        SweepFlow: 5.0,
        ECMOFlow: 4.0
      }));
  },
}; 
