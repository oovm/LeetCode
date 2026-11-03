namespace leetcode.buddy_strings;

# 差异位计数；完全相同则需存在重复字符，O(n)
[export(case: "camelCase")]
micro buddy_strings(s: utf8, goal: utf8) -> bool {
    let n: usize = s.length()
    if n != goal.length() {
        return false
    }
    let mut diff: ArrayList<i64> = ArrayList::new(2)
    let mut i: usize = 0
    while i < n {
        if (s⁅i⁆ as u32) != (goal⁅i⁆ as u32) {
            diff.push(i as i64)
            if diff.length() > 2 {
                return false
            }
        }
        i = i + 1
    }
    if diff.length() == 0 {
        let mut counts: HashMap<i64, i64> = HashMap::new(0)
        let mut k: usize = 0
        while k < n {
            let key: i64 = s⁅k⁆ as u32 as i64
            if counts.contains_key(key) {
                return true
            }
            counts.insert(key, 1)
            k = k + 1
        }
        return false
    }
    if diff.length() != 2 {
        return false
    }
    let a: usize = diff⁅0⁆.unwrap() as usize
    let b: usize = diff⁅1⁆.unwrap() as usize
    return (s⁅a⁆ as u32) == (goal⁅b⁆ as u32) && (s⁅b⁆ as u32) == (goal⁅a⁆ as u32)
}

class Solution {
    micro buddyStrings(self, s: utf8, goal: utf8): bool {
        return buddy_strings(s, goal)
    }
}
