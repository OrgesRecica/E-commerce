export default function ScrollProgress() {
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] bg-transparent z-[100] pointer-events-none">
      <div
        id="scroll-progress"
        className="h-full bg-lime origin-left"
        style={{ transform: 'scaleX(0)', transition: 'transform 0.1s linear' }}
      />
    </div>
  );
}
