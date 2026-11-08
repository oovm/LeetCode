namespace probe.kmp;

using std.collection
using std.text

# 先取码位序列，避免在匹配循环里反复 `character_at` 造成 O(n²)。
micro codepoints(text: utf8) -> ArrayList<i64> {
    let mut values: ArrayList<i64> = ArrayList::new(text.length())
    loop ch in text {
        values.push((ch as u32) as i64)
    }
    return values
}

# 前缀函数：`failure[i]` 是 `pattern[0..=i]` 的最长真前缀同时也是后缀的长度。
micro build_failure(pattern: ArrayList<i64>) -> ArrayList<i64> {
    let mut failure: ArrayList<i64> = ArrayList::new(pattern.length())
    failure.push(0)
    let mut matched: i64 = 0
    let mut index: i64 = 1
    while index < pattern.length() as i64 {
        while matched > 0 && pattern⁅index as usize⁆ != pattern⁅matched as usize⁆ {
            matched = failure⁅(matched - 1) as usize⁆
        }
        if pattern⁅index as usize⁆ == pattern⁅matched as usize⁆ {
            matched = matched + 1
        }
        failure.push(matched)
        index = index + 1
    }
    return failure
}

micro kmp_first(haystack: ArrayList<i64>, needle: ArrayList<i64>) -> i64 {
    let count: i64 = needle.length() as i64
    if count == 0 {
        return 0
    }
    let failure: ArrayList<i64> = build_failure(needle)
    let mut matched: i64 = 0
    let mut index: i64 = 0
    while index < haystack.length() as i64 {
        while matched > 0 && haystack⁅index as usize⁆ != needle⁅matched as usize⁆ {
            matched = failure⁅(matched - 1) as usize⁆
        }
        if haystack⁅index as usize⁆ == needle⁅matched as usize⁆ {
            matched = matched + 1
        }
        if matched == count {
            return index - count + 1
        }
        index = index + 1
    }
    return -1
}

# 允许重叠的出现次数：命中后回退到 `failure[count - 1]` 继续匹配。
micro kmp_count(haystack: ArrayList<i64>, needle: ArrayList<i64>) -> i64 {
    let count: i64 = needle.length() as i64
    if count == 0 {
        return 0
    }
    let failure: ArrayList<i64> = build_failure(needle)
    let mut matched: i64 = 0
    let mut found: i64 = 0
    let mut index: i64 = 0
    while index < haystack.length() as i64 {
        while matched > 0 && haystack⁅index as usize⁆ != needle⁅matched as usize⁆ {
            matched = failure⁅(matched - 1) as usize⁆
        }
        if haystack⁅index as usize⁆ == needle⁅matched as usize⁆ {
            matched = matched + 1
        }
        if matched == count {
            found = found + 1
            matched = failure⁅(count - 1) as usize⁆
        }
        index = index + 1
    }
    return found
}

[export(name: "kmpFirstIndex")]
micro kmp_first_index() -> i64 {
    return kmp_first(codepoints("abxabcabcaby"), codepoints("abcaby"))
}

[export(name: "kmpOccurrenceCount")]
micro kmp_occurrence_count() -> i64 {
    return kmp_count(codepoints("aaaaa"), codepoints("aa"))
}
