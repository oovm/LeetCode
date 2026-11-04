namespace leetcode.implement_trie_prefix_tree;

using std.collection;
using std.text;

# 边用整数键平铺存进一张哈希表：`key = 节点下标 * 26 + 字母偏移`。
# 这样单节点多分支不需要嵌套容器，节点下标即 `_ends` 的下标。
class Trie {
    _edges: HashMap<i64, i64>
    _ends: ArrayList<bool>
    _nodes: usize
}

imply Trie {
    micro new(): Self {
        let edges: HashMap<i64, i64> = HashMap::new(0)
        let mut ends: ArrayList<bool> = ArrayList::new(0)
        ends.push(false)
        return Trie {
            _edges: edges,
            _ends: ends,
            _nodes: 1,
        }
    }

    # 从根沿字符下行；返回末节点下标，缺边返回 `-1`。
    micro walk(self, word: utf8): i64 {
        let count: usize = word.length()
        let mut node: i64 = 0
        let mut index: usize = 0
        while index < count {
            let code: i64 = (word⁅index⁆ as u32) as i64 - 97
            let edge: i64 = node * 26 + code
            if !self._edges.contains_key(edge) {
                return -1
            }
            node = self._edges.get(edge).unwrap()
            index = index + 1
        }
        return node
    }

    micro insert(mut self, word: utf8): unit {
        let count: usize = word.length()
        let mut node: i64 = 0
        let mut index: usize = 0
        while index < count {
            let code: i64 = (word⁅index⁆ as u32) as i64 - 97
            let edge: i64 = node * 26 + code
            if !self._edges.contains_key(edge) {
                let fresh: i64 = self._nodes as i64
                self._nodes = self._nodes + 1
                let created: Option<i64> = self._edges.insert(edge, fresh)
                self._ends.push(false)
            }
            node = self._edges.get(edge).unwrap()
            index = index + 1
        }
        self._ends⁅node as usize⁆ = true
    }

    micro search(self, word: utf8): bool {
        let node: i64 = self.walk(word)
        if node == -1 {
            return false
        }
        return self._ends⁅node as usize⁆
    }

    micro starts_with(self, prefix: utf8): bool {
        let node: i64 = self.walk(prefix)
        return node != -1
    }
}
