namespace probe.trie;

using std.collection
using std.text

# 小写字母 Trie：`children` 按节点号 × 26 扁平展开，0 表示无子节点（根固定为 0）。
structure Trie {
    children: ArrayList<i64>
    terminal: ArrayList<i64>
    passed: ArrayList<i64>
    nodes: i64
}

micro trie_new(capacity: i64) -> Trie {
    let mut children: ArrayList<i64> = ArrayList::new((capacity * 26) as usize)
    let mut terminal: ArrayList<i64> = ArrayList::new(capacity as usize)
    let mut passed: ArrayList<i64> = ArrayList::new(capacity as usize)
    let mut slot: i64 = 0
    while slot < capacity * 26 {
        children.push(0)
        slot = slot + 1
    }
    let mut node: i64 = 0
    while node < capacity {
        terminal.push(0)
        passed.push(0)
        node = node + 1
    }
    return Trie { children: children, terminal: terminal, passed: passed, nodes: 1 }
}

micro trie_insert(mut trie: Trie, word: utf8) -> unit {
    let mut node: i64 = 0
    trie.passed.set_cardinal(0 as usize, trie.passed⁅0 as usize⁆ + 1)
    loop ch in word {
        let letter: i64 = (ch as u32) as i64 - 97
        let slot: usize = (node * 26 + letter) as usize
        let mut child: i64 = trie.children⁅slot⁆
        if child == 0 {
            child = trie.nodes
            trie.nodes = trie.nodes + 1
            trie.children.set_cardinal(slot, child)
        }
        node = child
        trie.passed.set_cardinal(node as usize, trie.passed⁅node as usize⁆ + 1)
    }
    trie.terminal.set_cardinal(node as usize, trie.terminal⁅node as usize⁆ + 1)
}

# 走完前缀后停在的节点，前缀不存在时返回 -1。
micro trie_walk(trie: Trie, word: utf8) -> i64 {
    let mut node: i64 = 0
    loop ch in word {
        let letter: i64 = (ch as u32) as i64 - 97
        let child: i64 = trie.children⁅(node * 26 + letter) as usize⁆
        if child == 0 {
            return -1
        }
        node = child
    }
    return node
}

micro trie_with_words(capacity: i64, words: [utf8]) -> Trie {
    let mut trie: Trie = trie_new(capacity)
    loop word in words {
        trie_insert(trie, word)
    }
    return trie
}

# 前缀计数：经过该节点的单词数。
[export(name: "triePrefixCount")]
micro trie_prefix_count() -> i64 {
    let words: [utf8] = ["car", "cart", "carbon", "dog", "dove"]
    let trie: Trie = trie_with_words(16, words)
    let node: i64 = trie_walk(trie, "ca")
    if node == -1 {
        return -1
    }
    return trie.passed⁅node as usize⁆
}

# 完全相同单词的计数，重复插入要累计。
[export(name: "trieExactCount")]
micro trie_exact_count() -> i64 {
    let words: [utf8] = ["cat", "cat", "cart", "cat"]
    let trie: Trie = trie_with_words(16, words)
    let node: i64 = trie_walk(trie, "cat")
    if node == -1 {
        return -1
    }
    return trie.terminal⁅node as usize⁆
}
