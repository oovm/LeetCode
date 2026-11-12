namespace probe.recursive_unite_tree;

# 递归 unite：双载荷 `Branch` 直接持有自身类型。
unite Node {
    Empty

    [constructor]
    Leaf {
        value: i64
    }

    [constructor]
    Branch {
        left: Node
        right: Node
    }
}

micro tree_sum(tree: Node) -> i64 {
    match tree {
        case Empty: {
            return 0
        }
        case Leaf(value): {
            return value
        }
        case Branch(left, right): {
            return tree_sum(left) + tree_sum(right)
        }
    }
}

micro tree_depth(tree: Node) -> i64 {
    match tree {
        case Empty: {
            return 0
        }
        case Leaf(value): {
            return 1
        }
        case Branch(left, right): {
            let left_depth: i64 = tree_depth(left)
            let right_depth: i64 = tree_depth(right)
            if left_depth < right_depth {
                return right_depth + 1
            }
            return left_depth + 1
        }
    }
}

micro sample_tree() -> Node {
    return Branch(Leaf(1), Branch(Leaf(2), Leaf(3)))
}

[export(name: "treeSum")]
micro tree_sum_export() -> i64 {
    return tree_sum(sample_tree())
}

[export(name: "treeDepth")]
micro tree_depth_export() -> i64 {
    return tree_depth(sample_tree())
}
