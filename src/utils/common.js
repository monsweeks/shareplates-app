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

const common = {
  getOptions,
  setOptions,
};

export default common;
