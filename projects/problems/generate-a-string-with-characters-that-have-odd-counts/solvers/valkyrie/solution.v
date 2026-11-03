namespace leetcode.generate_a_string_with_characters_that_have_odd_counts;

[export(case: "camelCase")]
micro generate_the_string(n: i64) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(n as usize)
    let mut count: i64 = n
    if n % 2 == 0 {
        count = n - 1
    }
    let mut i: i64 = 0
    while i < count {
        builder.append(char::from(97))
        i = i + 1
    }
    if n % 2 == 0 {
        builder.append(char::from(98))
    }
    return builder.build()
}

class Solution {
    micro generateTheString(self, n: i64): utf8 {
        return generate_the_string(n)
    }
}
