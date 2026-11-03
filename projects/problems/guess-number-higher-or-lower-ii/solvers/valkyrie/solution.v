namespace leetcode.guess_number_higher_or_lower_ii;

[export(case: "camelCase")]
micro getMoneyAmount(n: i64) -> i64 {
    let width: i64 = n + 1
    let size: i64 = width * width
    let mut dp: ArrayList<i64> = ArrayList::new(size as usize)
    let mut slot: i64 = 0
    while slot < size {
        dp.push(0)
        slot = slot + 1
    }

    let mut length: i64 = 2
    while length <= n {
        let mut low: i64 = 1
        while low + length - 1 <= n {
            let high: i64 = low + length - 1
            let mut best: i64 = 0
            let mut hasBest: bool = false
            let mut guess: i64 = low
            while guess < high {
                let mut cost: i64 = 0
                if low <= guess - 1 {
                    let leftIndex: i64 = low * width + guess - 1
                    let leftValue: i64 = dp⁅leftIndex as usize⁆
                    if leftValue > cost {
                        cost = leftValue
                    }
                }
                if guess + 1 <= high {
                    let rightIndex: i64 = (guess + 1) * width + high
                    let rightValue: i64 = dp⁅rightIndex as usize⁆
                    if rightValue > cost {
                        cost = rightValue
                    }
                }
                let candidate: i64 = guess + cost
                if !hasBest || candidate < best {
                    best = candidate
                    hasBest = true
                }
                guess = guess + 1
            }
            let cell: i64 = low * width + high
            dp⁅cell as usize⁆ = best
            low = low + 1
        }
        length = length + 1
    }

    let answer: i64 = width + n
    return dp⁅answer as usize⁆
}

class Solution {
    micro getMoneyAmount(self, n: i64): i64 {
        return getMoneyAmount(n)
    }
}
