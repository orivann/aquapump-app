const AmbientBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.12),_transparent_55%)]" />
      <div
        className="absolute inset-0 opacity-70 mix-blend-lighten"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 20%, hsl(var(--accent) / 0.18), transparent 45%),
            radial-gradient(circle at 80% 0%, hsl(var(--primary) / 0.2), transparent 55%),
            radial-gradient(circle at 15% 80%, hsl(var(--primary-dark) / 0.2), transparent 60%)
          `,
        }}
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(90deg, hsl(var(--primary) / 0.06) 1px, transparent 1px),
            linear-gradient(0deg, hsl(var(--primary) / 0.06) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(circle at center, black, transparent 75%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "linear-gradient(130deg, rgba(255,255,255,0.25), transparent 55%)",
          filter: "blur(30px)",
        }}
      />
      <div
        className="absolute inset-0 opacity-20 mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='160' height='160' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 160 160 0zm160 160L0 0' stroke='rgba(255,255,255,0.08)' fill='none'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
};

export default AmbientBackground;
