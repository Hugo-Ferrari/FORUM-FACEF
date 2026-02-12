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
                try {
                    const user: AuthState = await req_login(code)
                    set(user)
                } catch (error) {
                    console.log(error)
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