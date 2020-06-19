import qs from 'qs';

function getOptions(search, keys) {
  const options = {};
  const searchObject = qs.parse(search, { ignoreQueryPrefix: true });
  keys.forEach((key) => {
    if (searchObject[key] !== undefined) {
      options[key] = searchObject[key];
    }
  });
  return options;
}

function setOptions(history, pathname, options, isPush) {
  if (isPush) {
    history.push({
      pathname,
      search: qs.stringify(options, { addQueryPrefix: true }),
    });
  } else {
    history.replace({
      pathname,
      search: qs.stringify(options, { addQueryPrefix: true }),
    });
  }
}

function getFileType (file) {
  if (!/^image\//.test(file.type)) {
    return 'image';
  }
  if (!/^video\//.test(file.type)) {
    return 'video';
  }
  return 'file';
};

const common = {
  getOptions,
  setOptions,
  getFileType,
};

export default common;
