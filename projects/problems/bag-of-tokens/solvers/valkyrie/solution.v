namespace leetcode.bag_of_tokens;

using std.collection;

micro compare_asc(a: i64, b: i64) -> i32 {
    if a < b {
        return -1
    }
    if a > b {
        return 1
    }
    return 0
}

# 升序后双指针：够能量就买最便宜的换分，不够就用已有的分卖掉最贵的。
[export(case: "camelCase")]
micro bagOfTokensScore(tokens: ArrayList<i64>, power: i64) -> i64 {
    let ordered: ArrayList<i64> = sorted_by(tokens, compare_asc)
    let mut low: usize = 0
    let mut high: usize = ordered.length()
    let mut energy: i64 = power
    let mut score: i64 = 0
    let mut best: i64 = 0
    while low < high {
        if energy >= ordered⁅low⁆ {
            energy = energy - ordered⁅low⁆
            score = score + 1
            low = low + 1
            if score > best {
                best = score
            }
        } else if score > 0 {
            high = high - 1
            energy = energy + ordered⁅high⁆
            score = score - 1
        } else {
            break
        }
    }
    return best
}

class Solution {
    micro bagOfTokensScore(self, tokens: ArrayList<i64>, power: i64): i64 {
        return bagOfTokensScore(tokens, power)
    }
}
