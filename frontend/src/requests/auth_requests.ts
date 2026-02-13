import axios from "axios";
import {setCookie } from "cookies-next/client"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const api = axios.create({baseURL: API_BASE})


export const req_login = async (code: number) => {
    console.log("LOG: Iniciando login", code)
    try {
        console.log("LOG: Fazendo login")
        const res = await api.post("/auth/login",{
            code: code,
            password: ""
        })
        console.log("LOG: Login feito", res.data)

        if(res.data.access_token){  // Corrigido: access_token em vez de token
            console.log("LOG: Token recebido")
            setCookie("token", res.data.access_token)
        }

        try {
            console.log("LOG: Pegando info do usuario")
            // Passando o token no header Authorization
            const user = await api.get("/auth/user", { 
                headers: {
                    'Authorization': `Bearer ${res.data.access_token}`
                }
            })

            if(user.data){
                console.log("LOG: Info do usuario recebida")
                return user.data
            }
            return null
        } catch (error) {
            console.log(`ERROR: conseguir pegar info do usuario: ${error}`)
            return error  // Propaga o erro
        }
    } catch (error) {
        console.log(`ERROR: fazer login: ${error}`)
        throw error  // Propaga o erro para o store/componente
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