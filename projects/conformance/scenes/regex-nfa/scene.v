namespace probe.regex_nfa;

using std.collection
using std.text

# 手写 Thompson NFA：字面字符、任意字符 `.`、闭包 `*`，其余字符按字面处理。
unite RegexError {
    [constructor]
    DanglingRepeat {
        position: i64
    }
}

micro regex_error_code(error: RegexError) -> i64 {
    return match error {
        case DanglingRepeat(position): -1
    }
}

# 状态种类：0 字面、1 任意字符、2 分支（epsilon 两条出边）、3 接受。
structure Nfa {
    start: i64
    kinds: ArrayList<i64>
    values: ArrayList<i64>
    out1: ArrayList<i64>
    out2: ArrayList<i64>
}

micro nfa_new(capacity: i64) -> Nfa {
    return Nfa {
        start: -1,
        kinds: ArrayList::new(capacity as usize),
        values: ArrayList::new(capacity as usize),
        out1: ArrayList::new(capacity as usize),
        out2: ArrayList::new(capacity as usize)
    }
}

micro add_state(mut nfa: Nfa, kind: i64, value: i64, first: i64, second: i64) -> i64 {
    nfa.kinds.push(kind)
    nfa.values.push(value)
    nfa.out1.push(first)
    nfa.out2.push(second)
    return (nfa.kinds.length() as i64) - 1
}

micro code_at(pattern: utf8, position: i64) -> i64 {
    return (pattern.character_at(position as usize) as u32) as i64
}

# 递归编译：返回「从当前位置到串尾」这段模式的入口状态。
micro compile_rest(pattern: utf8, position: i64, next: i64, mut nfa: Nfa) -> Result<i64, RegexError> {
    let length: i64 = pattern.length() as i64
    if position >= length {
        return Fine(next)
    }
    let code: i64 = code_at(pattern, position)
    if code == 42 {
        let error: RegexError = DanglingRepeat(position)
        return Fail(error)
    }
    let mut starred: bool = false
    let mut after: i64 = position + 1
    if position + 1 < length && code_at(pattern, position + 1) == 42 {
        starred = true
        after = position + 2
    }
    let rest: Result<i64, RegexError> = compile_rest(pattern, after, next, nfa)
    let rest_start: i64 = match rest {
        case Fine(value): value
        case Fail(error): return Fail(error)
    }
    if starred {
        let mut consumed: i64 = 0
        if code == 46 {
            consumed = add_state(nfa, 1, 0, -1, -1)
        } else {
            consumed = add_state(nfa, 0, code, -1, -1)
        }
        let split: i64 = add_state(nfa, 2, 0, consumed, rest_start)
        nfa.out1.set_cardinal(consumed as usize, split)
        return Fine(split)
    }
    if code == 46 {
        let state: i64 = add_state(nfa, 1, 0, rest_start, -1)
        return Fine(state)
    }
    let state: i64 = add_state(nfa, 0, code, rest_start, -1)
    return Fine(state)
}

micro compile_pattern(pattern: utf8) -> Result<Nfa, RegexError> {
    let mut nfa: Nfa = nfa_new((pattern.length() as i64) * 2 + 2)
    let accept: i64 = add_state(nfa, 3, 0, -1, -1)
    let compiled: Result<i64, RegexError> = compile_rest(pattern, 0, accept, nfa)
    let start: i64 = match compiled {
        case Fine(value): value
        case Fail(error): return Fail(error)
    }
    nfa.start = start
    return Fine(nfa)
}

# epsilon 闭包：分支状态两条出边都可达。
micro add_epsilon(nfa: Nfa, state: i64, mut visited: ArrayList<i64>, mut result: ArrayList<i64>) -> unit {
    if visited⁅state as usize⁆ != 0 {
        return
    }
    visited.set_cardinal(state as usize, 1)
    let kind: i64 = nfa.kinds⁅state as usize⁆
    if kind == 2 {
        add_epsilon(nfa, nfa.out1⁅state as usize⁆, visited, result)
        add_epsilon(nfa, nfa.out2⁅state as usize⁆, visited, result)
    } else {
        result.push(state)
    }
}

micro start_set(nfa: Nfa) -> ArrayList<i64> {
    let mut visited: ArrayList<i64> = ArrayList::new(nfa.kinds.length())
    let mut index: usize = 0
    while index < nfa.kinds.length() {
        visited.push(0)
        index = index + 1
    }
    let mut result: ArrayList<i64> = ArrayList::new(nfa.kinds.length())
    add_epsilon(nfa, nfa.start, visited, result)
    return result
}

micro accepts(nfa: Nfa, seeds: ArrayList<i64>) -> bool {
    let mut visited: ArrayList<i64> = ArrayList::new(nfa.kinds.length())
    let mut index: usize = 0
    while index < nfa.kinds.length() {
        visited.push(0)
        index = index + 1
    }
    let mut closure: ArrayList<i64> = ArrayList::new(nfa.kinds.length())
    let mut seed_index: usize = 0
    while seed_index < seeds.length() {
        add_epsilon(nfa, seeds⁅seed_index⁆, visited, closure)
        seed_index = seed_index + 1
    }
    let mut found: bool = false
    let mut index: usize = 0
    while index < closure.length() {
        if nfa.kinds⁅closure⁅index⁆ as usize⁆ == 3 {
            found = true
        }
        index = index + 1
    }
    return found
}

# 从每个起点只用起点状态集驱动（不回溯）；到达接受状态即早返回（子串匹配语义）。
micro run_from(nfa: Nfa, text: utf8, offset: i64) -> bool {
    let mut current: ArrayList<i64> = start_set(nfa)
    let length: i64 = text.length() as i64
    let mut position: i64 = offset
    while position < length {
        let code: i64 = (text.character_at(position as usize) as u32) as i64
        let mut seeds: ArrayList<i64> = ArrayList::new(nfa.kinds.length())
        let mut index: usize = 0
        while index < current.length() {
            let state: i64 = current⁅index⁆
            let kind: i64 = nfa.kinds⁅state as usize⁆
            if kind == 0 && nfa.values⁅state as usize⁆ == code {
                seeds.push(nfa.out1⁅state as usize⁆)
            } else if kind == 1 {
                seeds.push(nfa.out1⁅state as usize⁆)
            }
            index = index + 1
        }
        let mut visited: ArrayList<i64> = ArrayList::new(nfa.kinds.length())
        let mut zero: usize = 0
        while zero < nfa.kinds.length() {
            visited.push(0)
            zero = zero + 1
        }
        current = ArrayList::new(nfa.kinds.length())
        let mut seed_index: usize = 0
        while seed_index < seeds.length() {
            add_epsilon(nfa, seeds⁅seed_index⁆, visited, current)
            seed_index = seed_index + 1
        }
        if current.length() == 0 {
            return false
        }
        if accepts(nfa, current) {
            return true
        }
        position = position + 1
    }
    return accepts(nfa, current)
}

micro contains_match(pattern: utf8, text: utf8) -> i64 {
    let compiled: Result<Nfa, RegexError> = compile_pattern(pattern)
    return match compiled {
        case Fine(nfa):
            let length: i64 = text.length() as i64
            let mut offset: i64 = 0
            let mut found: bool = false
            while offset <= length && !found {
                if run_from(nfa, text, offset) {
                    found = true
                }
                offset = offset + 1
            }
            if found { 1 } else { 0 }
        case Fail(error): regex_error_code(error)
    }
}

micro count_matches(pattern: utf8, text: utf8) -> i64 {
    let compiled: Result<Nfa, RegexError> = compile_pattern(pattern)
    return match compiled {
        case Fine(nfa):
            let length: i64 = text.length() as i64
            let mut offset: i64 = 0
            let mut total: i64 = 0
            while offset <= length {
                if run_from(nfa, text, offset) {
                    total = total + 1
                }
                offset = offset + 1
            }
            total
        case Fail(error): regex_error_code(error)
    }
}

# `abc` 在 `xabcx` 中出现。
[export(name: "nfaLiteralMatch")]
micro nfa_literal_match() -> i64 {
    return contains_match("abc", "xabcx")
}

# `ab*c` 以闭包匹配 `ac`。
[export(name: "nfaStarMatch")]
micro nfa_star_match() -> i64 {
    return contains_match("ab*c", "ac")
}

# `a.c` 以任意字符匹配 `abc`。
[export(name: "nfaDotMatch")]
micro nfa_dot_match() -> i64 {
    return contains_match("a.c", "abc")
}

# 不匹配。
[export(name: "nfaNoMatch")]
micro nfa_no_match() -> i64 {
    return contains_match("abc", "abd")
}

# `a*` 在 `aa` 上从 0/1/2 三个起点都能跑完。
[export(name: "nfaScanCount")]
micro nfa_scan_count() -> i64 {
    return count_matches("a*", "aa")
}

# 悬挂闭包：`*a` 走错误链返回 -1。
[export(name: "nfaDanglingCode")]
micro nfa_dangling_code() -> i64 {
    return contains_match("*a", "a")
}
