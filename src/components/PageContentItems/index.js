import Text from './Text/Text';
import Temp from './Temp/Temp';

const list = [Text, Temp];

function getSetting(name) {
  const item = list.find((d) => d.itemName === name);
  if (item) {
    return JSON.parse(JSON.stringify(item.setting));
  }

  return {};
}

function getItem(name) {
  return list.find((d) => d.itemName === name);
}

export { Temp, Text, getSetting, getItem };
