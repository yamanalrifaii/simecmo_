export const Hemodynamics = {
    name: "Hemodynamics",
    introduction: "The Hemodynamics Scenario aims to provide an in-depth understanding of how different cardiovascular parameters influence blood flow and overall heart function. By adjusting these parameters, users can observe their effects on circulation and cardiac performance. The key parameters explored in this scenario include:\Arterial Resistance: Represents the resistance that blood encounters as it flows through the arteries. Changes in arterial resistance can impact blood pressure and the workload on the heart. Venous Resistance: Refers to the resistance affecting the return of blood to the heart. Modifying venous resistance can influence venous return and, consequently, cardiac output. Pulmonary Vascular Resistance (PVR): The resistance faced by blood as it moves through the pulmonary circulation. PVR adjustments are essential for understanding how the right side of the heart responds to changes in lung circulation. Systemic Vascular Resistance (SVR): The total resistance encountered by blood in the systemic circulation. SVR is a crucial factor in determining systemic blood pressure and cardiac workload. This scenario allows users to explore the effects of these parameters individually and in combination, providing valuable insights into cardiovascular dynamics and how each factor contributes to maintaining circulatory stability.",
    conclusion: "Successful management of acute heart failure using ECMO involves careful monitoring of parameters, adjusting oxygen delivery, and supporting cardiac function.",
    showVAECMOBox: true,
    instructions: [
      {
        text: "Observe the initial patient parameters in the Data Layer. These parameters are reflective of a critically ill patient with acute heart failure. Start by assessing lung parameters such as FDO2 and Sweep, as well as heart-related parameters such as LV and RV contractility.",
        position: { top: '10%', left: '5%', width: '20%', height: '80%' }
      },
      {
        text: "Note the reduced LV and RV contractility in the ECMO Layer. These low values indicate that the heart is struggling to maintain proper blood flow. Begin by adjusting ECMO support to help offload the heart.",
        position: { top: '40%', left: '30%', width: '40%', height: '30%' }
      },
      {
        text: "Check the increased heart rate and rising lactate levels in the Data Layer. Elevated heart rate and lactate levels indicate poor tissue oxygenation. Gradually adjust the sweep gas and ECMO flow rates to improve oxygen delivery.",
        position: { top: '50%', left: '5%', width: '20%', height: '10%' }
      },
      {
        text: "Monitor the rising lactate levels in the ECMO Layer. Lactate is an indicator of tissue perfusion. If lactate levels continue to rise, increase oxygen delivery and ECMO support.",
        position: { top: '70%', left: '60%', width: '20%', height: '20%' }
      },
      {
        text: "Adjust ECMO settings as needed in the ECMO Layer. Once the patient stabilizes, you can fine-tune parameters such as FDO2 and flow rate to maintain stable oxygen levels and hemodynamics.",
        position: { top: '20%', left: '30%', width: '40%', height: '60%' }
      }
    ],
    simulationLogic: (setValues) => {
      setValues(prev => ({
        ...prev,
        LV_Contractility: 0.3,
        RV_Contractility: 0.4,
        HR: 120,
        Lactate: prev.Lactate + 2,
      }));
    },
  };
  