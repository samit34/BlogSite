import { motion } from "framer-motion";

const defaultViewport = {
  once: true,
  amount: 0.12,
  margin: "0px 0px -56px 0px",
};

/**
 * Fades and slides content up when it enters the viewport while scrolling.
 */
export function ScrollReveal({ children, className, delay = 0, y = 28 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={defaultViewport}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

/** Slightly subtler motion for large sections */
export function ScrollRevealWide({ children, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08, margin: "0px 0px -32px 0px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
