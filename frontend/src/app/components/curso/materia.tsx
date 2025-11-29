"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    NativeSelect,
    NativeSelectOption,
} from "@/components/ui/native-select";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";

type MateriasProps =
    | { tipo: "provas"; valor: File | "" }
    | { tipo: "img"; valor: File | "" }
    | { tipo: "links"; valor: string | "" };

export default function Materia() {
    const [data, setData] = useState<MateriasProps>({
        tipo: "provas",
        valor: "",
    });

    const [lista, setLista] = useState<MateriasProps[]>([]);

    function renderInput() {
        switch (data.tipo) {
            case "provas":
                return (
                    <Input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) =>setData({tipo: "provas",valor: e.target.files?.[0] as File,})
                        }
                    />
                );

            case "img":
                return (
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setData({tipo: "img",valor: e.target.files?.[0] as File,})
                        }
                    />
                );

            case "links":
                return (
                    <Input
                        type="url"
                        placeholder="Cole seu link"
                        value={typeof data.valor === "string" ? data.valor : ""}
                        onChange={(e) =>
                            setData({tipo: "links",valor: e.target.value,})
                        }
                    />
                );
        }
    }

    function handleSave() {
        if (!data.valor) return;

        setLista((prev) => [...prev, data]); 
        setData({ tipo: "provas", valor: "" }); 
    }

    return (
        <div className="space-y-6 ml-10">

            <Popover>
                <PopoverTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">Adicionar Conteúdo</Button>
                </PopoverTrigger>

                <PopoverContent className="w-80 space-y-4">
                    <h1 className="font-semibold text-lg">Novo Conteúdo</h1>

                    <NativeSelect
                        value={data.tipo}
                        onChange={(e) =>
                            setData({
                                tipo: e.target.value as MateriasProps["tipo"],
                                valor: "",
                            })
                        }
                    >
                        <NativeSelectOption value="provas">Prova (PDF)</NativeSelectOption>
                        <NativeSelectOption value="img">Imagem</NativeSelectOption>
                        <NativeSelectOption value="links">Link</NativeSelectOption>
                    </NativeSelect>

                    {renderInput()}

                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
                        Salvar
                    </Button>
                </PopoverContent>
            </Popover>

           
            <div className="space-y-3">
                <h2 className="font-bold text-xl">Conteúdos Salvos</h2>

                {lista.length === 0 && <p>Nenhum conteúdo adicionado ainda.</p>}

                {lista.map((item, index) => (
                    <div key={index} className="border p-3 rounded-lg">

                        <p><strong>Tipo:</strong> {item.tipo}</p>

                        {item.tipo === "links" && (
                            <a
                                href={item.valor as string}
                                target="_blank"
                                className="text-blue-600 underline"
                            >
                                {item.valor}
                            </a>
                        )}

                        {item.tipo === "provas" && (
                            <p className="text-sm text-gray-600">
                                PDF enviado: {(item.valor as File).name}
                            </p>
                        )}

                        {item.tipo === "img" && (
                            <img
                                src={URL.createObjectURL(item.valor as File)}
                                alt="preview"
                                className="w-32 rounded-md"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
