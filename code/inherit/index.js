
function Animal (name) {
    this.name = name;
    this.sleep = function () {
        console.log(this.name + '正在睡觉');
    }
}

Animal.prototype.eat = function (food) {
    console.log(this.name + '正在吃' + food);
}

// 1. 原型链继承
function Cat () {

}
Cat.prototype = new Animal('cat');
// Cat.prototype.name = 'cat';

var cat = new Cat();
console.log(cat.name);
console.log(cat.eat('fish'))



// 2. 构造继承
function Dog (name) {
    Animal.call(this);
    this.name = name;
}

var dog = new Dog('erha');

console.log(dog.name)
console.log(dog.sleep());
console.log(dog.eat('bone'))


// 3. 实例继承
function Fish (name) {
    var inst = new Animal(name);
    inst.color = color || 'red';
    return inst;
}

var fish = new Fish('shark');


// 4. 拷贝继承
function Pig (name) {
    var animal = new Animal();
    for (var k in animal) {
        Pig.prototype[k] = animal[k];
    }
    Pig.prototype.name = name;
}

var pig = new Pig('pechy');


// 5. 组合继承

function Monkey (name) {
    Animal.call(this);
    this.name = name;
}
Monkey.prototype = new Animal();
Monkey.prototype.constructor = Monkey;

var monkey = new Monkey('kingkong');


// 6. 寄生组合继承
function Lion (name) {
    Animal.call(this);
    this.name = name;
}

(function(){
    var Super = function(){}
    Super.prototype = Animal.prototype;
    Lion.prototype = new Super();
}())

var lion = new Lion('mufasa');
