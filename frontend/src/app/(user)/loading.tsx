export default function loading() {
  return (
    <div className="h-96 bg-white flex items-center justify-center font-bold opacity-50 text-3xl">
      <div className="loader bg-[#333]"></div>
      <div className="loader delay-1 bg-[#333]"></div>
      <div className="loader delay-2 bg-[#333]"></div>
      <div className="loader delay-3 bg-[#333]"></div>
    </div>
  );
}
