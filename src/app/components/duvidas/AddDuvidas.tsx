import React, { useEffect, useState } from 'react'

function AddDuvidas() {
    const [doubtsList, setDoubtsList] = useState<string[]>([])
    const [newDoubts, setNewDoubts] = useState("")
    const [showModal, setShowModal] = useState(false)

    const toggleModal =()=>{
        setShowModal(!showModal)
    }
        
    const handleAddDoubts =()=>{
        if(newDoubts.trim()===""){
            alert("Digite uma duvida antes de enviar")
            return
        }

        setDoubtsList([...doubtsList, newDoubts])
        setNewDoubts("")
        setShowModal(false)
    }
    
        
    
    
     return (
    <div className="flex flex-col items-start w-full p-6">
      <button
        onClick={toggleModal}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Adicionar Dúvida
      </button>

      
      <div className="mt-6 w-full">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">Minhas Dúvidas</h2>

        {doubtsList.length === 0 ? (
          <p className="text-gray-500">Nenhuma dúvida adicionada ainda.</p>
        ) : (
          <ul className="space-y-2">
            {doubtsList.map((doubt, index) => (
              <li
                key={index}
                className="p-3 bg-gray-100 rounded-md shadow-sm hover:bg-gray-200"
              >
                {doubt}
              </li>
            ))}
          </ul>
        )}
      </div>

      
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Nova Dúvida</h1>

            <input
              type="text"
              value={newDoubts}
              onChange={(e) => setNewDoubts(e.target.value)}
              placeholder="Digite sua dúvida"
              className="w-full px-4 py-2 rounded-md border border-gray-300 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={toggleModal}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancelar
              </button>

              <button
                onClick={handleAddDoubts}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddDuvidas;