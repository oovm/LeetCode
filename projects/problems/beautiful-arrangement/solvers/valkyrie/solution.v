namespace leetcode.beautiful_arrangement;

micro arrange(position: i64, n: i64, visited: ArrayList<bool>) -> i64 {
    if position > n {
        return 1
    }
    let mut total: i64 = 0
    let mut value: i64 = 1
    while value <= n {
        let index: usize = value as usize
        if visited⁅index⁆ == false && (value % position == 0 || position % value == 0) {
            visited⁅index⁆ = true
            total = total + arrange(position + 1, n, visited)
            visited⁅index⁆ = false
        }
        value = value + 1
    }
    return total
}

[export(case: "camelCase")]
micro countArrangement(n: i64) -> i64 {
    let mut visited: ArrayList<bool> = ArrayList::new((n + 1) as usize)
    let mut slot: i64 = 0
    while slot <= n {
        visited.push(false)
        slot = slot + 1
    }
    return arrange(1, n, visited)
}

class Solution {
    micro countArrangement(self, n: i64): i64 {
        return countArrangement(n)
    }
}
