namespace leetcode.hand_of_straights;

using std.collection;

# 升序扫描手牌：每遇到仍有余量的最小值，就连续消耗 `groupSize` 个相邻值。
# 排序只影响扫描顺序，频次表保证每个值恰好用尽。
[export(case: "camelCase")]
micro isNStraightHand(hand: [i64], groupSize: i64) -> bool {
    if hand.length() as i64 % groupSize != 0 {
        return false
    }

    let mut counts: HashMap<i64, i64> = HashMap::new(hand.length())
    loop value in hand {
        let mut next: i64 = 1
        if counts.contains_key(value) {
            next = counts.get(value).unwrap() + 1
        }
        counts.insert(value, next)
    }

    let mut ordered: ArrayList<i64> = ArrayList::new(hand.length())
    loop value in hand {
        ordered.push(value)
    }
    sort(ordered)

    let mut i: usize = 0
    while i < ordered.length() {
        let value: i64 = ordered⁅i⁆
        if counts.get(value).unwrap() > 0 {
            let mut step: i64 = 0
            while step < groupSize {
                let target: i64 = value + step
                if counts.contains_key(target) == false {
                    return false
                }
                let amount: i64 = counts.get(target).unwrap()
                if amount == 0 {
                    return false
                }
                counts.insert(target, amount - 1)
                step = step + 1
            }
        }
        i = i + 1
    }
    return true
}

class Solution {
    micro isNStraightHand(self, hand: [i64], groupSize: i64): bool {
        return isNStraightHand(hand, groupSize)
    }
}
