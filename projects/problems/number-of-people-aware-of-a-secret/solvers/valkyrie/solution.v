namespace leetcode.number_of_people_aware_of_a_secret;

[export(case: "camelCase")]
micro peopleAwareOfSecret(n: i64, delay: i64, forget: i64) -> i64 {
    let mod: i64 = 1000000007
    let mut active: ArrayList<i64> = ArrayList::new((n + 1) as usize)
    let mut slot: i64 = 0
    while slot <= n {
        active.push(0)
        slot = slot + 1
    }
    active⁅1 as usize⁆ = 1

    let mut day: i64 = 1
    while day <= n {
        let source: i64 = active⁅day as usize⁆
        let mut spread: i64 = day + delay
        while spread < day + forget && spread <= n {
            let index: usize = spread as usize
            active⁅index⁆ = (active⁅index⁆ + source) % mod
            spread = spread + 1
        }
        day = day + 1
    }

    let mut answer: i64 = 0
    let mut start: i64 = n - forget + 1
    if start < 1 {
        start = 1
    }
    let mut at: i64 = start
    while at <= n {
        answer = (answer + active⁅at as usize⁆) % mod
        at = at + 1
    }
    return answer
}

class Solution {
    micro peopleAwareOfSecret(self, n: i64, delay: i64, forget: i64): i64 {
        return peopleAwareOfSecret(n, delay, forget)
    }
}
