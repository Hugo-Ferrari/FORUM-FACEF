import axios from "axios";
import {setCookie } from "cookies-next/client"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const api = axios.create({baseURL: API_BASE})


export const req_login = async (code: number) => {
    console.log("LOG: Iniciando login")
    try {
        console.log("LOG: Fazendo login")
        const res = await api.post("/auth/login",{
            code
        }, {})

        if(res.data.token){
            console.log("LOG: Token recebido")
            setCookie("token", res.data.token)
        }

        try {
            console.log("LOG: Pegando info do usuario")
            const user = await api.get("/auth/user")

            if(user.data){
                console.log("LOG: Info do usuario recebida")
                return user.data
            }
            return null
        } catch (error) {
            console.log(`ERROR: conseguir pegar info do usuario: ${error}`)
        }
    } catch (error) {
        console.log(`ERROR: fazer login: ${error}`)
    }
}

export const req_logout = () => {
    try {
        setCookie("token", "", {maxAge: -1})
        return true

    } catch (error) {
        console.log(error)
        return false
    }
}