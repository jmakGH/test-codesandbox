import React, { useContext, useRef, useEffect, useState } from "react";
import { TooltipProvider, tooltipContext } from "./tooltipContext";
import PubSubTooltipButton from "./tooltipPubSub";
import "./styles.css";

// How should a Tooltip communicate with another Tooltip that they should hide themselves?

// Valid solution: ContextProvider
// Pros:
//   - Simple to setup
//   By storing a current tooltipId in context we can let the tooltip know whether it should be showing or not.
//   const {currentId, setCurrentId} = useContext(globalTooltipProvider);
//   const isVisible = currentId === tooltipId;
//   Within the mouseenter/onfocus handlers we need to setCurrentId to the tooltipId
// Cons:
//   - Where should this live? Does they live at the top-level?
//   <Application>
//       <GlobalTooltipProvider>
//          <main>Main Page Content</main>
//       </GlobalTooltipProvider>
//   </Application>
//   - Consumers of this component have to wrap their application with this context provider.

////////////////////////
// Tooltip
let runningId = 0;
const TooltipButton = props => {
  const id = useRef(runningId++);
  const { tooltipId, setTooltipId } = useContext(tooltipContext);
  const timer = useRef();

  // Why do you need to keep track of activeToolip and showTooltip?
  const activeTooltip = tooltipId === id.current;
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (!activeTooltip) {
      setShowTooltip(false);
      // If this tooltip is no longer active cancel its timers
      // clearTimeout(hideTimer.current);
      // hideTimer.current = null;
      // clearTimeout(showTimer.current);
      // showTimer.current = null;
    }
  }, [activeTooltip]);

  const clearTimer = () => {
    clearTimeout(timer.current);
    timer.current = null;
  };
  const revealTooltip = () => {
    // if revealing the same tooltip before hiding it cancel the hide handler.
    clearTimer();
    setTooltipId(id.current);
    timer.current = setTimeout(() => {
      // delay showing
      setShowTooltip(true);
      // if we hover another tooltip before this timer finishes we should cancel this timeout.
      timer.current = null;
    }, 500);
  };

  const hideTooltip = () => {
    // if still waiting to show and we call hide, thne cancel show.
    clearTimer();

    if (!showTooltip) {
      return;
    }
    // delay hiding
    timer.current = setTimeout(() => {
      setShowTooltip(false);
      setTooltipId(null);
      // if we hover another tooltip before this is called cancel this timer, but also hide immediately.
    }, 1000);
  };

  return (
    <button
      className="Btn"
      onMouseEnter={revealTooltip}
      onFocus={revealTooltip}
      onMouseLeave={hideTooltip}
      onBlur={hideTooltip}
    >
      {props.children}
      {showTooltip && <span className="Btn-tooltip">{props.tooltip}</span>}
    </button>
  );
};

let renderCount = 0;

export default function App() {
  return (
    <div className="App">
      <p>App render count: {renderCount++}</p>
      <TooltipButton tooltip="Tooltip 1">Button 1</TooltipButton>
      <TooltipButton tooltip="Tooltip 2">Button 2</TooltipButton>
      <TooltipButton tooltip="Tooltip 2">Button 3</TooltipButton>
      <br />
      <br />
      <PubSubTooltipButton tooltip="Tooltip 1">
        PubSub Button 1
      </PubSubTooltipButton>
      <PubSubTooltipButton tooltip="Tooltip 2">
        PubSub Button 2
      </PubSubTooltipButton>
      <PubSubTooltipButton tooltip="Tooltip 2">
        PubSub Button 3
      </PubSubTooltipButton>
    </div>
  );
}
