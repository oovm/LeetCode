namespace leetcode.reformat_phone_number;

[export(case: "camelCase")]
micro reformat_number(number: utf8) -> utf8 {
    let n: usize = number.length()
    let mut digits: ArrayList<char> = ArrayList::new(n)
    let mut i: usize = 0
    while i < n {
        let code: u32 = number⁅i⁆ as u32
        if code != 45 && code != 32 {
            digits.push(number⁅i⁆)
        }
        i = i + 1
    }
    let dn: usize = digits.length()
    let mut builder: Utf8Builder = Utf8Builder::new(dn + dn / 3)
    i = 0
    let mut first: bool = true
    while dn > i + 4 {
        if !first {
            builder.append(char::from(45))
        }
        builder.append(digits⁅i⁆.unwrap())
        builder.append(digits⁅i + 1⁆.unwrap())
        builder.append(digits⁅i + 2⁆.unwrap())
        first = false
        i = i + 3
    }
    if !first {
        builder.append(char::from(45))
    }
    if dn == i + 4 {
        builder.append(digits⁅i⁆.unwrap())
        builder.append(digits⁅i + 1⁆.unwrap())
        builder.append(char::from(45))
        builder.append(digits⁅i + 2⁆.unwrap())
        builder.append(digits⁅i + 3⁆.unwrap())
    } else {
        let mut k: usize = i
        while k < dn {
            builder.append(digits⁅k⁆.unwrap())
            k = k + 1
        }
    }
    return builder.build()
}

class Solution {
    micro reformatNumber(self, number: utf8): utf8 {
        return reformat_number(number)
    }
}
