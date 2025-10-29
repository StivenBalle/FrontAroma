import { useState, useEffect } from "react";

export const useMinimumLoadingTime = (isLoading, minimumTime = 1000) => {
  const [showLoading, setShowLoading] = useState(isLoading);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!isLoading) {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minimumTime - elapsedTime);

      const timer = setTimeout(() => {
        setShowLoading(false);
      }, remainingTime);

      return () => clearTimeout(timer);
    } else {
      setShowLoading(true);
    }
  }, [isLoading, minimumTime, startTime]);

  return showLoading;
};
