-- example HTTP POST script which demonstrates setting the
-- HTTP method, body, and adding a header

wrk.method = "POST"
wrk.body   = [[{
  "expr": [
    "a = 1.2 * (2 + 4.5)",
    "a / 2",
    "5.08 cm in inch",
    "sin(45 deg) ^ 2",
    "9 / 3 + 2i",
    "b = [-1, 2; 3, 1]",
    "det(b)"
  ],
  "precision": 14
}]]
wrk.headers["Accept"] = "application/json"
wrk.headers["Content-Type"] = "application/json"
