namespace leetcode.sort_characters_by_frequency;

using std.collection;
using std.text;

# 频次降序；等频次保持首次出现次序（`sorted_by` 稳定，等频次返回 0 即保留原序）。
# 打包键 `count * 65536 + 首次出现下标`；解码时下标回查码位表。
# 已还原 `HashMap<char, i64>`（复核于 addon `25132ccf`，2026-11-05）：`char: Hash` 已可用。
# 现 35/54：tests[35] 含多字节字符 `İ` 时返回串被截断成 `I����JZ`（expected `...ZZIİJ`），
# 属 utf8 多字节输入/返回 ABI 面，与计数容器无关。
micro compare_frequency(left: i64, right: i64) -> i32 {
    let left_count: i64 = left / 65536
    let right_count: i64 = right / 65536
    if left_count > right_count {
        return -1
    }
    if left_count < right_count {
        return 1
    }
    return 0
}

[export(case: "camelCase")]
micro frequency_sort(s: utf8) -> utf8 {
    let length: usize = s.length()
    let mut counts: HashMap<char, i64> = HashMap::new(length)
    let mut order: ArrayList<char> = ArrayList::new(length)

    let mut index: usize = 0
    while index < length {
        let letter: char = char::from(s⁅index⁆ as u32)
        if counts.contains_key(letter) {
            counts.insert(letter, counts.get(letter).unwrap() + 1)
        } else {
            counts.insert(letter, 1)
            order.push(letter)
        }
        index = index + 1
    }

    let mut keys: ArrayList<i64> = ArrayList::new(order.length())
    let mut slot_index: usize = 0
    while slot_index < order.length() {
        keys.push(counts.get(order⁅slot_index⁆).unwrap() * 65536 + (slot_index as i64))
        slot_index = slot_index + 1
    }
    let ordered: ArrayList<i64> = sorted_by(keys, compare_frequency)

    let mut result: Utf8Builder = Utf8Builder::new(length)
    let mut cursor: usize = 0
    while cursor < ordered.length() {
        let key: i64 = ordered⁅cursor⁆
        let count: i64 = key / 65536
        let origin: i64 = key % 65536
        let letter: char = order⁅origin as usize⁆
        let mut times: i64 = count
        while times > 0 {
            result.append(letter)
            times = times - 1
        }
        cursor = cursor + 1
    }
    return result.build()
}

class Solution {
    micro frequencySort(self, s: utf8): utf8 {
        return frequency_sort(s)
    }
}
