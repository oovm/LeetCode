namespace leetcode.fixed_point;

using std.collection;

# 严格递增数组：f(i) = arr[i] - i 不减，二分首个 arr[mid] >= mid，验证等号即最小不动点。
[export(case: "camelCase")]
micro fixedPoint(arr: [i64]) -> i64 {
    let n: usize = arr.length()
    let mut lo: usize = 0
    let mut hi: usize = n
    while lo < hi {
        let mid: usize = (lo + hi) / 2
        if arr⁅mid⁆ >= mid as i64 {
            hi = mid
        } else {
            lo = mid + 1
        }
    }
    if lo < n && arr⁅lo⁆ == lo as i64 {
        return lo as i64
    }
    return -1
}

class Solution {
    micro fixedPoint(self, arr: [i64]): i64 {
        return fixedPoint(arr)
    }
}
