import Image from "next/image";
import Nav from "./components/Nav";
import NavLateral from "./components/NavLateral";

export default function Home() {
  return (
    <div>
      <Nav/>
      <NavLateral/>
    </div>
  );
}
