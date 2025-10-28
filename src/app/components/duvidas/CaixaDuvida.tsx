"use client"
import { useEffect, useState } from "react";
import { CircleUserRound, X } from "lucide-react";
import AddDuvidas from "./AddDuvidas";

function DuvUsuario() {
   const [clicked, setCliked] = useState(false);
   const handleClick = () => {
      setCliked(!clicked);
   };


   return (

      <div className="text-black p-6 ">
         <div className="flex  w-full gap-6 ml-4">
            <h1 className="text-2xl font-bold">Dúvidas Recentes</h1>

            {!clicked && (
               <div className="text-black ml-30">
                  <button
                     onClick={handleClick}
                     className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition"
                  >
                     Ver todas
                  </button>
               </div>
            )}


            {clicked && (
               <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6 relative animate-fadeIn">

                     <button
                        onClick={handleClick}
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
                     >
                        <X className="w-5 h-5" />
                     </button>
                     

                     <h1 className="text-xl font-bold mb-4">Dúvidas</h1>
                     <div className="mb-4">

                     
                     </div>


                     <div className="mb-4">
                        <input
                           type="text"
                           placeholder="Buscar..."
                           className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                     </div>

                     <div className="bg-gray-100 rounded-md p-4 shadow-inner mb-4">

                     </div>


                     <div className="text-right">
                        <button
                           onClick={handleClick}
                           className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                           Fechar
                        </button>
                     </div>
                  </div>
               </div>
            )}
         </div>
            <AddDuvidas/>
      </div>
   );
}

export default DuvUsuario;
