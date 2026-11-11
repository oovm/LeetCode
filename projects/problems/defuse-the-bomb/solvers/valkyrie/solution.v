namespace leetcode.defuse_the_bomb;

using std.collection;

# 环形窗口求和，k 的正负决定窗口方向。
[export(case: "camelCase")]
micro decrypt(code: [i64], k: i64) -> [i64] {
    let count: usize = code.length()
    let mut answer: ArrayList<i64> = ArrayList::new(count)
    let mut position: usize = 0
    while position < count {
        answer.push(0)
        position = position + 1
    }
    if k == 0 {
        return answer.to_array()
    }

    position = 0
    while position < count {
        let mut total: i64 = 0
        let mut step: i64 = 1
        if k > 0 {
            while step <= k {
                let offset: i64 = (position as i64 + step) % (count as i64)
                let offset_index: usize = offset as usize
                total = total + code⁅offset_index⁆
                step = step + 1
            }
        } else {
            step = -1
            while step >= k {
                let offset: i64 = (position as i64 + step + count as i64) % (count as i64)
                let offset_index: usize = offset as usize
                total = total + code⁅offset_index⁆
                step = step - 1
            }
        }
        answer⁅position⁆ = total
        position = position + 1
    }
    return answer.to_array()
}

class Solution {
    micro decrypt(self, code: [i64], k: i64): [i64] {
        return decrypt(code, k)
    }
}
