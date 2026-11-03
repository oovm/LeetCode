namespace leetcode.android_unlock_patterns;

micro via(a: i64, b: i64) -> i64 {
    if (a == 0 && b == 2) || (a == 2 && b == 0) {
        return 1
    }
    if (a == 3 && b == 5) || (a == 5 && b == 3) {
        return 4
    }
    if (a == 6 && b == 8) || (a == 8 && b == 6) {
        return 7
    }
    if (a == 0 && b == 6) || (a == 6 && b == 0) {
        return 3
    }
    if (a == 1 && b == 7) || (a == 7 && b == 1) {
        return 4
    }
    if (a == 2 && b == 8) || (a == 8 && b == 2) {
        return 5
    }
    if (a == 0 && b == 8) || (a == 8 && b == 0) {
        return 4
    }
    if (a == 2 && b == 6) || (a == 6 && b == 2) {
        return 4
    }
    return 0
}

micro walk(current: i64, remaining: i64, visited: ArrayList<bool>) -> i64 {
    if remaining == 0 {
        return 1
    }
    let mut total: i64 = 0
    let mut next: i64 = 0
    while next < 9 {
        let index: usize = next as usize
        if visited⁅index⁆ == false {
            let midpoint: i64 = via(current, next)
            if midpoint == 0 || visited⁅midpoint as usize⁆ {
                visited⁅index⁆ = true
                total = total + walk(next, remaining - 1, visited)
                visited⁅index⁆ = false
            }
        }
        next = next + 1
    }
    return total
}

micro countFrom(start: i64, low: i64, high: i64, visited: ArrayList<bool>) -> i64 {
    let mut slot: usize = 0
    while slot < 9 {
        visited⁅slot⁆ = false
        slot = slot + 1
    }
    visited⁅start as usize⁆ = true
    let mut total: i64 = 0
    let mut length: i64 = low
    while length <= high {
        total = total + walk(start, length - 1, visited)
        length = length + 1
    }
    return total
}

[export(case: "camelCase")]
micro numberOfPatterns(m: i64, n: i64) -> i64 {
    let mut visited: ArrayList<bool> = ArrayList::new(9)
    let mut slot: i64 = 0
    while slot < 9 {
        visited.push(false)
        slot = slot + 1
    }
    return countFrom(0, m, n, visited) * 4 + countFrom(1, m, n, visited) * 4 + countFrom(4, m, n, visited)
}

class Solution {
    micro numberOfPatterns(self, m: i64, n: i64): i64 {
        return numberOfPatterns(m, n)
    }
}
