namespace probe.char_classification;

using std.text

# 对 "a1 B2_!e" 逐字符分类统计：数字 2、字母 3、字母数字 5、元音 2。
[export(name: "classCounts")]
micro class_counts() -> i64 {
    let text: utf8 = "a1 B2_!e"
    let mut digits: i64 = 0
    let mut letters: i64 = 0
    let mut alnum: i64 = 0
    let mut vowels: i64 = 0
    loop current in text {
        if current.is_ascii_digit() {
            digits = digits + 1
        }
        if current.is_ascii_alpha() {
            letters = letters + 1
        }
        if current.is_ascii_alphanumeric() {
            alnum = alnum + 1
        }
        if current.is_ascii_vowel() {
            vowels = vowels + 1
        }
    }
    return digits * 1000 + letters * 100 + alnum * 10 + vowels
}

# 非 ASCII 字符不属于 ASCII 数字/字母类。
[export(name: "nonAsciiClasses")]
micro non_ascii_classes() -> i64 {
    let text: utf8 = "é3"
    let mut digits: i64 = 0
    let mut letters: i64 = 0
    loop current in text {
        if current.is_ascii_digit() {
            digits = digits + 1
        }
        if current.is_ascii_alpha() {
            letters = letters + 1
        }
    }
    return digits * 10 + letters
}

# char 的码位构造与比较："A" 的码位是 65。
[export(name: "charFromCode")]
micro char_from_code() -> i64 {
    let upper: char = char::from(65 as u32)
    let text: utf8 = "A"
    if upper == text.character_at(0) {
        return 1
    }
    return 0
}
