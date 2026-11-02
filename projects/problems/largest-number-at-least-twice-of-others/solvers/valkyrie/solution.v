namespace leetcode.largest_number_at_least_twice_of_others;

[export(case: "camelCase")]
micro dominant_index(nums: ArrayList<i64>) -> i64 {
    let n: usize = nums.length()
    let mut best: i64 = -1
    let mut idx: i64 = -1
    let mut i: usize = 0
    while i < n {
        let v: i64 = nums⁅i⁆.unwrap()
        if v > best {
            best = v
            idx = i as i64
        }
        i = i + 1
    }
    let mut ok: bool = true
    let mut j: usize = 0
    while j < n {
        let v: i64 = nums⁅j⁆.unwrap()
        if v != best && v * 2 > best {
            ok = false
        }
        j = j + 1
    }
    if ok {
        return idx
    }
    return -1
}

class Solution {
    micro dominantIndex(self, nums: ArrayList<i64>): i64 {
        return dominant_index(nums)
    }
}
