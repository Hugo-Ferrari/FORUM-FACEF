import {  CircleUserRound } from "lucide-react"
import { Badge } from "../ui/badge"
interface UserHallProps{
    name: string,
    pontos: number,
    email: string,
}
export function UserHall({name, pontos, email}: UserHallProps){
    return(
        <div className=" bg-gray-300 flex flex-col max-w-50">
            <CircleUserRound/>
            <h1>
                {name}
            </h1>
            <p>{email}</p>

        
        <Badge variant={"secondary"}>
            <p> 5x capeão</p>
        </Badge>
        
        <p>
            {pontos}
        </p>
        <p>Pontos totais </p>
        </div>
    )
}