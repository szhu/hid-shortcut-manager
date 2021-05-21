export default function replaceAscii(key: string) {
  key = key.replace("b", "\x7F"); // "backspace"
  key = key.replace("w", "\uF700"); // "up"
  key = key.replace("s", "\uF701"); // "down"
  key = key.replace("a", "\uF702"); // "left"
  key = key.replace("d", "\uF703"); // "right"
  key = key.replace("r", "\r"); // "return"
  key = key.replace("e", "\x03"); // "enter"
  key = key.replace("f01", "f\uF704"); // function key
  key = key.replace("f02", "f\uF705"); // function key
  key = key.replace("f03", "f\uF706"); // function key
  key = key.replace("f04", "f\uF707"); // function key
  key = key.replace("f05", "f\uF708"); // function key
  key = key.replace("f06", "f\uF709"); // function key
  key = key.replace("f07", "f\uF70A"); // function key
  key = key.replace("f08", "f\uF70B"); // function key
  key = key.replace("f09", "f\uF70C"); // function key
  key = key.replace("f10", "f\uF70D"); // function key
  key = key.replace("f11", "f\uF70E"); // function key
  key = key.replace("f12", "f\uF70F"); // function key
  key = key.replace("f13", "f\uF710"); // function key
  key = key.replace("f14", "f\uF711"); // function key
  key = key.replace("f15", "f\uF712"); // function key
  key = key.replace("f16", "f\uF713"); // function key
  key = key.replace("f17", "f\uF714"); // function key
  key = key.replace("f18", "f\uF715"); // function key
  key = key.replace("f19", "f\uF716"); // function key
  return key;
}
