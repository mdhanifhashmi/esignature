"use client";

export function MotionBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(126,34,206,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(126,34,206,1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating orbs */}
      <div className="animate-float-slow absolute -left-20 top-20 h-72 w-72 rounded-full bg-purple-400/30 blur-3xl" />
      <div className="animate-float absolute -right-16 top-40 h-96 w-96 rounded-full bg-fuchsia-400/25 blur-3xl" style={{ animationDelay: "1s" }} />
      <div className="animate-float-delayed absolute bottom-20 left-1/3 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />

      {/* Ring decorations */}
      <div className="animate-spin-slow absolute right-[15%] top-[20%] h-32 w-32 rounded-full border border-purple-300/30" />
      <div className="animate-spin-slow absolute left-[10%] bottom-[30%] h-20 w-20 rounded-full border-2 border-dashed border-purple-400/25" style={{ animationDirection: "reverse" }} />

      {/* Small floating dots */}
      {[
        { top: "15%", left: "20%", delay: "0s", size: "h-3 w-3" },
        { top: "60%", left: "85%", delay: "0.5s", size: "h-2 w-2" },
        { top: "75%", left: "15%", delay: "1s", size: "h-4 w-4" },
        { top: "30%", left: "70%", delay: "1.5s", size: "h-2.5 w-2.5" },
      ].map((dot, i) => (
        <div
          key={i}
          className={`animate-bounce-soft absolute rounded-full bg-purple-500/40 ${dot.size}`}
          style={{ top: dot.top, left: dot.left, animationDelay: dot.delay }}
        />
      ))}
    </div>
  );
}
