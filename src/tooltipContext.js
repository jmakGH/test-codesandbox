import React, { createContext, useState } from "react";

export const tooltipContext = createContext({ tooltipId: null });

export const TooltipProvider = ({ children }) => {
  const [tooltipId, setTooltipId] = useState(null);
  return (
    <tooltipContext.Provider value={{ tooltipId, setTooltipId }}>
      {children}
    </tooltipContext.Provider>
  );
};
