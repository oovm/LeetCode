namespace leetcode.solution

using std.collection
using std.text

# 题内触发点: G12 —— `HashSet::new()` 没有容量提示入口；本解按真实签名写，容量只能靠摊还增长。
micro build_candidate(word: utf8, position: usize, letter: u8) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(word.byte_length())
    let mut index: usize = 0
    while index < word.byte_length() {
        if index == position {
            builder.append(char::from(letter as u32))
        } else {
            builder.append(char::from(word.byte_at(index) as u32))
        }
        index = index + 1
    }
    return builder.build()
}

class Solution {
    [export(case: "ladderLength")]
    micro ladderLength(beginWord: utf8, endWord: utf8, wordList: ArrayList<utf8>) -> i64 {
        let mut dictionary: HashSet<utf8> = HashSet::new()
        loop word in wordList {
            dictionary.insert(word)
        }
        if !dictionary.contains(endWord) {
            return 0
        }
        let mut seen: HashSet<utf8> = HashSet::new()
        seen.insert(beginWord)
        let mut frontier: Deque<utf8> = Deque::new()
        frontier.push_back(beginWord)
        let mut steps: i64 = 1
        while frontier.length() > 0 {
            let level_size: usize = frontier.length()
            let mut taken: usize = 0
            while taken < level_size {
                let current: utf8 = frontier.pop_front().unwrap()
                if current.equals(endWord) {
                    return steps
                }
                let width: usize = current.byte_length()
                let mut position: usize = 0
                while position < width {
                    let mut letter: u8 = 97
                    while letter <= 122 {
                        let candidate: utf8 = build_candidate(current, position, letter)
                        if dictionary.contains(candidate) && !seen.contains(candidate) {
                            seen.insert(candidate)
                            frontier.push_back(candidate)
                        }
                        letter = letter + 1
                    }
                    position = position + 1
                }
                taken = taken + 1
            }
            steps = steps + 1
        }
        return 0
    }
}
