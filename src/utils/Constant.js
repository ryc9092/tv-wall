export const ENCODER_TYPERS = [
  {
    label: "ZyperUHD60",
    value: "1",
  },
  {
    label: "Zyper4k",
    value: "2",
    disabled: true,
  },
  {
    label: "Zyper4k-XS",
    value: "3",
    disabled: true,
  },
  {
    label: "Zyper4k-XR",
    value: "4",
    disabled: true,
  },
];

export const FAKE_ENCODERS = [
  "編碼器1",
  "編碼器2",
  "編碼器3",
  "編碼器4",
  "編碼器5",
  "編碼器6",
  "編碼器7",
  "編碼器8",
  "編碼器61",
  "編碼器71",
  "編碼器81",
  "編碼器22",
  "編碼器32",
  "編碼器42",
  "編碼器52",
  "編碼器62",
  "編碼器72",
  "編碼器82",
  "編碼器612",
  "編碼器712",
  "編碼器812",
  "編碼器8124",
  "編碼器23",
  "編碼器33",
  "編碼器43",
  "編碼器53",
  "編碼器63",
  "編碼器73",
  "編碼器83",
  "編碼器613",
  "編碼器713",
  "編碼器813",
];

export const FAKE_DECODERS = [
  "解碼器1",
  "解碼器2",
  "解碼器3",
  "解碼器4",
  "解碼器5",
  "解碼器6",
  "解碼器7",
  "解碼器8",
  "解碼器61",
  "解碼器71",
  "解碼器81",
  "解碼器22",
  "解碼器32",
  "解碼器42",
  "解碼器52",
  "解碼器62",
  "解碼器72",
  "解碼器82",
  "解碼器612",
  "解碼器712",
  "解碼器812",
  "解碼器8124",
  "解碼器23",
  "解碼器33",
  "解碼器43",
  "解碼器53",
  "解碼器63",
  "解碼器73",
  "解碼器83",
  "解碼器613",
  "解碼器713",
  "解碼器813",
];

const FAKE_SCREEN_LIST1 = [
  {
    number: 1,
    decoder: "解碼器1",
    block: "",
  },
  {
    number: 2,
    decoder: "解碼器2",
    block: "",
  },
  {
    number: 3,
    decoder: "解碼器3",
    block: "",
  },
  {
    number: 4,
    decoder: "解碼器4",
    block: "",
  },
  {
    number: 5,
    decoder: "解碼器5",
    block: "",
  },
  {
    number: 6,
    decoder: "解碼器6",
    block: "",
  },
  {
    number: 7,
    decoder: "解碼器7",
    block: "",
  },
  {
    number: 8,
    decoder: "解碼器8",
    block: "",
  },
  {
    number: 9,
    decoder: "解碼器61",
    block: "",
  },
];

const FAKE_SCREEN_LIST2 = [
  {
    number: 1,
    decoder: "解碼器1",
    block: "",
  },
  {
    number: 2,
    decoder: "解碼器2",
    block: "",
  },
  {
    number: 3,
    decoder: "解碼器3",
    block: "",
  },
  {
    number: 4,
    decoder: "解碼器4",
    block: "",
  },
  {
    number: 5,
    decoder: "解碼器5",
    block: "",
  },
  {
    number: 6,
    decoder: "解碼器6",
    block: "",
  },
  {
    number: 7,
    decoder: "解碼器7",
    block: "",
  },
  {
    number: 8,
    decoder: "解碼器8",
    block: "",
  },
  {
    number: 9,
    decoder: "解碼器61",
    block: "",
  },
  {
    number: 10,
    decoder: "解碼器71",
    block: "",
  },
  {
    number: 11,
    decoder: "解碼器81",
    block: "",
  },
  {
    number: 12,
    decoder: "解碼器611",
    block: "",
  },
];

export const FAKE_WALLS = [
  {
    key: "fake_wall1",
    name: "fake_wall1",
    dimension: { col: 3, row: 3 },
    screens: FAKE_SCREEN_LIST1,
  },
  {
    key: "fake_wall2",
    name: "fake_wall2",
    dimension: { col: 4, row: 3 },
    screens: FAKE_SCREEN_LIST2,
  },
];

export const FAKE_TEMPLATES = [
  {
    key: "fake_template1",
    name: "fake_template1",
    dimension: { col: 3, row: 3 },
    screens: FAKE_SCREEN_LIST1,
  },
  {
    key: "fake_template2",
    name: "fake_template2",
    dimension: { col: 3, row: 3 },
    screens: FAKE_SCREEN_LIST1,
  },
];

export const screenColorList = [
  "#FF7979",
  "#FFBC79",
  "#FFFF79",
  "#A8FF79",
  "#79FFE7",
  "#7983FF",
  "#CC79FF",
];

export const blockColorList = [
  "#FF7979",
  "#FFBC79",
  "#FFFF79",
  "#A8FF79",
  "#79FFE7",
  "#7983FF",
  "#CC79FF",
];

// wall size: col: 4, row: 8
export const fakewall1 = [
  {
    number: 1,
    decoder: "解碼器1",
    block: 1,
  },
  {
    number: 2,
    decoder: "解碼器2",
    block: 1,
  },
  {
    number: 3,
    decoder: "解碼器3",
    block: 1,
  },
  {
    number: 4,
    decoder: "解碼器4",
    block: 2,
  },
  {
    number: 5,
    decoder: "解碼器5",
    block: 1,
  },
  {
    number: 6,
    decoder: "解碼器6",
    block: 1,
  },
  {
    number: 7,
    decoder: "解碼器7",
    block: 1,
  },
  {
    number: 8,
    decoder: "解碼器8",
    block: 3,
  },
  {
    number: 9,
    decoder: "解碼器61",
    block: 1,
  },
  {
    number: 10,
    decoder: "解碼器71",
    block: 1,
  },
  {
    number: 11,
    decoder: "解碼器81",
    block: 1,
  },
  {
    number: 12,
    decoder: "解碼器611",
    block: 4,
  },
  {
    number: 13,
    decoder: "解碼器611",
    block: 5,
  },
  {
    number: 14,
    decoder: "解碼器611",
    block: 5,
  },
  {
    number: 15,
    decoder: "解碼器611",
    block: 6,
  },
  {
    number: 16,
    decoder: "解碼器611",
    block: 7,
  },
  {
    number: 17,
    decoder: "解碼器611",
    block: 5,
  },
  {
    number: 18,
    decoder: "解碼器611",
    block: 5,
  },
  {
    number: 19,
    decoder: "解碼器611",
    block: 8,
  },
  {
    number: 20,
    decoder: "解碼器611",
    block: 9,
  },
  {
    number: 21,
    decoder: "解碼器611",
    block: 10,
  },
  {
    number: 22,
    decoder: "解碼器611",
    block: 11,
  },
  {
    number: 23,
    decoder: "解碼器611",
    block: 11,
  },
  {
    number: 24,
    decoder: "解碼器611",
    block: 11,
  },
  {
    number: 25,
    decoder: "解碼器611",
    block: 12,
  },
  {
    number: 26,
    decoder: "解碼器611",
    block: 11,
  },
  {
    number: 27,
    decoder: "解碼器611",
    block: 11,
  },
  {
    number: 28,
    decoder: "解碼器611",
    block: 11,
  },
  {
    number: 29,
    decoder: "解碼器611",
    block: 13,
  },
  {
    number: 30,
    decoder: "解碼器611",
    block: 11,
  },
  {
    number: 31,
    decoder: "解碼器611",
    block: 11,
  },
  {
    number: 32,
    decoder: "解碼器611",
    block: 11,
  },
];

// wall size: col: 3, row: 3
export const fakewall2 = [
  {
    number: 1,
    decoder: "解碼器611",
    block: 1,
  },
  {
    number: 2,
    decoder: "解碼器611",
    block: 2,
  },
  {
    number: 3,
    decoder: "解碼器611",
    block: 2,
  },
  {
    number: 4,
    decoder: "解碼器611",
    block: 3,
  },
  {
    number: 5,
    decoder: "解碼器611",
    block: 2,
  },
  {
    number: 6,
    decoder: "解碼器611",
    block: 2,
  },
  {
    number: 7,
    decoder: "解碼器611",
    block: 4,
  },
  {
    number: 8,
    decoder: "解碼器611",
    block: 2,
  },
  {
    number: 9,
    decoder: "解碼器611",
    block: 2,
  },
];

// wall size: col: 4, row: 3
export const fakewall3 = [
  {
    number: 1,
    decoder: "解碼器1",
    block: 1,
  },
  {
    number: 2,
    decoder: "解碼器2",
    block: 1,
  },
  {
    number: 3,
    decoder: "解碼器3",
    block: 1,
  },
  {
    number: 4,
    decoder: "解碼器4",
    block: 2,
  },
  {
    number: 5,
    decoder: "解碼器5",
    block: 1,
  },
  {
    number: 6,
    decoder: "解碼器6",
    block: 1,
  },
  {
    number: 7,
    decoder: "解碼器7",
    block: 1,
  },
  {
    number: 8,
    decoder: "解碼器8",
    block: 3,
  },
  {
    number: 9,
    decoder: "解碼器61",
    block: 1,
  },
  {
    number: 10,
    decoder: "解碼器71",
    block: 1,
  },
  {
    number: 11,
    decoder: "解碼器81",
    block: 1,
  },
  {
    number: 12,
    decoder: "解碼器611",
    block: 4,
  },
];

// wall size: col: 4, row: 5
export const fakewall4 = [
  {
    number: 1,
    decoder: "解碼器1",
    block: 1,
  },
  {
    number: 2,
    decoder: "解碼器2",
    block: 1,
  },
  {
    number: 3,
    decoder: "解碼器3",
    block: 1,
  },
  {
    number: 4,
    decoder: "解碼器4",
    block: 2,
  },
  {
    number: 5,
    decoder: "解碼器5",
    block: 1,
  },
  {
    number: 6,
    decoder: "解碼器6",
    block: 1,
  },
  {
    number: 7,
    decoder: "解碼器7",
    block: 1,
  },
  {
    number: 8,
    decoder: "解碼器8",
    block: 3,
  },
  {
    number: 9,
    decoder: "解碼器61",
    block: 1,
  },
  {
    number: 10,
    decoder: "解碼器71",
    block: 1,
  },
  {
    number: 11,
    decoder: "解碼器81",
    block: 1,
  },
  {
    number: 12,
    decoder: "解碼器611",
    block: 4,
  },
  {
    number: 13,
    decoder: "解碼器611",
    block: 5,
  },
  {
    number: 14,
    decoder: "解碼器611",
    block: 5,
  },
  {
    number: 15,
    decoder: "解碼器611",
    block: 6,
  },
  {
    number: 16,
    decoder: "解碼器611",
    block: 7,
  },
  {
    number: 17,
    decoder: "解碼器611",
    block: 5,
  },
  {
    number: 18,
    decoder: "解碼器611",
    block: 5,
  },
  {
    number: 19,
    decoder: "解碼器611",
    block: 8,
  },
  {
    number: 20,
    decoder: "解碼器611",
    block: 9,
  },
];
