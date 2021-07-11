import React from "react";
import PropTypes from "prop-types";

const IF = (props) => {
  const { condition, children } = props;
  if (!condition) return null;
  return children;
};

IF.propTypes = {
  condition: PropTypes.any,
  children: PropTypes.any,
};

export default IF;
