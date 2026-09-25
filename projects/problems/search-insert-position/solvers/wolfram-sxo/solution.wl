searchInsert[nums_, target_] := Module[{lo = 0, hi = Length[nums] - 1},
  While[lo <= hi,
    mid = Quotient[lo + hi, 2];
    If[nums[[mid + 1]] < target, lo = mid + 1, hi = mid - 1]
  ];
  lo
]
