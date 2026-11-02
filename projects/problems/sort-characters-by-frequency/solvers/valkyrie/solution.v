namespace leetcode.sort_characters_by_frequency;

[export(case: "camelCase")]
micro frequency_sort(s: utf8) -> utf8 {
    let n: usize = s.length()
    let mut counts: ArrayList<i64> = ArrayList::new(128)
    let mut i: usize = 0
    while i < 128 {
        counts.push(0)
        i = i + 1
    }
    let mut order: ArrayList<i64> = ArrayList::new(128)
    i = 0
    while i < n {
        let code: i64 = s⁅i⁆ as u32 as i64
        if counts⁅code as usize⁆.unwrap() == 0 {
            order.push(code)
        }
        counts⁅code as usize⁆ = counts⁅code as usize⁆.unwrap() + 1
        i = i + 1
    }
    let m: usize = order.length()
    i = 0
    while i < m {
        let mut best: usize = i
        let mut j: usize = i + 1
        while j < m {
            if counts⁅order⁅j⁆.unwrap() as usize⁆.unwrap() > counts⁅order⁅best⁆.unwrap() as usize⁆.unwrap() {
                best = j
            }
            j = j + 1
        }
        if best != i {
            let tmp: i64 = order⁅i⁆.unwrap()
            order⁅i⁆ = order⁅best⁆.unwrap()
            order⁅best⁆ = tmp
        }
        i = i + 1
    }
    let mut result: Utf8Builder = Utf8Builder::new(n)
    i = 0
    while i < m {
        let code: i64 = order⁅i⁆.unwrap()
        let mut k: i64 = counts⁅code as usize⁆.unwrap()
        while k > 0 {
            result.append(char::from(code as u32))
            k = k - 1
        }
        i = i + 1
    }
    return result.build()
}

class Solution {
    micro frequencySort(self, s: utf8): utf8 {
        return frequency_sort(s)
    }
}
