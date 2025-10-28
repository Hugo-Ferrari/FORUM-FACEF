import NavLateral from "../components/nav/NavLateral";
import Chat from "../components/chat/Chat";

function page() {
  return (
    <>

      {/* conteúdo principal com padding para a sidebar */}
      <div className="min-h-screen bg-[#EFF0F6]">
        <main className="p-6 pt-10 md:pl-64"> 
          <div className=" mx-auto mt-10">
            <Chat />
          </div>
        </main>
      </div>
    </>
  );
}

export default page;