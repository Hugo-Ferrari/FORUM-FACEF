import { useAuthStore } from "@/store/auth_store";
import { CircleUserRound } from "lucide-react";

function Usuario() {
    const {name} = useAuthStore.getState()
    const {course} = useAuthStore.getState()
    const {course_year} = useAuthStore.getState()
    return (
        <div className="flex items-center gap-3 ">
            <CircleUserRound className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            <div >
                <div className="flex items-center gap-2 text-black dark:text-white ">
                    <p className="font-medium">{name}</p>
                    
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{course} {course_year} ano</p>
            </div>
        </div>
    );
}

export default Usuario;