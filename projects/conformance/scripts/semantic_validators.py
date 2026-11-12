"""题面语义校验器（`validator-required` 比较模式的 Python lane 实现）。

与 `src/domain/semantic-validators.ts` 一一对应，两边必须保持一致：

- 校验器只判定 `actual` 是否满足题面约束，不把 `expected` 当作唯一正确答案；
- 多解题目禁止用 JSON/规范化比较，缺失校验器即结构化失败。
"""
from __future__ import annotations

import json
from typing import Any

_MAX_SAFE = 9007199254740991


def _to_number(value: Any) -> int | float | None:
    # bool 是 int 子类，布尔不算整数叶子。
    if isinstance(value, bool):
        return None
    if isinstance(value, int):
        return value
    if isinstance(value, float):
        return value if value == value and value not in (float("inf"), float("-inf")) else None
    if isinstance(value, str) and value.lstrip("-").isdigit():
        parsed = int(value)
        return parsed if abs(parsed) <= _MAX_SAFE else None
    return None


def _int_array(value: Any) -> list[Any] | None:
    if not isinstance(value, list):
        return None
    out: list[Any] = []
    for item in value:
        parsed = _to_number(item)
        if parsed is None:
            return None
        out.append(parsed)
    return out


def _int_matrix(value: Any) -> list[list[Any]] | None:
    if not isinstance(value, list):
        return None
    out: list[list[Any]] = []
    for row in value:
        parsed = _int_array(row)
        if parsed is None:
            return None
        out.append(parsed)
    return out


def _stable_value(value: Any) -> str:
    if isinstance(value, list):
        return "[" + ",".join(_stable_value(item) for item in value) + "]"
    if isinstance(value, dict):
        return (
            "{"
            + ",".join(
                f"{json.dumps(key)}:{_stable_value(value[key])}" for key in sorted(value.keys())
            )
            + "}"
        )
    return json.dumps(value, ensure_ascii=False)


def _same_multiset(left: list[Any], right: list[Any]) -> bool:
    if len(left) != len(right):
        return False
    return sorted(_stable_value(item) for item in left) == sorted(_stable_value(item) for item in right)


def _arg_ints(args: dict[str, Any], key: str) -> list[Any] | None:
    return _int_array(args.get(key))


def _validate_advantage_shuffle(actual: Any, _expected: Any, args: dict[str, Any]) -> str | None:
    nums1 = _arg_ints(args, "nums1")
    nums2 = _arg_ints(args, "nums2")
    shuffles = _int_array(actual)
    if not nums1 or not nums2 or not shuffles:
        return "答案或入参不是整数数组"
    if len(nums1) != len(nums2) or len(shuffles) != len(nums1):
        return "答案或入参长度不一致"
    # 题面返回的是 nums1 的重排；优势数是 shuffles[i] > nums2[i] 的个数。
    if not _same_multiset(nums1, shuffles):
        return "答案不是 nums1 的排列"
    sorted1 = sorted(nums1)
    sorted2 = sorted(nums2)
    right = 0
    max_wins = 0
    for value in sorted1:
        if right < len(sorted2) and value > sorted2[right]:
            max_wins += 1
            right += 1
    wins = sum(1 for index, value in enumerate(shuffles) if value > nums2[index])
    if wins != max_wins:
        return f"优势数 {wins}，题面上限 {max_wins}"
    return None


def _validate_gas_station(actual: Any, _expected: Any, args: dict[str, Any]) -> str | None:
    gas = _arg_ints(args, "gas")
    cost = _arg_ints(args, "cost")
    start = _to_number(actual)
    if not gas or not cost or start is None:
        return "答案或入参不是整数"
    if len(gas) == 0 or len(cost) != len(gas):
        return "gas/cost 长度不一致"
    if start == -1:
        total = sum(gas[index] - cost[index] for index in range(len(gas)))
        return "总盈余非负，不应返回 -1" if total >= 0 else None
    if not isinstance(start, int) or start < 0 or start >= len(gas):
        return "起点越界"
    tank = 0
    for step in range(len(gas)):
        index = (start + step) % len(gas)
        tank += gas[index] - cost[index]
        if tank < 0:
            return f"从 {start} 出发第 {step + 1} 站亏空"
    return None


def _validate_course_schedule_two(actual: Any, _expected: Any, args: dict[str, Any]) -> str | None:
    num_courses = _to_number(args.get("numCourses"))
    prerequisites = _int_matrix(args.get("prerequisites"))
    order = _int_array(actual)
    if num_courses is None or prerequisites is None or order is None:
        return "答案或入参形态不合法"
    adjacency: list[list[int]] = [[] for _ in range(num_courses)]
    indegree = [0] * num_courses
    edges: list[tuple[int, int]] = []
    for pair in prerequisites:
        if len(pair) != 2:
            return "prerequisites 单元不是二元组"
        course, prerequisite = pair
        if course < 0 or course >= num_courses or prerequisite < 0 or prerequisite >= num_courses:
            return "prerequisites 越界"
        edges.append((prerequisite, course))
        adjacency[prerequisite].append(course)
        indegree[course] += 1
    degrees = indegree[:]
    queue = [node for node in range(num_courses) if degrees[node] == 0]
    visited = 0
    head = 0
    while head < len(queue):
        node = queue[head]
        head += 1
        visited += 1
        for nxt in adjacency[node]:
            degrees[nxt] -= 1
            if degrees[nxt] == 0:
                queue.append(nxt)
    acyclic = visited == num_courses
    if not acyclic:
        return None if len(order) == 0 else "课程图有环，题面要求返回空数组"
    if len(order) != num_courses:
        return f"拓扑序长度 {len(order)}，题面要求 {num_courses}"
    seen: set[int] = set()
    for course in order:
        if course < 0 or course >= num_courses or course in seen:
            return "拓扑序存在重复或越界课程"
        seen.add(course)
    positions = {course: index for index, course in enumerate(order)}
    for before, after in edges:
        if positions[before] > positions[after]:
            return f"先修关系不满足：{before} 应在 {after} 之前"
    return None


def _validate_di_string_match(actual: Any, _expected: Any, args: dict[str, Any]) -> str | None:
    pattern = args.get("s")
    values = _int_array(actual)
    if not isinstance(pattern, str) or values is None:
        return "答案或入参形态不合法"
    size = len(pattern) + 1
    if len(values) != size:
        return f"答案长度 {len(values)}，题面要求 {size}"
    seen: set[int] = set()
    for value in values:
        if value < 0 or value >= size or value in seen:
            return "答案不是 0..n 的排列"
        seen.add(value)
    for index, char in enumerate(pattern):
        if char == "I":
            if not values[index] < values[index + 1]:
                return f"第 {index} 位不满足 I"
        elif not values[index] > values[index + 1]:
            return f"第 {index} 位不满足 D"
    return None


def _cross(origin: list[Any], a: list[Any], b: list[Any]) -> Any:
    return (a[0] - origin[0]) * (b[1] - origin[1]) - (a[1] - origin[1]) * (b[0] - origin[0])


def _validate_erect_the_fence(actual: Any, _expected: Any, args: dict[str, Any]) -> str | None:
    trees = _int_matrix(args.get("trees"))
    fence = _int_matrix(actual)
    if trees is None or fence is None:
        return "答案或入参形态不合法"
    unique_trees = [
        [int(part) for part in key.split(",")]
        for key in dict.fromkeys(",".join(str(value) for value in point) for point in trees)
    ]
    ordered = sorted(unique_trees, key=lambda point: (point[0], point[1]))
    if len(ordered) <= 2:
        boundary = {",".join(str(value) for value in point) for point in ordered}
        for point in fence:
            if ",".join(str(value) for value in point) not in boundary:
                return "围栏端点不完整"
        for key in boundary:
            if not any(",".join(str(value) for value in point) == key for point in fence):
                return "围栏端点不完整"
        return None
    lower: list[list[Any]] = []
    for point in ordered:
        while len(lower) >= 2 and _cross(lower[-2], lower[-1], point) <= 0:
            lower.pop()
        lower.append(point)
    upper: list[list[Any]] = []
    for index in range(len(ordered) - 1, -1, -1):
        point = ordered[index]
        while len(upper) >= 2 and _cross(upper[-2], upper[-1], point) <= 0:
            upper.pop()
        upper.append(point)
    hull = lower[:-1] + upper[:-1]
    hull_edges = [(hull[index], hull[(index + 1) % len(hull)]) for index in range(len(hull))]

    def on_edge(point: list[Any], start: list[Any], end: list[Any]) -> bool:
        if _cross(start, end, point) != 0:
            return False
        return (
            min(start[0], end[0]) <= point[0] <= max(start[0], end[0])
            and min(start[1], end[1]) <= point[1] <= max(start[1], end[1])
        )

    expected_boundary = {",".join(str(value) for value in point) for point in hull}
    for point in ordered:
        if any(on_edge(point, start, end) for start, end in hull_edges):
            expected_boundary.add(",".join(str(value) for value in point))
    fence_set = {",".join(str(value) for value in point) for point in fence}
    missing = [key for key in expected_boundary if key not in fence_set]
    if missing:
        return f"缺少围栏点 {' '.join(missing[:3])}"
    for key in fence_set:
        if key not in expected_boundary:
            return f"围栏包含非边界点 {key}"
    return None


def _validate_fair_candy_swap(actual: Any, _expected: Any, args: dict[str, Any]) -> str | None:
    alice = _arg_ints(args, "aliceSizes")
    bob = _arg_ints(args, "bobSizes")
    if alice is None or bob is None:
        return "入参形态不合法"
    sum_alice = sum(alice)
    sum_bob = sum(bob)
    bob_set = set(bob)
    exists = False
    for take in alice:
        give = take - (sum_alice - sum_bob) / 2
        if give == int(give) and int(give) in bob_set:
            exists = True
            break
    if not exists:
        return None if actual is None or (isinstance(actual, list) and len(actual) == 0) else "题面无合法交换，答案应为 null"
    swap = _int_array(actual)
    if swap is None or len(swap) != 2:
        return "答案或入参形态不合法"
    take, give = swap
    if take not in alice or give not in bob_set:
        return "交换值不属于对应数组"
    if sum_alice - take + give != sum_bob - give + take:
        return "交换后两堆总和仍不相等"
    return None


def _validate_index_value_difference(actual: Any, args: dict[str, Any]) -> str | None:
    nums = _arg_ints(args, "nums")
    index_difference = _to_number(args.get("indexDifference"))
    value_difference = _to_number(args.get("valueDifference"))
    answer = _int_array(actual)
    if nums is None or index_difference is None or value_difference is None or answer is None:
        return "答案或入参形态不合法"
    if len(answer) != 2:
        return "答案不是二元组"
    left, right = answer
    no_pair = left == -1 and right == -1
    min_index = -1
    max_index = -1
    min_value = float("inf")
    max_value = float("-inf")
    exists = False
    for index, value in enumerate(nums):
        if index - index_difference >= 0:
            candidate = index - index_difference
            if nums[candidate] < min_value:
                min_value = nums[candidate]
                min_index = candidate
            if nums[candidate] > max_value:
                max_value = nums[candidate]
                max_index = candidate
        if min_index >= 0 and abs(value - min_value) >= value_difference:
            exists = True
        if max_index >= 0 and abs(value - max_value) >= value_difference:
            exists = True
    if not exists:
        return None if no_pair else "题面无合法对，应返回 [-1,-1]"
    if no_pair:
        return "题面存在合法对，不能返回 [-1,-1]"
    if left < 0 or right < 0 or left >= len(nums) or right >= len(nums):
        return "答案下标越界"
    if abs(left - right) < index_difference:
        return "下标差不足"
    if abs(nums[left] - nums[right]) < value_difference:
        return "值差不足"
    return None


def _validate_find_missing_observations(actual: Any, _expected: Any, args: dict[str, Any]) -> str | None:
    rolls = _arg_ints(args, "rolls")
    mean = _to_number(args.get("mean"))
    n = _to_number(args.get("n"))
    if rolls is None or mean is None or n is None:
        return "入参形态不合法"
    total = len(rolls) + n
    missing_sum = mean * total - sum(rolls)
    if missing_sum < n or missing_sum > 6 * n:
        return None if isinstance(actual, list) and len(actual) == 0 else "题面无可行缺失观测，应返回空数组"
    observations = _int_array(actual)
    if observations is None:
        return "答案不是整数数组"
    if len(observations) != n:
        return f"缺失观测长度 {len(observations)}，题面要求 {n}"
    for value in observations:
        if value < 1 or value > 6:
            return "缺失观测不在 1..6"
    actual_sum = sum(rolls) + sum(observations)
    if actual_sum != mean * total:
        return f"总和 {actual_sum}，题面要求 {mean * total}"
    return None


def _validate_unique_sum_zero(actual: Any, _expected: Any, args: dict[str, Any]) -> str | None:
    n = _to_number(args.get("n"))
    values = _int_array(actual)
    if n is None or values is None:
        return "答案或入参形态不合法"
    if len(values) != n:
        return f"长度 {len(values)}，题面要求 {n}"
    if len(set(values)) != len(values):
        return "答案存在重复整数"
    if sum(values) != 0:
        return "答案总和不等于 0"
    return None


def _validate_unique_binary_string(actual: Any, _expected: Any, args: dict[str, Any]) -> str | None:
    nums = args.get("nums")
    if not isinstance(nums, list) or any(not isinstance(item, str) for item in nums):
        return "入参不是二进制字符串数组"
    size = len(nums)
    if not isinstance(actual, str):
        return "答案不是字符串"
    if len(actual) != size or any(char not in "01" for char in actual):
        return f"答案必须是长度 {size} 的二进制串"
    if actual in nums:
        return "答案已出现在 nums 中"
    return None


def _validate_gray_code(actual: Any, _expected: Any, args: dict[str, Any]) -> str | None:
    n = _to_number(args.get("n"))
    values = _int_array(actual)
    if n is None or n < 0 or n > 20 or values is None:
        return "答案或入参形态不合法"
    size = 2 ** n
    if len(values) != size:
        return f"长度 {len(values)}，题面要求 {size}"
    seen: set[int] = set()
    for value in values:
        if value < 0 or value >= size or value in seen:
            return "答案不是 0..2^n-1 的排列"
        seen.add(value)
    if values[0] != 0:
        return "首项必须是 0"
    for index in range(len(values) - 1):
        if bin(values[index] ^ values[index + 1]).count("1") != 1:
            return f"第 {index} 与 {index + 1} 项不是单 bit 变化"
    return None


def _validate_matrix_distance_order(actual: Any, _expected: Any, args: dict[str, Any]) -> str | None:
    rows = _to_number(args.get("rows"))
    cols = _to_number(args.get("cols"))
    r_center = _to_number(args.get("rCenter"))
    c_center = _to_number(args.get("cCenter"))
    cells = _int_matrix(actual)
    if rows is None or cols is None or r_center is None or c_center is None or cells is None:
        return "答案或入参形态不合法"
    if len(cells) != rows * cols:
        return f"格子数 {len(cells)}，题面要求 {rows * cols}"
    seen: set[str] = set()
    previous_distance = -1
    for cell in cells:
        if len(cell) != 2 or cell[0] < 0 or cell[0] >= rows or cell[1] < 0 or cell[1] >= cols:
            return "答案包含越界格子"
        key = f"{cell[0]},{cell[1]}"
        if key in seen:
            return "答案包含重复格子"
        seen.add(key)
        distance = abs(cell[0] - r_center) + abs(cell[1] - c_center)
        if distance < previous_distance:
            return "格子没有按曼哈顿距离非降序排列"
        previous_distance = distance
    return None


def _validate_restore_the_array(actual: Any, _expected: Any, args: dict[str, Any]) -> str | None:
    pairs = _int_matrix(args.get("adjacentPairs"))
    array = _int_array(actual)
    if pairs is None or array is None:
        return "答案或入参形态不合法"
    if len(array) != len(pairs) + 1:
        return f"答案长度 {len(array)}，题面要求 {len(pairs) + 1}"
    expected_edges = [f"{pair[0]},{pair[1]}" if pair[0] <= pair[1] else f"{pair[1]},{pair[0]}" for pair in pairs]
    actual_edges: list[str] = []
    for index in range(len(array) - 1):
        left, right = array[index], array[index + 1]
        actual_edges.append(f"{left},{right}" if left <= right else f"{right},{left}")
    if not _same_multiset(expected_edges, actual_edges):
        return "答案的相邻对与输入不匹配"
    return None


def _validate_smallest_sufficient_team(actual: Any, _expected: Any, args: dict[str, Any]) -> str | None:
    skills = args.get("req_skills")
    people = args.get("people")
    team = _int_array(actual)
    if not isinstance(skills, list) or not isinstance(people, list) or team is None:
        return "答案或入参形态不合法"
    skill_index: dict[str, int] = {}
    for skill in skills:
        if not isinstance(skill, str):
            return "req_skills 不是字符串数组"
        skill_index[skill] = len(skill_index)
    masks: list[int] = []
    for person in people:
        if not isinstance(person, list):
            return "people 单元不是技能数组"
        mask = 0
        for skill in person:
            index = skill_index.get(skill) if isinstance(skill, str) else None
            if index is None:
                return f"people 包含未知技能 {skill}"
            mask |= 1 << index
        masks.append(mask)
    full = (1 << len(skills)) - 1
    best = [float("inf")] * (full + 1)
    best[0] = 0
    for mask in masks:
        nxt = best[:]
        for covered in range(full + 1):
            if best[covered] == float("inf"):
                continue
            merged = covered | mask
            if best[covered] + 1 < nxt[merged]:
                nxt[merged] = best[covered] + 1
        best = nxt
    if best[full] == float("inf"):
        return "题面无可行团队"
    seen: set[int] = set()
    covered = 0
    for index in team:
        if index < 0 or index >= len(people) or index in seen:
            return "团队下标越界或重复"
        seen.add(index)
        covered |= masks[index]
    if covered != full:
        return "团队未覆盖全部技能"
    if len(team) != best[full]:
        return f"团队规模 {len(team)}，题面最小 {best[full]}"
    return None


def _validate_frequency_sort(actual: Any, _expected: Any, args: dict[str, Any]) -> str | None:
    source = args.get("s")
    if not isinstance(source, str) or not isinstance(actual, str):
        return "答案或入参形态不合法"
    if not _same_multiset(list(source), list(actual)):
        return "答案不是原字符串的字符重排"
    counts: dict[str, int] = {}
    for char in actual:
        counts[char] = counts.get(char, 0) + 1
    runs: list[dict[str, Any]] = []
    for char in actual:
        if runs and runs[-1]["char"] == char:
            runs[-1]["count"] += 1
        else:
            runs.append({"char": char, "count": 1})
    if len(runs) != len(counts):
        return "同一字符被拆成多段"
    for run in runs:
        if counts[run["char"]] != run["count"]:
            return "字符段长度与原串频次不一致"
    for index in range(1, len(runs)):
        if runs[index - 1]["count"] < runs[index]["count"]:
            return "字符频次没有按非升序排列"
    return None


def _validate_parity_partition(actual: Any, _expected: Any, args: dict[str, Any]) -> str | None:
    nums = _arg_ints(args, "nums")
    values = _int_array(actual)
    if nums is None or values is None:
        return "答案或入参形态不合法"
    if not _same_multiset(nums, values):
        return "答案不是原数组的排列"
    seen_odd = False
    for value in values:
        if value % 2 != 0:
            seen_odd = True
        elif seen_odd:
            return "偶数出现在奇数之后"
    return None


def _validate_parity_alternating(actual: Any, _expected: Any, args: dict[str, Any]) -> str | None:
    nums = _arg_ints(args, "nums")
    values = _int_array(actual)
    if nums is None or values is None:
        return "答案或入参形态不合法"
    if not _same_multiset(nums, values):
        return "答案不是原数组的排列"
    for index, value in enumerate(values):
        if value % 2 != index % 2:
            return f"第 {index} 位奇偶性与下标不一致"
    return None


def _validate_anagram_mappings(actual: Any, _expected: Any, args: dict[str, Any]) -> str | None:
    nums1 = _int_array(args.get("nums1"))
    nums2 = _int_array(args.get("nums2"))
    mapping = _int_array(actual)
    if not nums1 or not nums2 or not mapping:
        return "答案或入参形态不合法"
    if len(mapping) != len(nums1):
        return f"映射长度 {len(mapping)}，题面要求 {len(nums1)}"
    # LC 760：mapping[i] = j 只要求 nums2[j] == nums1[i]；重复值时「任意合法 j」都可。
    for index, target in enumerate(mapping):
        if not isinstance(target, int) or target < 0 or target >= len(nums2):
            return f"第 {index} 项下标越界"
        if nums2[target] != nums1[index]:
            return f"第 {index} 项映射到值 {nums2[target]}，题面要求 {nums1[index]}"
    return None


_VALIDATORS = {
    "advantage-shuffle": _validate_advantage_shuffle,
    "find-anagram-mappings": _validate_anagram_mappings,
    "gas-station": _validate_gas_station,
    "course-schedule-ii": _validate_course_schedule_two,
    "di-string-match": _validate_di_string_match,
    "erect-the-fence": _validate_erect_the_fence,
    "fair-candy-swap": _validate_fair_candy_swap,
    "find-indices-with-index-and-value-difference-i": lambda actual, _expected, args: _validate_index_value_difference(actual, args),
    "find-indices-with-index-and-value-difference-ii": lambda actual, _expected, args: _validate_index_value_difference(actual, args),
    "find-missing-observations": _validate_find_missing_observations,
    "find-n-unique-integers-sum-up-to-zero": _validate_unique_sum_zero,
    "find-unique-binary-string": _validate_unique_binary_string,
    "gray-code": _validate_gray_code,
    "matrix-cells-in-distance-order": _validate_matrix_distance_order,
    "restore-the-array-from-adjacent-pairs": _validate_restore_the_array,
    "smallest-sufficient-team": _validate_smallest_sufficient_team,
    "sort-characters-by-frequency": _validate_frequency_sort,
    "sort-array-by-parity": _validate_parity_partition,
    "sort-array-by-parity-ii": _validate_parity_alternating,
}


def has_semantic_validator(problem_id: str) -> bool:
    return problem_id in _VALIDATORS


def validate_semantic(problem_id: str, actual: Any, args: dict[str, Any]) -> str | None:
    validator = _VALIDATORS.get(problem_id)
    if validator is None:
        return f"题目 {problem_id} 没有语义校验器"
    return validator(actual, None, args)
