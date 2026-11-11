namespace leetcode.boats_to_save_people;

# 排序后双指针：最重的人尽量和最轻的人同船，装不下就自己一船。
[export(case: "camelCase")]
micro numRescueBoats(people: [i64], limit: i64) -> i64 {
    let mut ordered: ArrayList<i64> = ArrayList::new(people.length())
    loop value in people {
        ordered.push(value)
    }
    sort(ordered)

    let mut left: i64 = 0
    let mut right: i64 = ordered.length() as i64 - 1
    let mut boats: i64 = 0
    while left <= right {
        if ordered⁅left as usize⁆ + ordered⁅right as usize⁆ <= limit {
            left = left + 1
        }
        right = right - 1
        boats = boats + 1
    }
    return boats
}

class Solution {
    micro numRescueBoats(self, people: [i64], limit: i64): i64 {
        return numRescueBoats(people, limit)
    }
}
