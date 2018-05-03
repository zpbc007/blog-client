import { Rect } from './Rect'
import { Group } from './Group'

const LanePrefix = 'lane'

// 泳道
class Lane {
    constructor (parent, name, attrObj) {
        this.parent = parent

        new Group(parent, `${LanePrefix}-${name}`, {
            
        })
    }

}