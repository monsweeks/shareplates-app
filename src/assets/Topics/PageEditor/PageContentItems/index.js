import Text from './Text/Text';
import Temp from './Temp/Temp';
import Image from './Image/Image';
import Table from './Table/Table';

const list = [Text, Image, Temp, Table];

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

export { Temp, Text, Image, Table, getSetting, getItem };
