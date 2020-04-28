//采用Object.defineProperty方法，通过数据劫持，完成数据监听器的创建
function Observer(data) {
    this.data = data;
    this.walk(data);
}
Observer.prototype = {
    walk: function(data) {
        var self = this;
        Object.keys(data).forEach(function(key) {
            self.defineReactive(data, key, data[key]);
        });
    },
    defineReactive: function(data, key, val) {
        var dep = new Dep();
        var childObj = observe(val); // 递归遍历所有子属性
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: function() {
                if (Dep.target) {  // 判断是否需要添加订阅者
                    dep.addSub(Dep.target);// 在这里添加一个订阅者
                }
                return val;
            },
            set: function(newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                dep.notify();// 数据变化，通知所有订阅者
            }
        });
    }
};

function observe(value) {
    if (!value || typeof value !== 'object') {
        return;
    }
    return new Observer(value);
};

function Dep () {
    this.subs = []; //存放订阅者的订阅器
}
Dep.prototype = {
    addSub: function(sub) {
        this.subs.push(sub);
    },
    notify: function() {
        this.subs.forEach(function(sub) {
            sub.update(); //触发订阅者的update()方法
        });
    }
};
Dep.target = null; //Dep 静态属性
