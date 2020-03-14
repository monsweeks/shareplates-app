import qs from 'qs';

function getOptions(search, keys) {
  const options = {};
  const searchObject = qs.parse(search, { ignoreQueryPrefix: true });
  keys.forEach((key) => {
    if (searchObject[key]) {
      options[key] = searchObject[key];
    }
  });
  return options;
}

function setOptions(history, pathname, options) {
  history.push({
    pathname,
    search: qs.stringify(options, { addQueryPrefix: true }),
  });
}

const common = {
  getOptions,
  setOptions,
};

export default common;
