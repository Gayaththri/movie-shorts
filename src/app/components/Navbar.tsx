export async function Navbar() {
  return (
    <nav className="border-b bg-background h-[10vh] flex items-center sticky top-0 z-10">
      <div className="container flex items-center justify-between">
        <h1 className="font-bold text-3xl">
          Movie<span className="text-primary">Shorts</span>
        </h1>

        <div className="flex items-center gap-x-5"></div>
      </div>
    </nav>
  );
}
