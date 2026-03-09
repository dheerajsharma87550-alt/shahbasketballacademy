import heroBg from "@/assets/hero-basketball.jpg";

const HeroSection = () => {
  return (
    <section
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
    >
      <img
        src={heroBg}
        alt="Basketball court with dramatic lighting"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/90 via-secondary/70 to-secondary/95" />
      <div className="relative z-10 text-center px-4 py-20">
        <div className="inline-block mb-6">
          <span className="text-primary font-body text-sm font-semibold tracking-[0.3em] uppercase">
            🏀 Join the Team
          </span>
        </div>
        <h1 className="font-display text-6xl sm:text-8xl md:text-9xl text-primary-foreground leading-none tracking-wide mb-4">
          Shah Basketball
          <br />
          <span className="text-primary">Academy</span>
        </h1>
        <p className="font-body text-primary-foreground/70 text-lg sm:text-xl max-w-xl mx-auto mt-6 font-light">
          Train Hard. Play Smart. Become Better.
        </p>
        <a
          href="#register"
          className="inline-block mt-10 px-8 py-4 bg-primary text-primary-foreground font-body font-semibold rounded-lg text-lg hover:bg-primary/90 transition-all hover:shadow-[var(--shadow-elevated)] hover:scale-105"
        >
          Register Now
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
