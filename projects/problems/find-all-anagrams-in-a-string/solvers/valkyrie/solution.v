namespace leetcode.find_all_anagrams_in_a_string;

using std.collection;

# 定长滑窗：`need` 记录 p 的逐字节需求，`window` 记录窗口内计数，
# `matched` 记录「窗口计数恰好等于需求」的键数，达到需求键数即命中。
# 题内触发点: G13 —— `utf8` 没有码点视图，只能 `byte_length` / `byte_at` 走字节。
# 题内触发点: `HashMap` 删除面 —— 窗口计数归零时 `remove(k)`，其 `Option<V>` 返回值显式承接。
[export(case: "camelCase")]
micro find_anagrams(s: utf8, p: utf8) -> [i64] {
    let total: usize = s.byte_length()
    let window_size: usize = p.byte_length()
    let mut result: ArrayList<i64> = ArrayList::new(total)
    if window_size == 0 || window_size > total {
        return result.to_array()
    }

    let mut need: HashMap<u32, i64> = HashMap::new(window_size)
    let mut index: usize = 0
    while index < window_size {
        let key: u32 = p.byte_at(index) as u32
        if need.contains_key(key) {
            need.insert(key, need.get(key).unwrap() + 1)
        } else {
            need.insert(key, 1)
        }
        index = index + 1
    }
    let distinct: usize = need.length()

    let mut window: HashMap<u32, i64> = HashMap::new(window_size)
    let mut matched: usize = 0
    let mut left: usize = 0
    let mut right: usize = 0
    while right < total {
        let key: u32 = s.byte_at(right) as u32
        if need.contains_key(key) {
            let mut old: i64 = 0
            if window.contains_key(key) {
                old = window.get(key).unwrap()
            }
            if old == need.get(key).unwrap() {
                matched = matched - 1
            }
            window.insert(key, old + 1)
            if old + 1 == need.get(key).unwrap() {
                matched = matched + 1
            }
        }

        right = right + 1
        if right - left > window_size {
            let out_key: u32 = s.byte_at(left) as u32
            if need.contains_key(out_key) {
                let old_count: i64 = window.get(out_key).unwrap()
                if old_count == need.get(out_key).unwrap() {
                    matched = matched - 1
                }
                if old_count == 1 {
                    let dropped: Option<i64> = window.remove(out_key)
                } else {
                    window.insert(out_key, old_count - 1)
                    if old_count - 1 == need.get(out_key).unwrap() {
                        matched = matched + 1
                    }
                }
            }
            left = left + 1
        }

        if matched == distinct {
            result.push(left as i64)
        }
    }
    return result.to_array()
}

class Solution {
    micro findAnagrams(self, s: utf8, p: utf8): [i64] {
        return find_anagrams(s, p)
    }
}
