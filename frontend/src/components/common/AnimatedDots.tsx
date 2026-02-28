import { useEffect, useState } from "react";

export const AnimatedDots = () => {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <span className="inline-block w-4 text-left">{dots}</span>;
};
