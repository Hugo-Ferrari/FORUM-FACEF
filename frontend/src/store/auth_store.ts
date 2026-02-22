import { persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand"
import {req_login, req_logout} from "@/requests/auth_requests";
import {redirect} from "next/navigation";


interface AuthState {
    name: string;
    code: number;
    description: string;
    skills: string[];
    links: string[];
    dark_mode: boolean;
    course: string;
    course_year: number;
    course_id: string;
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
            dark_mode: false,
            course: "",
            course_year: 0,
            course_id: "",

            login: async (code: number) => {
                console.log("LOG: Iniciando login (store)", code)
                try {
                    const user: AuthState =  await req_login(code)
                    if (user) {
                        set({
                            name: user.name,
                            code: user.code,
                            description: user.description,
                            skills: user.skills,
                            links: user.links,
                            dark_mode: user.dark_mode,
                            course: user.course,
                            course_year: user.course_year,
                            course_id: user.course_id
                        })
                    } else {
                        console.log("Falha na autenticação - dados do usuário não recebidos")
                    }
                } catch (error) {
                    console.log("Error no login:", error)
                    throw error
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
                      dark_mode: false,
                      course: "",
                      course_year: 0
                  })
                }
                redirect("/login")
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