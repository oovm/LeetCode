namespace leetcode.h_index_ii;

using std.collection;

# 升序引用数组二分：找首个 citations[i] >= n - i，答案即 n - i；找不到则 0。O(log n)。
[export(case: "camelCase")]
micro hIndex(citations: [i64]) -> i64 {
    let n: usize = citations.length()
    let mut lo: usize = 0
    let mut hi: usize = n
    while lo < hi {
        let mid: usize = (lo + hi) / 2
        if citations⁅mid⁆ >= (n - mid) as i64 {
            hi = mid
        } else {
            lo = mid + 1
        }
    }
    return (n - lo) as i64
}

class Solution {
    micro hIndex(self, citations: [i64]): i64 {
        return hIndex(citations)
    }
}
