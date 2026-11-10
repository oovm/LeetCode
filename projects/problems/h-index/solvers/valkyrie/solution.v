namespace leetcode.h_index;

using std.collection;

# 桶计数：citation >= n 的归到桶 n，其余归到对应桶；从高位向下累加计数，首次 >= h 即答案。
[export(case: "camelCase")]
micro hIndex(citations: ArrayList<i64>) -> i64 {
    let n: i64 = citations.length() as i64
    let mut bucket: ArrayList<i64> = ArrayList::new((n + 1) as usize)
    let mut slot: i64 = 0
    while slot <= n {
        bucket.push(0)
        slot = slot + 1
    }
    loop value in citations {
        let capped: i64 = value
        if value > n {
            capped = n
        }
        bucket⁅capped as usize⁆ = bucket⁅capped as usize⁆ + 1
    }
    let mut count: i64 = 0
    let mut h: i64 = n
    while h >= 0 {
        count = count + bucket⁅h as usize⁆
        if count >= h {
            return h
        }
        h = h - 1
    }
    return 0
}

class Solution {
    micro hIndex(self, citations: ArrayList<i64>): i64 {
        return hIndex(citations)
    }
}
