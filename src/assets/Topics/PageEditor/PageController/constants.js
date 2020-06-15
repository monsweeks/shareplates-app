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
    name: 'INHERIT',
  },
].concat(FONT_FAMILIES);

const PAGE_FONT_FAMILIES = [
  {
    value: 'inherit',
    name: 'INHERIT',
  },
].concat(FONT_FAMILIES);

const ITEM_FONT_FAMILIES = [
  {
    value: 'inherit',
    name: 'INHERIT',
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

const CHAPTER_FONT_SIZES = [
  {
    value: 'inherit',
    name: 'INHERIT',
  },
].concat(FONT_SIZES);

const PAGE_FONT_SIZES = [
  {
    value: 'inherit',
    name: 'INHERIT',
  },
].concat(FONT_SIZES);

const ITEM_FONT_SIZES = [
  {
    value: 'inherit',
    name: 'INHERIT',
  },
].concat(FONT_SIZES);

const PAGE_TRANSFER_ANIMATION = [
  {
    key: 'no',
    value: 'NO ANIMATION',
    desc: '화면 전환 애니메이션을 사용하지 않습니다',
  },
  {
    key: 'sweep',
    value: 'SWEEP',
    desc: '페이지 이동 방향에 따라 페이지가 좌에서 우 또는 우에서 좌로 이동합니다.',
  },
  {
    key: 'fade',
    value: 'FADE',
    desc: '페이지 이동시 현재 화면이 FADE OUT 되고, 새로운 화면이 FADE IN 됩니다',
  },
];

const DEFAULT_TOPIC_CONTENT = {
  topicProperties: {
    fontFamily: TOPIC_FONT_FAMILIES[0].value,
    fontSize: '16px',
    backgroundColor: '#ffffff',
    color: '#333333',
    padding: '0px 0px 0px 0px',
  },
  settings: {
    transferAnimation: 'sweep',
  },
};

const DEFAULT_CHAPTER_CONTENT = {
  chapterProperties: {
    fontFamily: CHAPTER_FONT_FAMILIES[0].value,
    fontSize: CHAPTER_FONT_SIZES[0].value,
    backgroundColor: 'inherit',
    color: 'inherit',
    padding: '',
  },
};

const DEFAULT_PAGE_CONTENT = {
  items: [],
  pageProperties: {
    fontFamily: PAGE_FONT_FAMILIES[0].value,
    fontSize: PAGE_FONT_SIZES[0].value,
    backgroundColor: 'inherit',
    color: 'inherit',
    padding: '',
  },
};

const LIST_STYLES = [
  {
    value: 'none',
    name: '없음',
  },
  {
    value: 'disc',
    name: '●',
  },
  {
    value: 'circle',
    name: '○',
  },
  {
    value: 'square',
    name: '■',
  },
  {
    value: 'decimal',
    name: '1,2,3,..',
  },

  {
    value: 'lower-alpha',
    name: 'a,b,c,..',
  },
  {
    value: 'upper-alpha',
    name: 'A,B,C,..',
  },
  {
    value: 'lower-roman',
    name: 'i,ii,iii,..',
  },
  {
    value: 'upper-roman',
    name: 'I,II,III,..',
  },
];

const TEXT_DECORATION_STYLES = [
  {
    value: 'solid',
    name: '실선',
  },
  {
    value: 'dashed',
    name: '점선',
  },
  {
    value: 'wavy',
    name: '물결',
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
  DEFAULT_TOPIC_CONTENT,
  DEFAULT_CHAPTER_CONTENT,
  DEFAULT_PAGE_CONTENT,
  LIST_STYLES,
  TEXT_DECORATION_STYLES,
};
