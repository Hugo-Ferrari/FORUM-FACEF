"use client"
import { useState } from "react";
import AddDuvidas from "./AddDuvidas";


function DuvUsuario() {
  const [doubtsList, setDoubtsList] = useState<{ curso: string; texto: string }[]>([]);


  return (
    <div className="text-black p-6  ">
      <div className="flex w-full gap-6 ml-4">
        <h1 className="text-2xl font-bold">Dúvidas Recentes</h1>
      </div>


      <AddDuvidas doubtsList={doubtsList} setDoubtsList={setDoubtsList} />
    </div>
  );
}

export default DuvUsuario;
