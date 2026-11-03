namespace leetcode.knight_dialer;

[export(case: "camelCase")]
micro knightDialer(n: i64) -> i64 {
    let mod: i64 = 1000000007
    let mut dp: ArrayList<i64> = ArrayList::new(10)
    let mut slot: usize = 0
    while slot < 10 {
        dp.push(1)
        slot = slot + 1
    }

    let i0: usize = 0
    let i1: usize = 1
    let i2: usize = 2
    let i3: usize = 3
    let i4: usize = 4
    let i6: usize = 6
    let i7: usize = 7
    let i8: usize = 8
    let i9: usize = 9

    let mut step: i64 = 1
    while step < n {
        let mut next: ArrayList<i64> = ArrayList::new(10)
        next.push((dp⁅i4⁆ + dp⁅i6⁆) % mod)
        next.push((dp⁅i6⁆ + dp⁅i8⁆) % mod)
        next.push((dp⁅i7⁆ + dp⁅i9⁆) % mod)
        next.push((dp⁅i4⁆ + dp⁅i8⁆) % mod)
        next.push((dp⁅i0⁆ + dp⁅i3⁆ + dp⁅i9⁆) % mod)
        next.push(0)
        next.push((dp⁅i0⁆ + dp⁅i1⁆ + dp⁅i7⁆) % mod)
        next.push((dp⁅i2⁆ + dp⁅i6⁆) % mod)
        next.push((dp⁅i1⁆ + dp⁅i3⁆) % mod)
        next.push((dp⁅i2⁆ + dp⁅i4⁆) % mod)
        dp = next
        step = step + 1
    }

    let mut answer: i64 = 0
    let mut i: usize = 0
    while i < 10 {
        answer = (answer + dp⁅i⁆) % mod
        i = i + 1
    }
    return answer
}

class Solution {
    micro knightDialer(self, n: i64): i64 {
        return knightDialer(n)
    }
}
