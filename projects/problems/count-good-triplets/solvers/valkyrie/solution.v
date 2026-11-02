namespace leetcode.count_good_triplets;

micro abs_i64(x: i64) -> i64 {
    if x < 0 {
        return 0 - x
    }
    return x
}

[export(case: "camelCase")]
micro count_good_triplets(arr: ArrayList<i64>, a: i64, b: i64, c: i64) -> i64 {
    let n: usize = arr.length()
    let mut ans: i64 = 0
    let mut i: usize = 0
    while i < n {
        let mut j: usize = i + 1
        while j < n {
            let mut k: usize = j + 1
            while k < n {
                let ok_ij: bool = abs_i64(arr⁅i⁆.unwrap() - arr⁅j⁆.unwrap()) <= a
                let ok_jk: bool = abs_i64(arr⁅j⁆.unwrap() - arr⁅k⁆.unwrap()) <= b
                let ok_ik: bool = abs_i64(arr⁅i⁆.unwrap() - arr⁅k⁆.unwrap()) <= c
                if ok_ij && ok_jk && ok_ik {
                    ans = ans + 1
                }
                k = k + 1
            }
            j = j + 1
        }
        i = i + 1
    }
    return ans
}

class Solution {
    micro countGoodTriplets(self, arr: ArrayList<i64>, a: i64, b: i64, c: i64): i64 {
        return count_good_triplets(arr, a, b, c)
    }
}
