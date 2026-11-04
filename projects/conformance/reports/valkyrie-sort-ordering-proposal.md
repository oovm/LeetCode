# Valkyrie 排序与序关系接口规格提案（G26 / G27）

本文件把 `G26`（自定义类型序关系无可用合同）与 `G27`（排序稳定性不是可声明的属性）
收敛成可以直接交给 `std` 落地的签名级提案。每条都标注「今天就能写」还是「需要编译器改」。
本文件不是解法清单，也不重复缺口账本里的触发题。

## 定稿决定

1. **走 Rust 方向，不采纳 C++ 方向。** `sort` 默认稳定，`sort_unstable` 显式选择不稳定。
   理由：错序是静默的，安全的那个必须是默认值，不能指望调用方记得传参。
2. **稳定性是入口属性，不是 `Comparable` 的属性。** `Comparable` 只描述序，不描述实现怎么排。
3. **`quick_sort` / `merge_sort` 退成 `private` 实现细节**，不再作为公开契约。
4. **`stable_sort` 不是可选项。** 它就是 `sort` 的定义本身；公开面只保留 `sort` 与 `sort_unstable`。
5. 凡是可能产生并列键的场景（2191 的 `Jumbled` 就是），用 `sort_unstable` 属于调用方
   明确承担错序风险；要用稳定语义就必须写 `sort`。

## 一、序关系合同

### 1.1 `Comparable`

```v
# std/source/operator/comparable.v
namespace std.operator;

imply Comparable<T> {
    infix `<`(self, other: T) -> bool
}
```

- **归属**：std。
- **落地判断**：**今天就能写**（新增 trait 声明即可；`std.operator` 已有 `Equal` / `Identical` /
  `Ordinal` / `Cardinal` 四个同形态合同）。
- **语义**：严格弱序。要求 `a < b` 与 `b < a` 不可同时为真；相等由 `Equal` 负责，不由本 trait 推断。
- **注意**：`Comparable` 不承载稳定性，也不承载「并列键谁先谁后」。后者属排序入口。

### 1.2 内建类型 impl

```v
imply i64: std::operator::Comparable {
    infix `<`(self, other: i64) -> bool
}

imply char: std::operator::Comparable {
    infix `<`(self, other: char) -> bool
}

imply utf8: std::operator::Comparable {
    infix `<`(self, other: utf8) -> bool      # 字节序（G13）
}
```

- **归属**：std。
- **落地判断**：`i64` / `char` **今天就能写**。`utf8` 也能写，但必须先定序语义——
  建议按 UTF-8 字节序逐字节比较，与 `equals` 保持同一层次；该决定登记在 G13。
- **风险**：`utf8` 的 `<` 一旦公开，`BTreeSet<utf8>` / `BTreeMap<utf8, V>` 立刻可用；
  这会把 G13 从「无 `<`」变成「有明确字节序」，需要在 std 文档里写死，避免另一个「同名不同义」。

### 1.3 用户类型实现合同

```v
structure Team {
    letter: u8
    ranks: ArrayList<i64>
}

imply Team: std::operator::Comparable {
    infix `<`(self, other: Team): bool {
        ...
    }
}
```

- **归属**：语言 / 编译器。
- **落地判断**：**需要编译器改**。今日只验证过 `imply` 承载标记式合同（`Equal` 等）；
  「用户 `imply` 体内定义 `infix <`、并让 `a < b` 按该 impl 派发」这条链路尚未验证。
  编译器需要做到：
  1. 解析 `imply` 体内的运算符定义；
  2. 在 `a < b` 处按 `Comparable` 找到 impl，而不是只认内建类型的 `<`；
  3. 找不到 impl 时报「缺 `Comparable`」而不是落到未定义运算符。
- **最小验收**：`structure Point { x: i64 y: i64 }` + `imply Point: Comparable` 后，
  `let p: Point; let q: Point; if p < q { }` 能编译并按 impl 求值。

## 二、排序入口

### 2.1 容器入口（就地）

```v
# std/source/collection/sort.v
namespace std.collection;

# 默认稳定；并列键保持输入次序
micro sort<T>(items: ArrayList<T>): unit
    where T: Equal & Comparable

# 显式不稳定；并列键次序不作保证
micro sort_unstable<T>(items: ArrayList<T>): unit
    where T: Equal & Comparable

# 调用方比较器版本：稳定性语义同上，序不来自类型
micro sort<T>(items: ArrayList<T>, cmp: micro(T, T) -> i32): unit
micro sort_unstable<T>(items: ArrayList<T>, cmp: micro(T, T) -> i32): unit

private micro quick_sort<T>(items: ArrayList<T>, cmp: micro(T, T) -> i32): unit
private micro merge_sort<T>(items: ArrayList<T>, cmp: micro(T, T) -> i32): unit
```

- **归属**：std。
- **落地判断**：**今天就能写**。现有 `quick_sort` / `merge_sort` 已具备全部实现，
  只需：改名为 `private`、新增四个公开入口、单参版本用 `where T: Equal & Comparable` 把
  `<` 转成 `micro(T, T) -> i32`。
- **实现建议**：
  - `sort` → `merge_sort`（稳定）；
  - `sort_unstable` → `quick_sort`（不稳定）；
  - 单参版本内部构造 `micro(a, b) -> i32 { if a < b { -1 } else if b < a { 1 } else { 0 } }`，
    避免让调用方写比较器。
- **约束检查**：`where T: Equal & Comparable` 能否在调用点报错，**需要编译器改**（见 1.3）。
  签名本身今天就能写。

### 2.2 非就地入口（返回副本）

```v
# 返回新容器，不修改入参
micro sorted<T>(items: ArrayList<T>): ArrayList<T>
    where T: Equal & Comparable

micro sorted_by<T>(items: ArrayList<T>, cmp: micro(T, T) -> i32): ArrayList<T>
```

- **归属**：std。
- **落地判断**：**今天就能写**（复制入参后调 `sort` / `sort` 的 cmp 版本）。
- **稳定性**：两者都稳定，与 `sort` 一致；没有 `sorted_unstable`——需要不稳定语义时
  调用方自己复制后调 `sort_unstable`，不必新增入口。
- **与 G11 的关系**：G11 记录的 `sorted_by` 缺失由此条覆盖；旧账本里的提案签名以本条为准。

### 2.3 定长 `Array<T>` 的就地入口（可选，不阻塞 G26）

```v
micro sort<T>(items: mut Array<T>): unit where T: Equal & Comparable
micro sort_unstable<T>(items: mut Array<T>): unit where T: Equal & Comparable
```

- **归属**：std。
- **落地判断**：**今天就能写**，但优先级低于 `ArrayList` 版本。`quick_sort` 的
  `swap` + 下标读写可直接搬到定长形态；`merge_sort` 会分配临时区，不适合定长（观察 7）。
- **口径**：定长版本只承诺就地排序，不提供 `sorted` / `sorted_by`。

## 三、有序容器约束

```v
# std/source/collection/sorted/BTreeSet.v
micro insert(mut self, value: T): bool
    where T: Equal & Comparable

# std/source/collection/sorted/BTreeMap.v
micro insert(mut self, key: K, value: V): Option<V>
    where K: Equal & Comparable
```

- **归属**：std 签名 + 编译器约束检查。
- **落地判断**：签名收紧 **今天就能写**；让调用点在缺 `Comparable` 时报错
  **需要编译器改**（当前 `BTreeSet::insert` 只写 `where T: Equal`，体内却裸调 `<`）。
- **验收**：自定义结构体作键、未实现 `Comparable` 时，`BTreeSet<Point>::insert` 在
  调用点报「缺 `Comparable`」，而不是在 `<` 求值处失败。

## 四、计数合同

```v
# std/source/operator/countable.v
imply Countable {
    micro count(self) -> usize
}

imply BitSet: std::operator::Countable {
    micro count(self) -> usize      # 置位总数（popcount）
}

# BitSet 规模入口
micro length(self) -> usize         # 容量位数
```

- **归属**：std。
- **落地判断**：**今天就能写**（`count` 对 `words` 逐字 popcount 求和，`length` 读容量）。
- **与 G25 的关系**：G25 还缺 `clone` / 迭代 / `to_bool_array` / `Equal`；本条只解决
  「基数可查」这一项，其余仍按 G25 推进。`count` 一旦存在，1239 的「分支复制后判重叠」
  才有完整形态。
- **命名冲突提示**：`ArrayList` 已有 `length()`；`BitSet` 同时给 `count()`（置位数）与
  `length()`（容量）时，必须在 std 文档里写清两者不同义，避免与 `ArrayList.length()` 混读。

## 五、落地顺序与判断汇总

| # | 项目 | 归属 | 今天就能写 / 需要编译器改 |
| --- | --- | --- | --- |
| 1 | `Comparable` trait 声明 | std | 今天就能写 |
| 2 | `i64` / `char` 的 `Comparable` impl | std | 今天就能写 |
| 3 | `utf8` 的 `Comparable` impl（字节序） | std | 今天就能写，先定 G13 语义 |
| 4 | 用户类型 `imply ... { infix < }` | 编译器 | **需要编译器改** |
| 5 | `a < b` 按 `Comparable` 派发 | 编译器 | **需要编译器改** |
| 6 | `sort` / `sort_unstable`（就地，含 cmp 版本） | std | 今天就能写 |
| 7 | `sorted` / `sorted_by` | std | 今天就能写 |
| 8 | `where T: Equal & Comparable` 在调用点生效 | 编译器 | **需要编译器改** |
| 9 | `BTreeSet` / `BTreeMap` 约束收紧 | std + 编译器 | 签名今天能写，检查需编译器改 |
| 10 | `Countable` + `BitSet::count` / `length` | std | 今天就能写 |
| 11 | `quick_sort` / `merge_sort` 降为 `private` | std | 今天就能写 |

## 六、落地后需要复跑的批次

- `R14`：56 / 435 / 1235 / 452 / 1710 / 1029 / 1626（自定义记录排序）+ 694（自定义键进 `BTreeSet`）。
- `R15`：1366 / 2191 / 1691 / 2251 / 1751（自定义记录排序）+ 1561（`i64` 单参排序）；
  2191 必须落在 `sort`（稳定），不得写 `sort_unstable`。
- 复跑前把各题 `order_items` 垫片统一改成 `sort(items)`；垫片只是临时形态，
  合同落地后可直接删除。

## 七、未决问题

1. **`Comparable` 与 `Ordinal` / `Cardinal` 的边界**：现有 `Ordinal` 是否就是「可比较」，
   还是仅作序号语义？若二者重叠，应先合并再新增，避免出现两套序。
2. **`utf8` 的序**：字节序、码位序、还是 locale 序？本提案默认字节序，需在 G13 定稿。
3. **不稳定排序的文档义务**：`sort_unstable` 必须在 std 文档里写「并列键次序不作保证」，
   不能只靠入口名暗示。
4. **失败诊断**：缺 `Comparable` 时，编译器应报出缺失的 trait 与类型，而不是运算符未定义；
   这条决定 G26 能否被自查。
