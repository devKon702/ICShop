export default function LoadingIcon() {
  return (
    <div className="flex items-center">
      {/* bar 1 */}
      <div className="inline-block w-2 h-[30px] rounded-[10px] bg-black opacity-50 animate-scale-up"></div>
      {/* bar 2 */}
      <div className="inline-block w-2 h-[35px] mx-[5px] rounded-[10px] bg-black opacity-50 animate-scale-up animate-delay-500"></div>
      {/* bar 3 */}
      <div className="inline-block w-2 h-[30px] rounded-[10px] bg-black opacity-50 animate-scale-up animate-delay-1s"></div>
    </div>
  );
}
