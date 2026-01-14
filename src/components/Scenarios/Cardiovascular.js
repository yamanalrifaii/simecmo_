export const Cardiovascular = {
    name: "Cardiovascular",
    introduction: "The Cardiovascular Scenario focuses on the fundamental parameters that control heart function and their interaction with ECMO support. By adjusting these parameters, users can understand how cardiac performance affects patient outcomes. The key parameters explored in this scenario include: Heart Rate (HR): The fundamental rhythm of cardiac contraction that determines blood flow timing and cardiac output. Volume Status: The amount of blood in circulation that affects cardiac filling and performance. Left Ventricular Contractility: The strength of the left heart's pumping function, crucial for systemic perfusion. Right Ventricular Contractility: The right heart's pumping strength, essential for pulmonary circulation. This scenario demonstrates how these cardiac parameters interact with ECMO support to maintain adequate tissue perfusion and oxygenation.",
    conclusion: "Understanding cardiac parameter management in ECMO therapy is crucial for optimizing patient outcomes and achieving successful weaning.",
    showVAECMOBox: true,
    instructions: [
      {
        text: "Begin by observing the baseline cardiac parameters in the Data Layer. Note how heart rate, contractility, and volume status affect initial hemodynamics.",
        position: { top: '10%', left: '5%', width: '20%', height: '80%' }
      },
      {
        text: "Examine the heart rate and its effects on cardiac output. Changes in heart rate directly impact blood flow and tissue perfusion.",
        position: { top: '40%', left: '30%', width: '40%', height: '30%' }
      },
      {
        text: "Adjust volume status to understand its effects on cardiac filling and output. Watch how this affects both ventricles and ECMO flow.",
        position: { top: '50%', left: '5%', width: '20%', height: '10%' }
      },
      {
        text: "Monitor LV and RV contractility changes and their impact on systemic and pulmonary circulation. Observe how ECMO support complements cardiac function.",
        position: { top: '70%', left: '60%', width: '20%', height: '20%' }
      },
      {
        text: "Fine-tune all cardiac parameters while observing their combined effects on hemodynamics and tissue perfusion.",
        position: { top: '20%', left: '30%', width: '40%', height: '60%' }
      }
    ],
    simulationLogic: (setValues) => {
      setValues(prev => ({
        ...prev,
        HR: 90,
        Volume: 5000,
        LV_Contractility: 1.0,
        RV_Contractility: 1.0
      }));
    },
};