const FONT_FAMILIES = [
  {
    value: 'inherit',
    name: '페이지 폰트',
  },
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

const FONT_SIZES = [
  {
    value: 'inherit',
    name: '페이지 폰트 크기',
  },
];
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

export { FONT_FAMILIES, FONT_SIZES, BORDER_WIDTHS };
