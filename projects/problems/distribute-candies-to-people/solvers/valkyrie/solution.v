namespace leetcode.distribute_candies_to_people;

# 按 1,2,3... 循环递增发放，剩余不足时全部给出。
[export(case: "camelCase")]
micro distribute_candies(candies: i64, num_people: i64) -> [i64] {
    let mut result: ArrayList<i64> = ArrayList::new(num_people as usize)
    let mut i: i64 = 0
    while i < num_people {
        result.push(0)
        i = i + 1
    }
    let mut given: i64 = 1
    let mut index: i64 = 0
    let mut left: i64 = candies
    while left > 0 {
        let mut amount: i64 = given
        if left < given {
            amount = left
        }
        result⁅index as usize⁆ = result⁅index as usize⁆ + amount
        left = left - amount
        given = given + 1
        index = (index + 1) % num_people
    }
    return result.to_array()
}

class Solution {
    micro distributeCandies(self, candies: i64, num_people: i64): [i64] {
        return distribute_candies(candies, num_people)
    }
}
