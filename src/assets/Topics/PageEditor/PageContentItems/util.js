function getSize(size, unit) {
  if (size === 'auto' || !size) {
    return 'auto';
  }

  return `${size}${unit || '%'}`;
}

function getBlockMarginByAlign(textAlign) {
  if (textAlign === 'center') {
    return '0 auto';
  }

  if (textAlign === 'left' || textAlign === 'justify') {
    return '0 auto 0 0';
  }

  if (textAlign === 'right') {
    return '0 0 0 auto';
  }

  return textAlign;
}

export { getSize, getBlockMarginByAlign };
