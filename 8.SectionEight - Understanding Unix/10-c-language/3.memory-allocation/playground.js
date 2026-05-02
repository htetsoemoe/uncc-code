let obj = { name: "Joe" };
let num = 1500;

function modify(o, n) {
  o.name = "Dylan";
  n = 1000;
}

console.log(obj);
console.log(num);
modify(obj, num);
console.log(obj);
console.log(num);
