import Usuario from "./Usuario";

function DuvUsuario() {
    return (
        <div className="text-black mt-4 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">
                    Duvidas Recentes
                </h1>
                <button className="text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
                    Veja todas
                </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm">
                <Usuario />
            </div>
        </div>
    )
}

export default DuvUsuario;