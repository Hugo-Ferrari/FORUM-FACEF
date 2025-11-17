"use client"
import { useState } from "react";
import { X } from "lucide-react";
import AddDuvidas from "./AddDuvidas";


function DuvUsuario() {
  const [clicked, setClicked] = useState(false);
  const [doubtsList, setDoubtsList] = useState<{ curso: string; texto: string }[]>([]);

  const handleClick = () => setClicked(!clicked);

  return (
    <div className="text-black p-6  ">
      <div className="flex w-full gap-6 ml-4">
        <h1 className="text-2xl font-bold">Dúvidas Recentes</h1>

        {!clicked && (
          <div className="text-black ml-50">
            <button
              onClick={handleClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition"
            >
              Ver todas
            </button>
          </div>
        )}

        {clicked && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-2xl p-6 relative animate-fadeIn">
              <button
                onClick={handleClick}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <h1 className="text-xl font-bold mb-4">Todas as Dúvidas</h1>

              {doubtsList.length === 0 ? (
                <p className="text-gray-500">Nenhuma dúvida registrada.</p>
              ) : (
                <div className="max-h-[60vh] overflow-y-auto space-y-3">
                  {doubtsList.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-100 rounded-md shadow-sm hover:bg-gray-200 transition"
                    >
                      <strong className="text-blue-600">{item.curso}:</strong>{" "}
                      <p className="text-gray-700">{item.texto}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-right mt-6">
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

     
      <AddDuvidas doubtsList={doubtsList} setDoubtsList={setDoubtsList} />
    </div>
  );
}

export default DuvUsuario;
