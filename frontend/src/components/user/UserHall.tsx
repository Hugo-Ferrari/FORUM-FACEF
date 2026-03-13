import {  CircleUserRound } from "lucide-react"
import { Badge } from "../ui/badge"

export default function UserHall(){
    return(
        <div className=" bg-gray-300 flex flex-col max-w-50">
            <CircleUserRound/>
            <h1>
                nome
            </h1>
            <p>email</p>

        
        <Badge variant={"secondary"}>
            <p> 5x capeão</p>
        </Badge>
        
        <p>
            9999
        </p>
        <p>Pontos totais </p>
        </div>
    )
}