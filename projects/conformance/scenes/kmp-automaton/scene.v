namespace probe.kmp_automaton;

using std.collection
using std.text

# 本场景只压 a/b 两字母表。
micro code_at(text: utf8, index: usize) -> i64 {
    return (text.character_at(index) as u32) as i64
}

micro symbol_code(code: i64) -> i64 {
    if code == 97 {
        return 0
    }
    return 1
}

micro prefix_table(pattern: utf8) -> ArrayList<i64> {
    let length: i64 = pattern.length() as i64
    let mut table: ArrayList<i64> = ArrayList::new(length as usize)
    let mut index: i64 = 0
    while index < length {
        table.push(0)
        index = index + 1
    }
    let mut matched: i64 = 0
    let mut cursor: i64 = 1
    while cursor < length {
        while matched > 0 && code_at(pattern, cursor as usize) != code_at(pattern, matched as usize) {
            matched = table⁅(matched - 1) as usize⁆
        }
        if code_at(pattern, cursor as usize) == code_at(pattern, matched as usize) {
            matched = matched + 1
        }
        table.set_cardinal(cursor as usize, matched)
        cursor = cursor + 1
    }
    return table
}

# KMP 自动机：状态 0..m，两列转移；失配沿前缀函数回退。
micro build_automaton(pattern: utf8) -> ArrayList<ArrayList<i64>> {
    let length: i64 = pattern.length() as i64
    let table: ArrayList<i64> = prefix_table(pattern)
    let mut states: ArrayList<ArrayList<i64>> = ArrayList::new((length + 1) as usize)
    let mut state: i64 = 0
    while state <= length {
        let mut row: ArrayList<i64> = ArrayList::new(2)
        row.push(0)
        row.push(0)
        states.push(row)
        state = state + 1
    }
    state = 0
    while state <= length {
        let mut symbol: i64 = 0
        while symbol < 2 {
            if state < length && symbol_code(code_at(pattern, state as usize)) == symbol {
                states⁅state as usize⁆.set_cardinal(symbol as usize, state + 1)
            } else if state == 0 {
                states⁅state as usize⁆.set_cardinal(symbol as usize, 0)
            } else {
                let fallback: i64 = table⁅(state - 1) as usize⁆
                let fallback_row: ArrayList<i64> = states⁅fallback as usize⁆
                states⁅state as usize⁆.set_cardinal(symbol as usize, fallback_row⁅symbol as usize⁆)
            }
            symbol = symbol + 1
        }
        state = state + 1
    }
    return states
}

structure MatchReport {
    first: i64
    count: i64
}

micro scan(text: utf8, pattern: utf8, states: ArrayList<ArrayList<i64>>) -> MatchReport {
    let end_state: i64 = pattern.length() as i64
    let mut state: i64 = 0
    let mut first: i64 = -1
    let mut count: i64 = 0
    let mut index: i64 = 0
    while index < text.length() as i64 {
        let code: i64 = symbol_code(code_at(text, index as usize))
        let row: ArrayList<i64> = states⁅state as usize⁆
        state = row⁅code as usize⁆
        if state == end_state {
            count = count + 1
            if first < 0 {
                first = index - end_state + 1
            }
        }
        index = index + 1
    }
    return MatchReport { first: first, count: count }
}

# "aba" 在 "abababa" 里出现在下标 0、2、4，共 3 次。
[export(name: "automatonMatchCount")]
micro automaton_match_count() -> i64 {
    let states: ArrayList<ArrayList<i64>> = build_automaton("aba")
    let report: MatchReport = scan("abababa", "aba", states)
    return report.count
}

# 第一次出现下标为 0。
[export(name: "automatonFirstIndex")]
micro automaton_first_index() -> i64 {
    let states: ArrayList<ArrayList<i64>> = build_automaton("aba")
    let report: MatchReport = scan("abababa", "aba", states)
    return report.first
}

# "aba" 的最短周期是 3 - pi[2] = 2。
[export(name: "patternPeriod")]
micro pattern_period() -> i64 {
    let table: ArrayList<i64> = prefix_table("aba")
    let length: i64 = 3
    return length - table⁅(length - 1) as usize⁆
}
