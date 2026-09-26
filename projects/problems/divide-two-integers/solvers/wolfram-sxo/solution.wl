divide[dividend_, divisor_] := Module[
  {neg = (dividend < 0 && divisor > 0) || (dividend > 0 && divisor < 0),
   a = If[dividend < 0, -dividend, dividend],
   b = If[divisor < 0, -divisor, divisor],
   q = 0, t, k},
  While[a >= b,
    t = b;
    k = 1;
    While[a >= t + t, t = t + t; k = k + k];
    a = a - t;
    q = q + k
  ];
  q = If[neg, -q, q];
  If[q > 2147483647, 2147483647, If[q < -2147483648, -2147483648, q]]
]
