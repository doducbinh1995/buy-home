//@ts-check
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { Viewer } from "photo-sphere-viewer";
import MarkersPlugin from "photo-sphere-viewer/dist/plugins/markers";
import "photo-sphere-viewer/dist/plugins/markers.css";

const PanaromaView = (props) => {
  const { image } = props;
  const panoramaContainer = useRef();

  useEffect(() => {
    if (panoramaContainer.current) {
      const viewer = new Viewer({
        container: panoramaContainer.current,
        panorama: image.src,
        plugins: [
          [
            MarkersPlugin,
            {
              markers: image.hotspots,
            },
          ],
        ],
      });
    }
  }, [panoramaContainer.current]);
  return <div className="w-100 h-100" ref={panoramaContainer}></div>;
};

PanaromaView.propTypes = {
  image: PropTypes.shape({
    hotspots: PropTypes.any,
    src: PropTypes.any
  })
}

export default PanaromaView;
