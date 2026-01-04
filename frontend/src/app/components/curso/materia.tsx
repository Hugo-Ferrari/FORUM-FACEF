"use client";

import { useState, useEffect } from "react";
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
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogHeader,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";

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
    const [modalOpen, setModalOpen] = useState(false);
    const [modalImageFile, setModalImageFile] = useState<File | null>(null);
    const [modalImageObjectUrl, setModalImageObjectUrl] = useState<string | null>(null);

    function renderInput() {
        switch (data.tipo) {
            case "provas":
                return (
                    <Input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setData({ tipo: "provas", valor: e.target.files?.[0] as File, })
                        }
                    />
                );

            case "img":
                return (
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setData({ tipo: "img", valor: e.target.files?.[0] as File, })
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
                            setData({ tipo: "links", valor: e.target.value, })
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

    function openFileInNewTab(file: File) {
        const url = URL.createObjectURL(file)
        window.open(url, "_blank")
    }

    function openLinkInNewTab(link: string) {
        window.open(link, "_blank")
    }

    // revoke object url when modal closes or file changes
    useEffect(() => {
        if (!modalOpen && modalImageObjectUrl) {
            try {
                URL.revokeObjectURL(modalImageObjectUrl)
            } catch { }
            setModalImageObjectUrl(null)
        }
    }, [modalOpen, modalImageObjectUrl])

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


            <div className="space-y-3 max-h-[28vh] overflow-y-auto pr-2">
                <h2 className="font-bold text-xl">Conteúdos Salvos</h2>

                {lista.length === 0 && <p>Nenhum conteúdo adicionado ainda.</p>}

                {lista.map((item, index) => (
                    <div key={index} className="border p-3 rounded-lg ">

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
                                className="w-32 rounded-md cursor-pointer"
                                onClick={() => {
                                    const file = item.valor as File
                                    const url = URL.createObjectURL(file)
                                    setModalImageObjectUrl(url)
                                    setModalImageFile(file)
                                    setModalOpen(true)
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>
            <Dialog open={modalOpen} onOpenChange={(open) => setModalOpen(open)}>
                <DialogContent className="max-w-5xl w-full">
                    <DialogHeader>
                        <DialogTitle>Visualização</DialogTitle>
                    </DialogHeader>

                    <div className="flex items-center justify-center">
                        {modalImageObjectUrl && (
                            <img src={modalImageObjectUrl} alt="preview" className="max-h-[80vh] object-contain" />
                        )}
                    </div>

                    <DialogFooter>
                        <div className="flex flex-wrap gap-2">
                            {modalImageFile && (
                                <Button onClick={() => openFileInNewTab(modalImageFile)}>Abrir Imagem</Button>
                            )}

                            {lista.filter((it) => it.tipo === "provas").map((it, i) => (
                                <Button key={i} onClick={() => openFileInNewTab(it.valor as File)}>
                                    Abrir PDF {i + 1}
                                </Button>
                            ))}

                            {lista.filter((it) => it.tipo === "links").map((it, i) => (
                                <Button key={i} onClick={() => openLinkInNewTab(it.valor as string)}>
                                    Abrir Link {i + 1}
                                </Button>
                            ))}
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
