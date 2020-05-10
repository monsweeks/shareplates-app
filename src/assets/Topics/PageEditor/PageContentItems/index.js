import Text from './Text/Text';
import Temp from './Temp/Temp';
import Image from './Image/Image';

const list = [Text, Image, Temp];

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

export { Temp, Text, Image, getSetting, getItem };
