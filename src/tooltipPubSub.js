import React, { useEffect, useRef, useState } from "react";

const createPubSubFactory = () => {
  let subscribers = [];
  return {
    emit(id) {
      subscribers.forEach(callback => {
        callback(id);
      });
    },
    subscribe(callback) {
      subscribers.push(callback);
    }
  };
};

class PubSubClass {
  subscribers = [];

  emit = id => {
    this.subscribers.forEach(callback => {
      callback(id);
    });
  };
  subscribe = callback => {
    this.subscribers.push(callback);
  };
}

// tooltip.js
const pubsub = createPubSubFactory();
let runningId = 0;

const TooltipButton = props => {
  const [showTooltip, setShowTooltip] = useState(false);
  const id = useRef(runningId++);
  const timer = useRef();
  // const hideTimer = useRef();

  useEffect(() => {
    pubsub.subscribe(activeId => {
      if (activeId !== id) {
        clearTimeout(timer.current);
        setShowTooltip(false);
      }
    });
  }, []);

  const clearTimer = () => {
    clearTimeout(timer.current);
    timer.current = null;
  };

  const revealTooltip = () => {
    clearTimer();

    timer.current = setTimeout(() => {
      setShowTooltip(true);
    }, 100);

    pubsub.emit(id);
  };

  const hideTooltip = () => {
    clearTimer();
    // No need to kick off this timer if nothing is showing.
    if (!showTooltip) {
      return;
    }
    timer.current = setTimeout(() => {
      setShowTooltip(false);
    }, 300);
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

export default TooltipButton;
