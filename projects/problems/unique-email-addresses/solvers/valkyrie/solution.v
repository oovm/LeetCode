namespace leetcode.unique_email_addresses;

using std.collection;
using std.text;

# 题内触发点: 用 `HashMap<utf8, i64>` 作去重键，命中 std::hash#445（`utf8` 哈希合同未落地）。
# 本地名按 `+` 截断、去 `.`；域名原样拼接；`@` 码位 64、`+` 码位 43、`.` 码位 46。
micro normalize(email: utf8) -> utf8 {
    let mut local: Utf8Builder = Utf8Builder::new(0)
    let mut domain: Utf8Builder = Utf8Builder::new(0)
    let mut i: usize = 0
    let mut seen_plus: bool = false
    let mut at: bool = false
    let at_sign: u32 = 64
    let plus: u32 = 43
    let dot: u32 = 46
    while i < email.length() {
        let code: u32 = email⁅i⁆ as u32
        if code == at_sign {
            at = true
        } else if at {
            domain.append(email⁅i⁆)
        } else if !seen_plus {
            if code == plus {
                seen_plus = true
            } else if code != dot {
                local.append(email⁅i⁆)
            }
        }
        i = i + 1
    }
    return local.build() ++ "@" ++ domain.build()
}

[export(case: "camelCase")]
micro numUniqueEmails(emails: ArrayList<utf8>) -> i64 {
    let mut seen: HashMap<utf8, i64> = HashMap::new(0)
    let mut count: i64 = 0
    loop email in emails {
        let key: utf8 = normalize(email)
        if !seen.contains_key(key) {
            seen.insert(key, 1)
            count = count + 1
        }
    }
    return count
}

class Solution {
    micro numUniqueEmails(self, emails: ArrayList<utf8>): i64 {
        return numUniqueEmails(emails)
    }
}
