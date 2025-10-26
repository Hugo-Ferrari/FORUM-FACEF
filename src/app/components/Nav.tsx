import {BellIcon, UserRoundIcon, MoonIcon} from "lucide-react"
import React from "react"
import Link from "next/link";
import Image from "next/image";

function Nav() {
    return (
        <nav className="fixed w-full z-20 top-0 start-0  shadow-xl bg-[#1561B7]">
            <div className="flex items-center justify-between h-20 mx-10 p-1">
                <Link href="#" className="flex items-center space-x-3 rtl:space-x-reverse ">
                    <div className="h-10 w-43 relative">
                        <Image src="/img/Uni-FACEF.png" alt="Uni-FACEF" className="w-full object-contain" fill />
                    </div>
                </Link>
                <div className="md:order-1">
                    <ul className="flex items-center justify-end p-0 font-medium space-x-6 rtl:space-x-reverse">
                        <li>
                            <Link href="#" className="block py-3  text-white ">
                                <BellIcon  className={"size-8"} strokeWidth={1}/>
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="block py-3 text-white">
                                <MoonIcon className="size-8" strokeWidth={1}/>
                            </Link>
                        </li>
                        <li>
                            <Link href="#" className="flex py-2 text-white space-x-3 mr-3">
                                <UserRoundIcon className="size-8 rounded-4xl" strokeWidth={1}/>
                                <div className="flex flex-col leading-tight">
                                    <p className="">{/*Nome do aluno*/}</p>
                                    <p className="text-sm opacity-80 -mt-1">{/*curso do aluno*/}</p>
                                </div>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Nav