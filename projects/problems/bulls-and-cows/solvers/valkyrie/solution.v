namespace leetcode.bulls_and_cows;

using std.collection;
using std.text;

# 同位相等计 A；错位部分按数字频次取 min 补 B。
[export(case: "camelCase")]
micro get_hint(secret: utf8, guess: utf8) -> utf8 {
    let count: usize = secret.length()
    let mut secret_counts: ArrayList<i64> = ArrayList::new(10)
    let mut guess_counts: ArrayList<i64> = ArrayList::new(10)
    let mut digit: usize = 0
    while digit < 10 {
        secret_counts.push(0)
        guess_counts.push(0)
        digit = digit + 1
    }

    let mut bulls: i64 = 0
    let mut index: usize = 0
    while index < count {
        let left: u32 = secret⁅index⁆ as u32
        let right: u32 = guess⁅index⁆ as u32
        if left == right {
            bulls = bulls + 1
        } else {
            let left_slot: usize = (left - 48) as usize
            let right_slot: usize = (right - 48) as usize
            secret_counts⁅left_slot⁆ = secret_counts⁅left_slot⁆ + 1
            guess_counts⁅right_slot⁆ = guess_counts⁅right_slot⁆ + 1
        }
        index = index + 1
    }

    let mut cows: i64 = 0
    digit = 0
    while digit < 10 {
        let from_secret: i64 = secret_counts⁅digit⁆
        let from_guess: i64 = guess_counts⁅digit⁆
        if from_secret < from_guess {
            cows = cows + from_secret
        } else {
            cows = cows + from_guess
        }
        digit = digit + 1
    }

    let mut builder: Utf8Builder = Utf8Builder::new(count + 4)
    builder.append_i64(bulls)
    builder.append("A")
    builder.append_i64(cows)
    builder.append("B")
    return builder.build()
}

class Solution {
    micro getHint(self, secret: utf8, guess: utf8): utf8 {
        return get_hint(secret, guess)
    }
}
