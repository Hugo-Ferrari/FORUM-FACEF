import Diretrizes from "@/components/chat/Diretrizes";
import ChatGeral from "@/components/chat/ChatGeral";

function page() {
  return (
    <>
      {/* conteúdo principal com padding para a sidebar */}
      <div className="py-10 w-full overflow-x-hidden bg-background ">
        <main className="">
          <div className=" mx-auto flex">
            <ChatGeral />
            <div className="mt-20 bg-blue-100 h-65 p-6 rounded-2xl border-2 ">
              <Diretrizes/>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default page;