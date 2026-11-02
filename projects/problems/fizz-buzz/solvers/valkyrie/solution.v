namespace leetcode.fizz_buzz;

[export(case: "camelCase")]
micro fizz_buzz(n: i64) -> ArrayList<utf8> {
    let mut result: ArrayList<utf8> = ArrayList::new(n as usize)
    let mut i: i64 = 1
    while i <= n {
        if i % 15 == 0 {
            result.push(Utf8Text::from_bytes([70, 105, 122, 122, 66, 117, 122, 122]))
        } else if i % 3 == 0 {
            result.push(Utf8Text::from_bytes([70, 105, 122, 122]))
        } else if i % 5 == 0 {
            result.push(Utf8Text::from_bytes([66, 117, 122, 122]))
        } else {
            let mut b: Utf8Builder = Utf8Builder::new(4)
            b.append_i64(i)
            result.push(b.build())
        }
        i = i + 1
    }
    return result
}

class Solution {
    micro fizzBuzz(self, n: i64): ArrayList<utf8> {
        return fizz_buzz(n)
    }
}
