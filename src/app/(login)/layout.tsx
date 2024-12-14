import ThemeSwitch from "../_components/theme-switch";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full m-10 md:w-3/5 max-w-[600px] lg:w-2/5">
        {children}
      </div>
      <div className="absolute right-10 bottom-10">
        <ThemeSwitch />
      </div>
    </div>
  );
}
