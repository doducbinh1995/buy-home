//@ts-check
import PropTypes from "prop-types";
import React from "react";

import styles from "./styles.module.scss";

const ImagePreview = (props) => {
  const { image, onClick, isActive } = props;
  return (
    <img
      src={image.src}
      className={`mr-3 ${styles.image} ${isActive && styles.active}`}
      onClick={onClick}
    />
  );
};

ImagePreview.propTypes = {
  image: PropTypes.shape({
    src: PropTypes.any
  }),
  isActive: PropTypes.any,
  onClick: PropTypes.any
}

export default ImagePreview;
