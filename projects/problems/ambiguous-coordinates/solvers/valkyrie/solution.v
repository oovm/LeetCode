namespace leetcode.ambiguous_coordinates;

using std.collection;

micro slice(text: utf8, start: usize, stop: usize) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(stop - start)
    let mut index: usize = start
    while index < stop {
        builder.append(char::from(text.byte_at(index) as u32))
        index = index + 1
    }
    return builder.build()
}

# 枚举小数点位置：整数部分不能有前导零（单个 `0` 除外），小数部分不能以零结尾。
micro pieces(text: utf8, start: usize, stop: usize, out: ArrayList<utf8>) -> unit {
    let span: usize = stop - start
    let mut cut: usize = 1
    while cut <= span {
        let left: utf8 = slice(text, start, start + cut)
        let right: utf8 = slice(text, start + cut, stop)
        let left_ok: bool = left.byte_length() == 1 || left.byte_at(0) != 48
        let right_ok: bool = right.byte_length() == 0 || right.byte_at(right.byte_length() - 1) != 48
        if left_ok && right_ok {
            let mut builder: Utf8Builder = Utf8Builder::new(span + 1)
            builder.append(left)
            if cut < span {
                builder.append(char::from(46))
            }
            builder.append(right)
            out.push(builder.build())
        }
        cut = cut + 1
    }
}

[export(case: "camelCase")]
micro ambiguous_coordinates(s: utf8) -> ArrayList<utf8> {
    let length: usize = s.byte_length()
    let mut out: ArrayList<utf8> = ArrayList::new(0)
    let mut split: usize = 2
    while split <= length - 2 {
        let mut lefts: ArrayList<utf8> = ArrayList::new(0)
        pieces(s, 1, split, lefts)
        let mut rights: ArrayList<utf8> = ArrayList::new(0)
        pieces(s, split, length - 1, rights)
        let mut a: usize = 0
        while a < lefts.length() {
            let mut b: usize = 0
            while b < rights.length() {
                let mut builder: Utf8Builder = Utf8Builder::new(64)
                builder.append(char::from(40))
                builder.append(lefts⁅a⁆)
                builder.append(char::from(44))
                builder.append(char::from(32))
                builder.append(rights⁅b⁆)
                builder.append(char::from(41))
                out.push(builder.build())
                b = b + 1
            }
            a = a + 1
        }
        split = split + 1
    }
    return out
}

class Solution {
    micro ambiguousCoordinates(self, s: utf8): ArrayList<utf8> {
        return ambiguous_coordinates(s)
    }
}
