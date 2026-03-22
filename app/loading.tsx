export default function Loading() {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/60 backdrop-blur-sm">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-primary-light"
            style={{ animation: `logoPulse 1.2s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
