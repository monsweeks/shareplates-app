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

const PAGE_TRANSFER_ANIMATION = [
  {
    key: 'no',
    value: 'NO ANIMATION',
    desc : '화면 전환 애니메이션을 사용하지 않습니다',
  },
  {
    key: 'sweep',
    value: 'SWEEP',
    desc : '페이지 이동 방향에 따라 페이지가 좌에서 우 또는 우에서 좌로 이동합니다.',
  },
  {
    key: 'fade',
    value: 'FADE',
    desc : '페이지 이동시 현재 화면이 FADE OUT 되고, 새로운 화면이 FADE IN 됩니다',
  },
];

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
  PAGE_TRANSFER_ANIMATION,
};
