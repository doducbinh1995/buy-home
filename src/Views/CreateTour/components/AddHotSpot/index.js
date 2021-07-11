//@ts-check
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import IconMarker from "../../../../assets/icons/ic-gps.svg";
import styles from "./styles.module.scss";
import Hammer from "hammerjs";

const AddHotSpot = (props) => {
  const { onChangePosition } = props;
  const iconRef = useRef();
  const containerRef = useRef();
  useEffect(() => {
    let lastPosX = 0;
    let lastPosY = 0;
    let isDragging = false;
    const handleDrag = function (ev) {
      // for convience, let's get a reference to our object
      const elem = ev.target;

      // DRAG STARTED
      // here, let's snag the current position
      // and keep track of the fact that we're dragging
      if (!isDragging) {
        isDragging = true;
        lastPosX = elem.offsetLeft;
        lastPosY = elem.offsetTop;
      }

      // we simply need to determine where the x,y of this
      // object is relative to where it's "last" known position is
      // NOTE:
      //    deltaX and deltaY are cumulative
      // Thus we need to always calculate 'real x and y' relative
      // to the "lastPosX/Y"
      const posX = ev.deltaX + lastPosX;
      const posY = ev.deltaY + lastPosY;

      // move our element to that position
      elem.style.left = posX + "px";
      elem.style.top = posY + "px";

      onChangePosition({
        offsetTop: elem.offsetTop,
        offsetLeft: elem.offsetLeft,
        containerWidth: containerRef.current.offsetWidth,
        containerHeight: containerRef.current.offsetHeight,
      });

      // DRAG ENDED
      // this is where we simply forget we are dragging
      if (ev.isFinal) {
        isDragging = false;
      }
    };
    const dragObject = new Hammer(iconRef.current);
    dragObject.add(
      new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 })
    );
    dragObject.on("pan", handleDrag);
    onChangePosition({
      offsetTop: iconRef.current.offsetTop,
      offsetLeft: iconRef.current.offsetLeft,
      containerWidth: containerRef.current.offsetWidth,
      containerHeight: containerRef.current.offsetHeight,
    });
  }, []);
  return (
    <div className="position-absolute w-100 h-100" style={{ top: 0 }}>
      <div className="position-relative w-100 h-100 overflow-hidden" ref={containerRef}>
        <img src={IconMarker} className={styles.hotspot} ref={iconRef} />
      </div>
    </div>
  );
};

AddHotSpot.propTypes = {
  onChangePosition: PropTypes.any,
};

export default AddHotSpot;
