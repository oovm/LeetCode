namespace leetcode.sort_characters_by_frequency;

using std.collection;

# 频次降序；等频次保持首次出现次序（`sorted_by` 稳定，等频次返回 0 即保留原序）。
# 打包键 `count * 65536 + 首次出现下标`；解码时下标回查码位表。
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
    let mut codes: ArrayList<i64> = ArrayList::new(length)
    let mut counts: ArrayList<i64> = ArrayList::new(length)

    # `HashMap<utf8, _>` 在本批 addon 上仍不可编译（`std::hash` 合同实例未进依赖导入），
    # 因此用「码位表 + 计数表」的线性查找；真写法是 `HashMap<char, i64>`。
    let mut index: usize = 0
    while index < length {
        let code: i64 = s⁅index⁆ as u32 as i64
        let mut slot: usize = 0
        let mut found: bool = false
        while slot < codes.length() {
            if codes⁅slot⁆ == code {
                counts⁅slot⁆ = counts⁅slot⁆ + 1
                found = true
            }
            slot = slot + 1
        }
        if !found {
            codes.push(code)
            counts.push(1)
        }
        index = index + 1
    }

    let mut keys: ArrayList<i64> = ArrayList::new(codes.length())
    let mut slot_index: usize = 0
    while slot_index < codes.length() {
        keys.push(counts⁅slot_index⁆ * 65536 + (slot_index as i64))
        slot_index = slot_index + 1
    }
    let ordered: ArrayList<i64> = sorted_by(keys, compare_frequency)

    let mut result: Utf8Builder = Utf8Builder::new(length)
    let mut cursor: usize = 0
    while cursor < ordered.length() {
        let key: i64 = ordered⁅cursor⁆
        let count: i64 = key / 65536
        let origin: i64 = key % 65536
        let code: i64 = codes⁅origin as usize⁆
        let mut times: i64 = count
        while times > 0 {
            result.append(char::from(code as u32))
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
