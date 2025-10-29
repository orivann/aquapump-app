import LogoAnimation from "@/components/LogoAnimation";

const BrandShowcase = () => {
  return (
    <section
      id="brand-experience"
      className="relative scroll-mt-32 overflow-hidden bg-background py-24 sm:py-28 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,_rgba(0,63,123,0.18)_0%,_transparent_70%)] sm:h-40" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[radial-gradient(circle_at_bottom,_rgba(0,63,123,0.12)_0%,_transparent_70%)] sm:h-40" />

      <div className="relative mx-auto w-full max-w-5xl px-6 sm:px-8">
        <LogoAnimation />
      </div>
    </section>
  );
};

export default BrandShowcase;
