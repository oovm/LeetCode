namespace leetcode.kill_process;

using std.collection;

# 用 pid 到数组下标的映射建立子进程邻接表，再用显式栈做先序 DFS（子进程逆序入栈），
# 避免深链递归爆栈，O(n)。
[export(case: "camelCase")]
micro kill_process(pid: ArrayList<i64>, ppid: ArrayList<i64>, kill: i64) -> ArrayList<i64> {
    let mut slots: HashMap<i64, i64> = HashMap::new(pid.length())
    let mut children: ArrayList<ArrayList<i64>> = ArrayList::new(pid.length())
    let mut index: usize = 0
    while index < pid.length() {
        slots.insert(pid⁅index⁆, index as i64)
        children.push(ArrayList::new(0))
        index = index + 1
    }
    index = 0
    let mut linked: usize = ppid.length()
    if pid.length() < linked {
        linked = pid.length()
    }
    while index < linked {
        let parent: i64 = ppid⁅index⁆
        if slots.contains_key(parent) {
            let slot: usize = slots.get(parent).unwrap() as usize
            let bucket: ArrayList<i64> = children⁅slot⁆
            bucket.push(pid⁅index⁆)
        }
        index = index + 1
    }

    let mut out: ArrayList<i64> = ArrayList::new(pid.length())
    let mut stack: ArrayList<i64> = ArrayList::new(pid.length())
    stack.push(kill)
    while stack.length() > 0 {
        let node: i64 = stack.pop().unwrap()
        out.push(node)
        if slots.contains_key(node) {
            let slot: usize = slots.get(node).unwrap() as usize
            let bucket: ArrayList<i64> = children⁅slot⁆
            let mut cursor: usize = bucket.length()
            while cursor > 0 {
                cursor = cursor - 1
                stack.push(bucket⁅cursor⁆)
            }
        }
    }
    return out
}

class Solution {
    micro killProcess(self, pid: ArrayList<i64>, ppid: ArrayList<i64>, kill: i64): ArrayList<i64> {
        return kill_process(pid, ppid, kill)
    }
}
