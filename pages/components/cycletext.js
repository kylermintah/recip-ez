import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const buzzwords = ["fridge", "pantry", "cabinet", "freezer", "grocery store"];

const CycleText = () => {
  const [buzzwordIndex, setBuzzwordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBuzzwordIndex((buzzwordIndex + 1) % buzzwords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [buzzwordIndex]);

  return (
    <div>
      <motion.p
         initial={{ opacity: 0, y: "-100%" }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: "100%" }}
         transition={{ duration: 1, ease: "easeOut" }}
        className="text-xl text-center"
      >
        What's in your{" "}
        <span className="font-bold opacity-60">{buzzwords[buzzwordIndex]}</span>
        ?
      </motion.p>
    </div>
  );
};

export default CycleText;
