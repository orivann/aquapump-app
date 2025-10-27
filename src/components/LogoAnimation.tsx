import brandLogo from "@/assets/brand-logo.png";
import logoAnimation from "@/assets/animation-waves.gif";

const LogoAnimation = () => {
  return (
    <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-[28px] border border-border/40 bg-white/95 shadow-[0_28px_60px_rgba(9,29,78,0.18)] backdrop-blur">
      <div className="pointer-events-none absolute inset-0">
        <img
          src={logoAnimation}
          alt="Animated AquaPump waves"
          className="h-full w-full object-cover"
          loading="eager"
        />
      </div>
      <div className="relative flex items-center justify-center p-6 sm:p-8">
        <img
          src={brandLogo}
          alt="AquaPump"
          className="h-12 w-auto sm:h-14"
          loading="eager"
        />
      </div>
    </div>
  );
};

export default LogoAnimation;
