function addMethod (obj, name, func) {
    let old = obj[name]

    obj[name] = function () {
        if (func.length === arguments.length) {
            return func.apply(this, arguments)
        } else if (typeof old === 'function') {
            return old.apply(this, arguments)   
        }
    
    }
}