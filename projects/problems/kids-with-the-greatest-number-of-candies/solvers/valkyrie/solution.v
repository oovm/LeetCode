namespace leetcode.kids_with_the_greatest_number_of_candies;

using std.collection;
using std.iterator::{Iterator, IntoIterator, fold, collect_array_list};

# 数值归约只有手写 fold：std.math 的 max 只有 f64 重载，Iterator 终端也没有 max（G20）。
[export(case: "camelCase")]
micro kids_with_candies(candies: [i64], extra_candies: i64) -> ArrayList<bool> {
    let most: i64 = candies.into_iterator().fold(0, micro(best: i64, candy: i64) -> i64 {
        if candy > best {
            return candy
        }
        return best
    })

    let result: ArrayList<bool> = candies.into_iterator().map(micro(candy: i64) -> bool {
        return candy + extra_candies >= most
    }).collect_array_list()
    return result
}

class Solution {
    micro kidsWithCandies(self, candies: [i64], extraCandies: i64): ArrayList<bool> {
        return kids_with_candies(candies, extraCandies)
    }
}
