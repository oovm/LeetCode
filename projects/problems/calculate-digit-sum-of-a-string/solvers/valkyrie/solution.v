namespace leetcode.calculate_digit_sum_of_a_string;

[export(case: "camelCase")]
micro digit_sum(s: utf8, k: i64) -> utf8 {
    let mut cur: utf8 = s
    let mut done: bool = false
    while !done {
        let n: usize = cur.length()
        if (n as i64) <= k {
            done = true
        } else {
            let limit: i64 = n as i64
            let mut builder: Utf8Builder = Utf8Builder::new(n)
            let mut i: usize = 0
            while i < n {
                let mut end: usize = n
                let next: i64 = i as i64 + k
                if next < limit {
                    end = next as usize
                }
                let mut sum: i64 = 0
                let mut j: usize = i
                while j < end {
                    sum = sum + (cur⁅j⁆ as u32 as i64 - 48)
                    j = j + 1
                }
                if sum == 0 {
                    builder.append(char::from(48))
                } else {
                    let mut digits: ArrayList<i64> = ArrayList::new(3)
                    let mut v: i64 = sum
                    while v > 0 {
                        digits.push(v % 10)
                        v = v / 10
                    }
                    let mut d: usize = digits.length()
                    while d > 0 {
                        builder.append(char::from((48 + digits⁅d - 1⁆.unwrap()) as u32))
                        d = d - 1
                    }
                }
                i = end
            }
            cur = builder.build()
        }
    }
    return cur
}

class Solution {
    micro digitSum(self, s: utf8, k: i64): utf8 {
        return digit_sum(s, k)
    }
}
