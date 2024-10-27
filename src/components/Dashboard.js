import React from 'react';
import DataLayer from './DataLayer/DataLayer';
import ECMOLayer from './ECMOLayer/ECMOLayer';
import MLLayer from './MLLayer/MLLayer';

function Dashboard({values, setValues}) {
  return (
    <div className="h-full bg-white overflow-hidden p-4">
      <div className="flex h-full gap-4">
        {/* Data Layer */}
        <div className="w-1/5 bg-gray-100 rounded-lg shadow-lg p-2 overflow-auto">
          <h2 className="text-sm font-semibold text-gray-700 text-center mb-2">Data Layer</h2>
          <DataLayer values={values} setValues={setValues} />
        </div>

        {/* ECMO Layer */}
        <div className="w-3/5 bg-gray-100 rounded-lg shadow-lg p-2 overflow-auto flex flex-col">
          <h2 className="text-sm font-semibold mb-2 text-gray-700 text-center">ECMO Layer</h2>
          <ECMOLayer values={values} />
        </div>

        {/* ML Layer */}
        <div className="w-1/5 bg-gray-100 rounded-lg shadow-lg p-2 overflow-auto">
          <h2 className="text-sm font-semibold mb-2 text-gray-700 text-center">ML Layer</h2>
          <MLLayer />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

// import React from 'react';
// import DataLayer from './DataLayer/DataLayer';
// import ECMOLayer from './ECMOLayer/ECMOLayer';
// import MLLayer from './MLLayer/MLLayer';

// function Dashboard({values, setValues}) {
//   return (
//     <div className="h-full bg-white overflow-hidden">
//       <div className="flex h-full">
//         {/* Data Layer */}
//         <div className="w-1/5 bg-gray-100 rounded-lg shadow-lg p-2 overflow-auto">
//           <h2 className="text-sm font-semibold text-gray-700 text-center mb-2">Data Layer</h2>
//           <DataLayer values={values} setValues={setValues} />
//         </div>

//         {/* ECMO Layer */}
//         <div className="w-3/5 bg-gray-100 rounded-lg shadow-lg p-2 overflow-auto">
//           <h2 className="text-sm font-semibold mb-2 text-gray-700 text-center">ECMO Layer</h2>
//           <ECMOLayer values={values} />
//         </div>

//         {/* ML Layer */}
//         <div className="w-1/5 bg-gray-100 rounded-lg shadow-lg p-2 overflow-auto">
//           <h2 className="text-sm font-semibold mb-2 text-gray-700 text-center">ML Layer</h2>
//           <MLLayer />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;