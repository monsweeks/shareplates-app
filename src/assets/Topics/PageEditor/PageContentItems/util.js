function getSize(size, unit) {
  if (size === 'auto' || !size) {
    return 'auto';
  }

  return `${size}${unit || '%'}`;
}

const temp = 1;

export { getSize, temp };
