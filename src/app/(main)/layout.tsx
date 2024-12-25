import Navbar from "~/app/_components/nav-bar";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-row w-screen h-screen">
      <Navbar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
