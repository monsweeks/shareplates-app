import Text from './Text/Text';
import Temp from './Temp/Temp';

const list = [Text, Temp];

function getSetting(name) {
  const item = list.find((d) => d.name === name);
  if (item) {
    return item.setting;
  }

  return {};
}

function getItem(name) {
  return list.find((d) => d.name === name);
}

export { Temp, Text, getSetting, getItem };
