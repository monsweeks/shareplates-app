import qs from 'qs';

function getMergedPageProperties(topicProperties, chapterProperties, pageProperties) {
  const properties = { ...topicProperties };

  if (chapterProperties) {
    Object.keys(chapterProperties).forEach((key) => {
      if (chapterProperties[key] && chapterProperties[key] !== 'inherit' && chapterProperties[key] !== 'transparent') {
        properties[key] = chapterProperties[key];
      }
    });
  }

  if (pageProperties) {
    Object.keys(pageProperties).forEach((key) => {
      if (pageProperties[key] && pageProperties[key] !== 'inherit' && pageProperties[key] !== 'transparent') {
        properties[key] = pageProperties[key];
      }
    });
  }

  return properties;
}

function re(search, keys) {
  const options = {};
  const searchObject = qs.parse(search, { ignoreQueryPrefix: true });
  keys.forEach((key) => {
    if (searchObject[key] !== undefined) {
      options[key] = searchObject[key];
    }
  });
  return options;
}

const contentUtil = {
  getMergedPageProperties,
  re,
};

export default contentUtil;
