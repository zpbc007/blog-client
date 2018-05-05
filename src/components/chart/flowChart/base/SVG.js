import { Base } from '../core/Base'
import { Create } from '../decorators/Create'
import { Destroy } from '../decorators/Destroy'


class SVG extends Base {

    constructor (el, config, className) {
        super(el, config, className)
        this.create('1', '2')    
    }

    @Create()
    create (arg1, arg2) {
        console.log('creating...')
    }

    @Destroy()
    destroy () {
        console.log('destorying...')
    }
}

export {
    SVG
}