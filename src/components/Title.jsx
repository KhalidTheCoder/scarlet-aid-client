const Title = ({ children }) => {
  return (
    <div className="relative border-s-4 sm:border-s-6 md:border-s-8 border-[#AF3E3E] ps-2 sm:ps-3">
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
        {children}
      </h2>
      <p className="absolute bottom-0 text-5xl sm:text-6xl md:text-7xl lg:text-9xl -z-10 opacity-5">
        {children}
      </p>
    </div>
  );
};

export default Title;
