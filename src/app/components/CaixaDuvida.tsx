import Usuario from "./Usuario";

function DuvUsuario(){

    return(
       <div className="text-black">
         <div className="flex w-full gap-100 ml-75">
            <h1>
               Duvidas Recentes
            </h1>
            <button className="hover:hover:bg-[rgba(21,97,183,0.2)]">
               Veja todas
            </button>
         </div>
         <Usuario/>
       </div>
    )
}
export default DuvUsuario;