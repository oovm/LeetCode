namespace probe.utf8_word_count;

using std.collection
using std.text

# `utf8` 直接作为 `HashMap` 键：按空白切分后逐词累加。
micro word_frequency(text: utf8) -> HashMap<utf8, i64> {
    let mut counts: HashMap<utf8, i64> = HashMap::new(16)
    let words: [utf8] = text.split_whitespace()
    let mut index: usize = 0
    while index < words.length() {
        let word: utf8 = words⁅index⁆
        let previous: Option<i64> = counts.insert(word, 1)
        let seen: i64 = previous.unwrap_or(0)
        counts.set(word, seen + 1)
        index = index + 1
    }
    return counts
}

micro frequency_of(counts: HashMap<utf8, i64>, word: utf8) -> i64 {
    let found: Option<i64> = counts.get(word)
    return match found {
        case Some(value): value
        case None: 0
    }
}

[export(name: "topWordCount")]
micro top_word_count() -> i64 {
    let text: utf8 = "the quick the fox the quick dog"
    let counts: HashMap<utf8, i64> = word_frequency(text)
    return frequency_of(counts, "the") * 100 + frequency_of(counts, "quick")
}

# 统计不同词数：读完一个词就把它的计数清零，重复词不再计数。
[export(name: "distinctWords")]
micro distinct_words() -> i64 {
    let text: utf8 = "a b a c b a"
    let mut counts: HashMap<utf8, i64> = word_frequency(text)
    let words: [utf8] = text.split_whitespace()
    let mut distinct: i64 = 0
    let mut index: usize = 0
    while index < words.length() {
        let word: utf8 = words⁅index⁆
        let seen: i64 = frequency_of(counts, word)
        if seen > 0 {
            distinct = distinct + 1
            counts.set(word, 0)
        }
        index = index + 1
    }
    return distinct
}
