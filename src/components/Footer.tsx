const Footer = () => {
  return (
    <footer className="py-16 px-4 bg-card border-t border-border">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display text-4xl sm:text-5xl text-foreground tracking-wide mb-6">
          From the <span className="text-primary">Head Coach</span>
        </h2>
        <blockquote className="font-body text-muted-foreground text-lg leading-relaxed italic mb-8 max-w-2xl mx-auto">
          "At Shah Basketball Academy, our goal is to develop discipline, teamwork, and basketball skills in every player. Whether you are just starting or looking to improve your game, we are here to help you grow."
        </blockquote>
        <div>
          <p className="font-display text-2xl text-foreground tracking-wide">
            Sonu Shah
          </p>
          <p className="font-body text-primary text-sm font-semibold uppercase tracking-wider">
            Head Coach
          </p>
        </div>
      </div>
      <div className="mt-12 text-center text-muted-foreground font-body text-sm">
        © {new Date().getFullYear()} Shah Basketball Academy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
