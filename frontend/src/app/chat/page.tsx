import Diretrizes from "@/components/chat/Diretrizes";
import ChatGeral from "@/components/chat/ChatGeral";

function page() {
  return (
    <>
      <div className="py-10 w-full overflow-x-hidden bg-background ">
        <main className="">
          <div className=" mx-auto flex">
            <ChatGeral />
            <div className="mt-20 dark:bg-card h-85 p-6  ">
              <Diretrizes/>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default page;