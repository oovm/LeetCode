namespace leetcode.get_maximum_in_generated_array;

[export(case: "camelCase")]
micro getMaximumGenerated(n: i64) -> i64 {
    if n == 0 {
        return 0
    }

    let mut arr: ArrayList<i64> = ArrayList::new((n + 1) as usize)
    arr.push(0)
    arr.push(1)
    let mut best: i64 = 1
    let mut i: i64 = 2

    while i <= n {
        let half: usize = (i / 2) as usize
        let mut value: i64 = arr⁅half⁆
        if i % 2 == 1 {
            let next: usize = half + 1
            value = value + arr⁅next⁆
        }
        arr.push(value)
        if value > best {
            best = value
        }
        i = i + 1
    }

    return best
}

class Solution {
    micro getMaximumGenerated(self, n: i64): i64 {
        return getMaximumGenerated(n)
    }
}
