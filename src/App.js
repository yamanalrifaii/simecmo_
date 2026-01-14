import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Scenario from './components/Scenario';
import Dashboard from './components/Dashboard';
import NavBar from './components/Navbar';
import ScenarioManager from '../src/components/pages/ScenarioManager';
import Home from './components/Home';

function App() {
  const [values, setValues] = useState({
    sweep: 1,
    FDO2: 0.21,
    shunt_fraction: 50,
    DLCO: 60,
    FIO2: 0.21,
    Resp_Rate: 12,
    TV: 500,
    MVO2: 230,
    Hb: 13,
    Lactate: 1,
    HCO3: 20,
    LV_Contractility: 0.62,
    RV_Contractility: 0.80,
    SVR: 20,
    PVR: 10,
    Volume: 1200,
    HR: 70 
  });

  return (
    <Router>
      <div className="bg-dark-default text-text-primary font-poppins min-h-screen w-full bg-gray-100">
        <NavBar />
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/" element={<Dashboard values={values} setValues={setValues} />} />
          <Route 
            path="/scenarios/:scenarioId" 
            element={<ScenarioManager values={values} setValues={setValues} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Scenario from './components/Scenario';
// import Dashboard from './components/Dashboard';
// import NavBar from './components/Navbar';
// import { scenarios } from './components/Scenarios/index';
// import { ScenarioDataProvider } from './Contexts/ScenarioDataContext';

// function App() {
//   const [values, setValues] = useState({
//     sweep: 1,
//     FDO2: 0.21,
//     shunt_fraction: 50,
//     DLCO: 60,
//     FIO2: 0.21,
//     Resp_Rate: 12,
//     TV: 500,
//     MVO2: 230,
//     Hb: 13,
//     Lactate: 1,
//     HCO3: 20,
//     LV_Contractility: 0.62,
//     RV_Contractility: 0.80,
//     SVR: 20,
//     PVR: 10,
//     Volume: 1200,
//     HR: 70 
//   });

//   return (
//     <Router>
//       <ScenarioDataProvider>
//         <div className="bg-dark-default text-text-primary font-poppins min-h-screen w-full bg-gray-100">
//           <NavBar />
//           <Routes>
//             <Route path="/" element={<Dashboard values={values} setValues={setValues} />} />
//             <Route 
//               path="/scenarios/:scenarioId" 
//               element={<Scenario scenarios={scenarios} values={values} setValues={setValues} />}
//             />
//             {/* Simulation Route */}
//             {/* <Route 
//               path="/simulations/:simulationId" 
//               element={
//                 <Simulation simulations={simulations} values={values} setValues={setValues} />
//               } 
//             /> */}
//           </Routes>
//         </div>
//       </ScenarioDataProvider>
//     </Router>
//   );
// }

// export default App;