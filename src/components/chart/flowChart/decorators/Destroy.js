function Destroy () {
    return function (target, name, descriptor) {
        const oldValue = descriptor.value

        descriptor.value = function () {
            // 触发生命周期
            this.dispatchEvent('beforDestory')
            // 执行destroy方法
            oldValue.call(this, arguments)
            // 触发生命周期
            this.dispatchEvent('destoryed')
        }
    }   
}

export {
    Destroy
}