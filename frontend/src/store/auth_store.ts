import { persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand"
import {req_login, req_logout} from "@/requests/auth_requests";


interface AuthState {
    name: string;
    code: number;
    description: string;
    skills: string[];
    links: string[];
    darkmode: boolean;
    course: string;
    course_year: number;
}

interface AuthActions {
    login: (code: number) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
    persist(
        (set) => ({
            name: "",
            code: 0,
            description: "",
            skills: [],
            links: [],
            darkmode: false,
            course: "",
            course_year: 0,

            login: async (code: number) => {
                console.log("LOG: Iniciando login (store)", code)
                try {
                    const user: AuthState = await req_login(code)
                    if (user) {
                        set(user)
                    } else {
                        return Error("Falha na autenticação - dados do usuário não recebidos")
                    }
                } catch (error) {
                    console.log("Error no login:", error)
                    throw error  // Propaga o erro para o componente
                }
            },

            logout: () => {
                const res = req_logout()

                if(res) {
                  set({name: "",
                      code: 0,
                      description: "",
                      skills: [],
                      links: [],
                      darkmode: false,
                      course: "",
                      course_year: 0
                  })
                }
            },
        }), {
            name: "auth-storage",
            storage: createJSONStorage(() =>
                typeof window !== "undefined" && typeof window.localStorage !== "undefined"
                    ? window.localStorage
                    : {
                        getItem: () => null,
                        setItem: () => {},
                        removeItem: () => {},
                    }
            ),
        }
    )
)