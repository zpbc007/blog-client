import * as d3 from 'd3' 

const DefaultValue = {
    marginTop: 10,
    marginRight: 20,
    marginBottom: 10,
    marginLeft: 20,
    style: `
        position: absolute;
        line-height: 16px;
        font-size: 13px;
        font-family: 微软雅黑;
        font-weight: normal;
        font-style: normal;
        text-align: center; 
        color: rgb(50, 50, 50); 
        text-decoration: 'none;
        opacity: 0.8;
        resize: none;
    `
}

class Text {
    constructor (parent, name, config) {
        this.parent = parent
        this.d3Parent = d3.select(parent)

        
    }
}

export {
    Text
}