"use client"
import AddThreads from "./AddThreads";


function CourseThreads() {
  return (
    <div className="text-black dark:text-white p-6  ">
      <div className="flex w-full gap-6 ml-4">
        <h1 className="text-2xl font-bold text-black dark:text-white">Dúvidas Recentes</h1>
      </div>

      <AddThreads />
    </div>
  );
}

export default CourseThreads;
