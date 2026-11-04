namespace leetcode.unique_morse_code_words;

using std.collection;

# 26 个摩尔斯码是「按字母序的下标表」，字母序号同样走 `as u32` 码位相减。
# 每个词的码串用 `concat` 拼接（`Utf8Builder::append` 只收 `char` 或 `&Utf8Text`，
# 逐码拼接走 `concat` 更直接），去重交给 `HashSet<utf8>`。
[export(case: "camelCase")]
micro unique_morse_representations(words: ArrayList<utf8>) -> i64 {
    let mut table: ArrayList<utf8> = ArrayList::new(26)
    table.push(".-")
    table.push("-...")
    table.push("-.-.")
    table.push("-..")
    table.push(".")
    table.push("..-.")
    table.push("--.")
    table.push("....")
    table.push("..")
    table.push(".---")
    table.push("-.-")
    table.push(".-..")
    table.push("--")
    table.push("-.")
    table.push("---")
    table.push(".--.")
    table.push("--.-")
    table.push(".-.")
    table.push("...")
    table.push("-")
    table.push("..-")
    table.push("...-")
    table.push(".--")
    table.push("-..-")
    table.push("-.--")
    table.push("--..")

    let mut seen: HashSet<utf8> = HashSet::new()
    let mut i: usize = 0
    while i < words.length() {
        let word: utf8 = words⁅i⁆
        let mut code: utf8 = ""
        let mut k: usize = 0
        while k < word.length() {
            let letter: char = word⁅k⁆
            let slot: usize = ((letter as u32) - 97) as usize
            code = code.concat(table⁅slot⁆)
            k = k + 1
        }
        seen.insert(code)
        i = i + 1
    }
    return seen.length() as i64
}

class Solution {
    micro uniqueMorseRepresentations(self, words: ArrayList<utf8>): i64 {
        return unique_morse_representations(words)
    }
}
