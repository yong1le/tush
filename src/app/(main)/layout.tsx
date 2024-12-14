import Navbar from "~/app/_components/nav-bar";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Navbar />
      <div>{children}</div>
    </div>
  );
}
