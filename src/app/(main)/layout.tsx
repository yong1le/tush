import Navbar from "~/app/_components/nav-bar";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col md:flex-row w-screen h-[100dvh] overflow-hidden">
      <div className="shrink-0">
        <Navbar />
      </div>
      <div className="flex-1 min-w-0 overflow-auto m-4 md:m-10">{children}</div>
    </div>
  );
}
