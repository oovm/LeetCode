namespace leetcode.defanging_an_ip_address;

[export(case: "camelCase")]
micro defang_i_paddr(address: utf8) -> utf8 {
    let n: usize = address.length()
    let mut builder: Utf8Builder = Utf8Builder::new(n + 6)
    let mut i: usize = 0
    while i < n {
        let c: char = address⁅i⁆
        let code: u32 = c as u32
        if code == 46 {
            builder.append(char::from(91))
            builder.append(c)
            builder.append(char::from(93))
        } else {
            builder.append(c)
        }
        i = i + 1
    }
    return builder.build()
}

class Solution {
    micro defangIPaddr(self, address: utf8): utf8 {
        return defang_i_paddr(address)
    }
}
