import Usuario from "../user/Usuario";

function DuvUsuario(){

    return(
       <div className="text-black mt-4">
         <div className="flex w-full gap-100 ml-75">
            <h1 className="text-2xl">
               Duvidas Recentes
            </h1>
            <button className="hover:hover:bg-[rgba(21,97,183,0.2)] text-2xl ">
               Veja todas
            </button>
         </div>
         
       </div>
    )
}
export default DuvUsuario;