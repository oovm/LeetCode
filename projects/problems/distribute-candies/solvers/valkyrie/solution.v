namespace leetcode.distribute_candies;

using std.collection;

# 种类数决定上限，最多只能分到「种类数」种；另一半上限是 n/2，两者取小。
# 去重直接交给 `HashSet<i64>`，不手写排序。
[export(case: "camelCase")]
micro distributeCandies(candyType: ArrayList<i64>) -> i64 {
    let mut kinds: HashSet<i64> = HashSet::new()
    loop candy in candyType {
        kinds.insert(candy)
    }
    let half: i64 = (candyType.length() / 2) as i64
    let total: i64 = kinds.length() as i64
    if total < half {
        return total
    }
    return half
}

class Solution {
    micro distributeCandies(self, candyType: ArrayList<i64>): i64 {
        return distributeCandies(candyType)
    }
}
