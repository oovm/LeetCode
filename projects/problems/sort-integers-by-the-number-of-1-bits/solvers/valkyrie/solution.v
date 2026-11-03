namespace leetcode.sort_integers_by_the_number_of_1_bits;

micro bit_count(x: i64) -> i64 {
    let mut count: i64 = 0
    let mut num: i64 = x
    while num > 0 {
        if num % 2 == 1 {
            count = count + 1
        }
        num = num / 2
    }
    return count
}

[export(case: "camelCase")]
micro sort_by_bits(arr: ArrayList<i64>) -> ArrayList<i64> {
    let n: usize = arr.length()
    let mut values: ArrayList<i64> = ArrayList::new(n)
    let mut keys: ArrayList<i64> = ArrayList::new(n)
    let mut i: usize = 0
    while i < n {
        let v: i64 = arr⁅i⁆
        values.push(v)
        keys.push(bit_count(v))
        i = i + 1
    }
    i = 0
    while i < n {
        let mut best: usize = i
        let mut j: usize = i + 1
        while j < n {
            let key_j: i64 = keys⁅j⁆
            let key_best: i64 = keys⁅best⁆
            let value_j: i64 = values⁅j⁆
            let value_best: i64 = values⁅best⁆
            if key_j < key_best {
                best = j
            } else if key_j == key_best && value_j < value_best {
                best = j
            }
            j = j + 1
        }
        if best != i {
            let tmp_key: i64 = keys⁅i⁆
            keys⁅i⁆ = keys⁅best⁆
            keys⁅best⁆ = tmp_key
            let tmp_value: i64 = values⁅i⁆
            values⁅i⁆ = values⁅best⁆
            values⁅best⁆ = tmp_value
        }
        i = i + 1
    }
    return values
}

class Solution {
    micro sortByBits(self, arr: ArrayList<i64>): ArrayList<i64> {
        return sort_by_bits(arr)
    }
}
