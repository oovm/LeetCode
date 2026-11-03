namespace leetcode.first_bad_version;

# 二分定位首个失败版本，O(log n)
[export(case: "camelCase")]
micro first_bad_version(n: i64, bad: i64) -> i64 {
    let mut lo: i64 = 1
    let mut hi: i64 = n
    while lo < hi {
        let mid: i64 = lo + (hi - lo) / 2
        if mid >= bad {
            hi = mid
        } else {
            lo = mid + 1
        }
    }
    return lo
}

class Solution {
    micro firstBadVersion(self, n: i64, bad: i64): i64 {
        return first_bad_version(n, bad)
    }
}
