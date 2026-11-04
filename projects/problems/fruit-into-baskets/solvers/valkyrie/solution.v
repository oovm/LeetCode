namespace leetcode.fruit_into_baskets;

using std.collection;

# 最多两只篮子：滑窗内不同水果种类 ≤ 2，超出时左端收缩并清理计数。
# 频次表用 `HashMap<i64, i64>`，删除键当且仅当计数归零。
[export(case: "camelCase")]
micro totalFruit(fruits: ArrayList<i64>) -> i64 {
    let mut counts: HashMap<i64, i64> = HashMap::new(fruits.length())
    let mut left: usize = 0
    let mut best: i64 = 0
    let mut right: usize = 0
    while right < fruits.length() {
        let value: i64 = fruits⁅right⁆
        let mut next: i64 = 1
        if counts.contains_key(value) {
            next = counts.get(value).unwrap() + 1
        }
        counts.insert(value, next)

        while counts.length() > 2 {
            let oldest: i64 = fruits⁅left⁆
            let rest: i64 = counts.get(oldest).unwrap() - 1
            if rest == 0 {
                counts.remove(oldest)
            }
            else {
                counts.insert(oldest, rest)
            }
            left = left + 1
        }

        let window: i64 = right as i64 - left as i64 + 1
        if window > best {
            best = window
        }
        right = right + 1
    }
    return best
}

class Solution {
    micro totalFruit(self, fruits: ArrayList<i64>): i64 {
        return totalFruit(fruits)
    }
}
