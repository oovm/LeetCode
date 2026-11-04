namespace leetcode.solution

using std.collection

# 题内触发点: 递归和类型 `BoolNode`，`And` / `Or` 的载荷是 `ArrayList<BoolNode>` 聚合体。
unite BoolNode {
    [constructor]
    Literal { value: bool }
    [constructor]
    Not { inner: BoolNode }
    [constructor]
    And { children: ArrayList<BoolNode> }
    [constructor]
    Or { children: ArrayList<BoolNode> }
}

micro is_digit_code(code: u8) -> bool {
    return code >= 48 && code <= 57
}

# 递归下降：`cursor⁅0⁆` 是共享游标，返回当前子表达式节点。
micro parse_bool(text: utf8, cursor: ArrayList<i64>) -> BoolNode {
    let position: i64 = cursor⁅0⁆
    let code: u8 = text.byte_at(position as usize)
    if code == 116 {
        cursor⁅0⁆ = position + 1
        return Literal { value: true }
    }
    if code == 102 {
        cursor⁅0⁆ = position + 1
        return Literal { value: false }
    }
    if code == 33 {
        cursor⁅0⁆ = position + 2
        let inner: BoolNode = parse_bool(text, cursor)
        cursor⁅0⁆ = cursor⁅0⁆ + 1
        return Not { inner: inner }
    }
    let children: ArrayList<BoolNode> = ArrayList::new(4)
    cursor⁅0⁆ = position + 2
    let mut running: bool = true
    while running {
        let child: BoolNode = parse_bool(text, cursor)
        children.push(child)
        let separator: u8 = text.byte_at(cursor⁅0⁆ as usize)
        if separator == 44 {
            cursor⁅0⁆ = cursor⁅0⁆ + 1
        } else {
            cursor⁅0⁆ = cursor⁅0⁆ + 1
            running = false
        }
    }
    if code == 38 {
        return And { children: children }
    }
    return Or { children: children }
}

# 对和类型做递归求值：每种变体一种 `case`，不再用整数魔法值。
micro eval_bool(node: BoolNode) -> bool {
    match node {
        case Literal(value): {
            return value
        }
        case Not(inner): {
            return !eval_bool(inner)
        }
        case And(children): {
            let mut acc: bool = true
            loop child in children {
                if !eval_bool(child) {
                    acc = false
                }
            }
            return acc
        }
        case Or(children): {
            let mut acc: bool = false
            loop child in children {
                if eval_bool(child) {
                    acc = true
                }
            }
            return acc
        }
    }
    return false
}

class Solution {
    [export(case: "parseBoolExpr")]
    micro parseBoolExpr(expression: utf8) -> bool {
        let cursor: ArrayList<i64> = ArrayList::new(1)
        cursor.push(0)
        let root: BoolNode = parse_bool(expression, cursor)
        return eval_bool(root)
    }
}
