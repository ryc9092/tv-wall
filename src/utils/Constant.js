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
    num: 1,
    decoder: "解碼器1",
    block: "",
  },
  {
    num: 2,
    decoder: "解碼器2",
    block: "",
  },
  {
    num: 3,
    decoder: "解碼器3",
    block: "",
  },
  {
    num: 4,
    decoder: "解碼器4",
    block: "",
  },
  {
    num: 5,
    decoder: "解碼器5",
    block: "",
  },
  {
    num: 6,
    decoder: "解碼器6",
    block: "",
  },
  {
    num: 7,
    decoder: "解碼器7",
    block: "",
  },
  {
    num: 8,
    decoder: "解碼器8",
    block: "",
  },
  {
    num: 9,
    decoder: "解碼器61",
    block: "",
  },
];

const FAKE_SCREEN_LIST2 = [
  {
    num: 1,
    decoder: "解碼器1",
    block: "",
  },
  {
    num: 2,
    decoder: "解碼器2",
    block: "",
  },
  {
    num: 3,
    decoder: "解碼器3",
    block: "",
  },
  {
    num: 4,
    decoder: "解碼器4",
    block: "",
  },
  {
    num: 5,
    decoder: "解碼器5",
    block: "",
  },
  {
    num: 6,
    decoder: "解碼器6",
    block: "",
  },
  {
    num: 7,
    decoder: "解碼器7",
    block: "",
  },
  {
    num: 8,
    decoder: "解碼器8",
    block: "",
  },
  {
    num: 9,
    decoder: "解碼器61",
    block: "",
  },
  {
    num: 10,
    decoder: "解碼器71",
    block: "",
  },
  {
    num: 11,
    decoder: "解碼器81",
    block: "",
  },
  {
    num: 12,
    decoder: "解碼器611",
    block: "",
  },
];

export const FAKE_WALLS = [
  {
    groupId: -1,
    wallName: "會議室1",
    wallId: "area01",
    col: 3,
    row: 3,
    screens: FAKE_SCREEN_LIST1,
  },
  {
    wallId: "fake_wall1",
    wallName: "fake_wall1",
    col: 3,
    row: 3,
    screens: FAKE_SCREEN_LIST1,
  },
  {
    wallId: "fake_wall2",
    wallName: "fake_wall2",
    col: 4,
    row: 3,
    screens: FAKE_SCREEN_LIST2,
  },
];

const FAKE_SCREEN_LIST3 = [
  {
    num: 1,
    block: "1",
  },
  {
    num: 2,
    block: "1",
  },
  {
    num: 3,
    block: "1",
  },
  {
    num: 4,
    block: "2",
  },
  {
    num: 5,
    block: "1",
  },
  {
    num: 6,
    block: "1",
  },
  {
    num: 7,
    block: "1",
  },
  {
    num: 8,
    block: "3",
  },
  {
    num: 9,
    block: "1",
  },
  {
    num: 10,
    block: "1",
  },
  {
    num: 11,
    block: "1",
  },
  {
    num: 12,
    block: "4",
  },
];

const FAKE_SCREEN_LIST4 = [
  {
    num: 1,
    block: "1",
  },
  {
    num: 2,
    block: "1",
  },
  {
    num: 3,
    block: "1",
  },
  {
    num: 4,
    block: "1",
  },
  {
    num: 5,
    block: "1",
  },
  {
    num: 6,
    block: "1",
  },
  {
    num: 7,
    block: "1",
  },
  {
    num: 8,
    block: "1",
  },
  {
    num: 9,
    block: "1",
  },
];

const FAKE_SCREEN_LIST5 = [
  {
    num: 1,
    block: "1",
  },
  {
    num: 2,
    block: "1",
  },
  {
    num: 3,
    block: "5",
  },
  {
    num: 4,
    block: "2",
  },
  {
    num: 5,
    block: "1",
  },
  {
    num: 6,
    block: "1",
  },
  {
    num: 7,
    block: "6",
  },
  {
    num: 8,
    block: "3",
  },
  {
    num: 9,
    block: "1",
  },
  {
    num: 10,
    block: "1",
  },
  {
    num: 11,
    block: "7",
  },
  {
    num: 12,
    block: "4",
  },
];

export const FAKE_TEMPLATES = [
  {
    templateId: "ft1",
    templateName: "fake_template1",
    col: 4,
    row: 3,
    screens: FAKE_SCREEN_LIST5,
    isDefault: false,
  },
  {
    templateId: "ft2",
    templateName: "fake_template2",
    col: 4,
    row: 3,
    screens: FAKE_SCREEN_LIST3,
    isDefault: true,
  },
  {
    templateId: "ft3",
    name: "fake_template3",
    col: 3,
    row: 3,
    screens: FAKE_SCREEN_LIST4,
    isDefault: true,
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
  },
  {
    number: 2,
    decoder: "解碼器2",
  },
  {
    number: 3,
    decoder: "解碼器3",
  },
  {
    number: 4,
    decoder: "解碼器4",
  },
  {
    number: 5,
    decoder: "解碼器5",
  },
  {
    number: 6,
    decoder: "解碼器6",
  },
  {
    number: 7,
    decoder: "解碼器7",
  },
  {
    number: 8,
    decoder: "解碼器8",
  },
  {
    number: 9,
    decoder: "解碼器61",
  },
  {
    number: 10,
    decoder: "解碼器71",
  },
  {
    number: 11,
    decoder: "解碼器81",
  },
  {
    number: 12,
    decoder: "解碼器611",
  },
  {
    number: 13,
    decoder: "解碼器611",
  },
  {
    number: 14,
    decoder: "解碼器611",
  },
  {
    number: 15,
    decoder: "解碼器611",
  },
  {
    number: 16,
    decoder: "解碼器611",
  },
  {
    number: 17,
    decoder: "解碼器611",
  },
  {
    number: 18,
    decoder: "解碼器611",
  },
  {
    number: 19,
    decoder: "解碼器611",
  },
  {
    number: 20,
    decoder: "解碼器611",
  },
  {
    number: 21,
    decoder: "解碼器611",
  },
  {
    number: 22,
    decoder: "解碼器611",
  },
  {
    number: 23,
    decoder: "解碼器611",
  },
  {
    number: 24,
    decoder: "解碼器611",
  },
  {
    number: 25,
    decoder: "解碼器611",
  },
  {
    number: 26,
    decoder: "解碼器611",
  },
  {
    number: 27,
    decoder: "解碼器611",
  },
  {
    number: 28,
    decoder: "解碼器611",
  },
  {
    number: 29,
    decoder: "解碼器611",
  },
  {
    number: 30,
    decoder: "解碼器611",
  },
  {
    number: 31,
    decoder: "解碼器611",
  },
  {
    number: 32,
    decoder: "解碼器611",
  },
];

// wall size: col: 3, row: 3
export const fakewall2 = [
  {
    number: 1,
    decoder: "解碼器611",
  },
  {
    number: 2,
    decoder: "解碼器611",
  },
  {
    number: 3,
    decoder: "解碼器611",
  },
  {
    number: 4,
    decoder: "解碼器611",
  },
  {
    number: 5,
    decoder: "解碼器611",
  },
  {
    number: 6,
    decoder: "解碼器611",
  },
  {
    number: 7,
    decoder: "解碼器611",
  },
  {
    number: 8,
    decoder: "解碼器611",
  },
  {
    number: 9,
    decoder: "解碼器611",
  },
];

// wall size: col: 4, row: 3
export const fakewall3 = [
  {
    number: 1,
    decoder: "解碼器1",
  },
  {
    number: 2,
    decoder: "解碼器2",
  },
  {
    number: 3,
    decoder: "解碼器3",
  },
  {
    number: 4,
    decoder: "解碼器4",
  },
  {
    number: 5,
    decoder: "解碼器5",
  },
  {
    number: 6,
    decoder: "解碼器6",
  },
  {
    number: 7,
    decoder: "解碼器7",
  },
  {
    number: 8,
    decoder: "解碼器8",
  },
  {
    number: 9,
    decoder: "解碼器61",
  },
  {
    number: 10,
    decoder: "解碼器71",
  },
  {
    number: 11,
    decoder: "解碼器81",
  },
  {
    number: 12,
    decoder: "解碼器611",
  },
];

// wall size: col: 4, row: 5
export const fakewall4 = [
  {
    number: 1,
    decoder: "解碼器1",
  },
  {
    number: 2,
    decoder: "解碼器2",
  },
  {
    number: 3,
    decoder: "解碼器3",
  },
  {
    number: 4,
    decoder: "解碼器4",
  },
  {
    number: 5,
    decoder: "解碼器5",
  },
  {
    number: 6,
    decoder: "解碼器6",
  },
  {
    number: 7,
    decoder: "解碼器7",
  },
  {
    number: 8,
    decoder: "解碼器8",
  },
  {
    number: 9,
    decoder: "解碼器61",
  },
  {
    number: 10,
    decoder: "解碼器71",
  },
  {
    number: 11,
    decoder: "解碼器81",
  },
  {
    number: 12,
    decoder: "解碼器611",
  },
  {
    number: 13,
    decoder: "解碼器611",
  },
  {
    number: 14,
    decoder: "解碼器611",
  },
  {
    number: 15,
    decoder: "解碼器611",
  },
  {
    number: 16,
    decoder: "解碼器611",
  },
  {
    number: 17,
    decoder: "解碼器611",
  },
  {
    number: 18,
    decoder: "解碼器611",
  },
  {
    number: 19,
    decoder: "解碼器611",
  },
  {
    number: 20,
    decoder: "解碼器611",
  },
];
