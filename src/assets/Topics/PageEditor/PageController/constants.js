const FONT_FAMILIES = [
  {
    value: 'LGSmHaL',
    name: 'LG스마트체(L)',
  },
  {
    value: 'LGSmHaR',
    name: 'LG스마트체(R)',
  },
  {
    value: 'LGSmHaB',
    name: 'LG스마트체(B)',
  },
  {
    value: 'NanumGothic',
    name: '나눔고딕',
  },
  {
    value: 'NanumGothicCoding',
    name: '나눔고딕코딩',
  },
  {
    value: 'Righteous',
    name: 'Righteous',
  },
  {
    value: 'Baloo Bhai',
    name: 'Baloo Bhai',
  },
  {
    value: 'Baloo Bhaina',
    name: 'Baloo Bhaina',
  },
  {
    value: 'Comfortaa',
    name: 'Comfortaa',
  },
];

const TOPIC_FONT_FAMILIES = JSON.parse(JSON.stringify(FONT_FAMILIES));

const CHAPTER_FONT_FAMILIES = [
  {
    value: 'inherit',
    name: '토픽 폰트',
  },
].concat(FONT_FAMILIES);

const PAGE_FONT_FAMILIES = [
  {
    value: 'inherit',
    name: '챕터 폰트',
  },
].concat(FONT_FAMILIES);

const ITEM_FONT_FAMILIES = [
  {
    value: 'inherit',
    name: '페이지 폰트',
  },
].concat(FONT_FAMILIES);

const FONT_SIZES = [];
for (let i = 8; i <= 24; i += 1) {
  FONT_SIZES.push({
    value: `${i}px`,
    name: `${i}px`,
  });
}
for (let i = 26; i <= 60; i += 2) {
  FONT_SIZES.push({
    value: `${i}px`,
    name: `${i}px`,
  });
}

const BORDER_WIDTHS = [];
for (let i = 0; i <= 20; i += 1) {
  BORDER_WIDTHS.push({
    value: `${i}px`,
    name: `${i}px`,
  });
}

const TOPIC_FONT_SIZES = JSON.parse(JSON.stringify(FONT_SIZES));

const CHAPTER_FONT_SIZES = [{
  value: 'inherit',
  name: '토픽 폰트 크기',
}].concat(FONT_SIZES);

const PAGE_FONT_SIZES = [{
  value: 'inherit',
  name: '챕터 폰트 크기',
}].concat(FONT_SIZES);

const ITEM_FONT_SIZES = [{
  value: 'inherit',
  name: '페이지 폰트 크기',
}].concat(FONT_SIZES);

export {
  TOPIC_FONT_FAMILIES,
  CHAPTER_FONT_FAMILIES,
  PAGE_FONT_FAMILIES,
  ITEM_FONT_FAMILIES,
  TOPIC_FONT_SIZES,
  CHAPTER_FONT_SIZES,
  PAGE_FONT_SIZES,
  ITEM_FONT_SIZES,
  BORDER_WIDTHS,
};
