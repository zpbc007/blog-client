function Create () {
    return function (target, name, descriptor) {
        // 保存原始方法
        const oldValue = descriptor.value
        descriptor.value = function () {
            console.log('before create')
            oldValue.call(this, arguments)
            console.log('created')
        }

        return descriptor
    }
}

export {
    Create
}