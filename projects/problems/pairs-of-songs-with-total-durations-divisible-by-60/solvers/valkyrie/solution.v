namespace leetcode.pairs_of_songs_with_total_durations_divisible_by_60;

using std.collection;

# 余数计数：0 与 30 内部配对，其余余数 r 与 60-r 配对一次。
# 这里刻意用 `HashMap<i32, i64>`：键是 0..59 的余数，用来验证 i32 键与 i32 相等合同的可用性。
[export(case: "camelCase")]
micro numPairsDivisibleBy60(time: ArrayList<i64>) -> i64 {
    let mut counts: HashMap<i32, i64> = HashMap::new(0)
    let mut index: usize = 0
    while index < time.length() {
        let key: i32 = (time⁅index⁆ % 60) as i32
        if counts.contains_key(key) {
            counts.insert(key, counts.get(key).unwrap() + 1)
        } else {
            counts.insert(key, 1)
        }
        index = index + 1
    }

    let mut answer: i64 = 0
    let mut remainder: usize = 0
    while remainder <= 59 {
        let key: i32 = remainder as i32
        if counts.contains_key(key) {
            let amount: i64 = counts.get(key).unwrap()
            if remainder == 0 || remainder == 30 {
                answer = answer + amount * (amount - 1) / 2
            } else if remainder < 30 {
                let other: i32 = (60 - remainder) as i32
                if counts.contains_key(other) {
                    answer = answer + amount * counts.get(other).unwrap()
                }
            }
        }
        remainder = remainder + 1
    }
    return answer
}

class Solution {
    micro numPairsDivisibleBy60(self, time: ArrayList<i64>): i64 {
        return numPairsDivisibleBy60(time)
    }
}
