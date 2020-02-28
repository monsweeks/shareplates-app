function setItem(pageKey, configKey, value) {
  if (localStorage) {
    const configString = localStorage.getItem('config');
    let config;
    if (configString) {
      config = JSON.parse(configString);
      if (!config[pageKey]) {
        config[pageKey] = {};
      }
    } else {
      config = {};
      config[pageKey] = {};
    }

    config[pageKey][configKey] = value;
    localStorage.setItem('config', JSON.stringify(config));
  }
}

function getItem(pageKey, configKey) {
  if (localStorage) {
    const configString = localStorage.getItem('config');
    if (!configString) {
      return null;
    }

    try {
      const config = JSON.parse(configString);
      if (config[pageKey] && String(config[pageKey][configKey]).length > 0) {
        return config[pageKey][configKey];
      }
    } catch {
      // ignore
    }
  }

  return null;
}

const storage = {
  setItem,
  getItem,
};

export default storage;
