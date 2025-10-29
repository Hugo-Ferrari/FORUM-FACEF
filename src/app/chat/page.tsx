import Chat from "../components/chat/Chat";

function page() {
  return (
    <>

      {/* conteúdo principal com padding para a sidebar */}
      <div className="py-10 w-full overflow-x-hidden">
        <main className="">
          <div className=" mx-auto">
            <Chat />
          </div>
        </main>
      </div>
    </>
  );
}

export default page;