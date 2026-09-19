"use client";
import { motion } from "framer-motion";
export function LoadingScreen() { return <motion.div className="loading-screen" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .45 }}><div className="loading-mark">TP</div><p>TANDOORI PIZZA</p><span>Loading map<span className="dot-pulse">...</span></span></motion.div>; }
