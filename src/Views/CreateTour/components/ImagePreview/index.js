//@ts-check
import PropTypes from "prop-types";
import React from "react";

import styles from "./styles.module.scss";

const ImagePreview = (props) => {
  const { image } = props;
  return <img src={image.src} className={styles.image} />;
};

ImagePreview.propTypes = {
  image: PropTypes.shape({
    src: PropTypes.any
  })
}

export default ImagePreview;
