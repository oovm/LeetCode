namespace leetcode.majority_element_ii;

using std.collection;

# Boyer-Moore 双候选：初值 v1=0/v2=1 与 TS 参照对齐；输出先 v1 后 v2，验证计数 > n/3。
[export(case: "camelCase")]
micro majorityElement(nums: ArrayList<i64>) -> ArrayList<i64> {
    let mut v1: i64 = 0
    let mut v2: i64 = 1
    let mut c1: i64 = 0
    let mut c2: i64 = 0
    loop x in nums {
        if x == v1 {
            c1 = c1 + 1
        } else if x == v2 {
            c2 = c2 + 1
        } else if c1 == 0 {
            v1 = x
            c1 = 1
        } else if c2 == 0 {
            v2 = x
            c2 = 1
        } else {
            c1 = c1 - 1
            c2 = c2 - 1
        }
    }
    let mut t1: i64 = 0
    let mut t2: i64 = 0
    loop x in nums {
        if x == v1 {
            t1 = t1 + 1
        }
        if x == v2 {
            t2 = t2 + 1
        }
    }
    let mut out: ArrayList<i64> = ArrayList::new(0)
    let threshold: i64 = nums.length() as i64 / 3
    if t1 > threshold {
        out.push(v1)
    }
    if v2 != v1 && t2 > threshold {
        out.push(v2)
    }
    return out
}

class Solution {
    micro majorityElement(self, nums: ArrayList<i64>): ArrayList<i64> {
        return majorityElement(nums)
    }
}
