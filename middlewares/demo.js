const jwt = require("jsonwebtoken");

let a = jwt.sign({ data: "hello" }, "secret", { expiresIn: "2s" });

console.log(a);

jwt.verify(a, "secret", function(err, decoded) {
  if (err) console.log(err);
  console.log(decoded);
});
