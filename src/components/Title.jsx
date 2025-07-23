const Title = ({ children }) => {
  return (
    <div className="relative border-s-8 border-[#AF3E3E] ps-3">
      <h2 className="text-6xl font-bold">{children}</h2>
      <p className="absolute bottom-0 text-9xl -z-10 opacity-5">{children}</p>
    </div>
  );
};

export default Title;
