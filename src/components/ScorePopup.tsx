import React, { useState, useEffect } from "react";
import { motion, animate } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ScorePopupProps {
  score: number;
  isOpen: boolean;
  onClose: () => void;
}

const ScorePopup: React.FC<ScorePopupProps> = ({ score, isOpen, onClose }) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const controls = animate(0, score, {
        duration: 5,
        onUpdate(value) {
          setDisplayScore(Math.round(value));
        },
        onComplete() {
          setTimeout(onClose, 3000);
        },
      });

      return () => controls.stop();
    }
  }, [isOpen, score, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] text-center">
        <div className="flex flex-col items-center justify-center space-y-4 p-6">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold text-blue-600"
          >
            {displayScore.toLocaleString()}
          </motion.div>
          <p className="text-sm text-gray-500">Your Queue Score</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScorePopup;
