import logoAnimation from "@/assets/animation-waves.gif";

const LogoAnimation = () => {
  return (
    <figure className="group relative mx-auto w-full overflow-hidden rounded-[40px] border border-border/30 bg-white/80 shadow-[0_32px_88px_rgba(9,29,78,0.2)] backdrop-blur-sm transition-[transform,box-shadow] duration-500 ease-out sm:max-w-xl lg:max-w-3xl">
      <div className="relative aspect-[5/4] sm:aspect-[4/3]">
        <img
          src={logoAnimation}
          alt="Animated AquaPump waves"
          className="absolute inset-0 h-full w-full object-cover brightness-[1.05] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          loading="eager"
          decoding="async"
        />
      </div>
    </figure>
  );
};

export default LogoAnimation;
