import { ContentItem } from 'components/card';

function stringCopy(str: string, time: number) {
    let result = str;
    for (let i = 0; i < time; i++) {
        result += str;
    }

    return result;
}

export function createContent(num = 100) {
    const result = [];
    for (let i = 0; i < num; i++) {
        result.push({
            id: `content-${i}`,
            title: `测试标题-${i}`,
            tagList: [{
                id: 'tag-1',
                title: 'spa',
                color: 'blue',
            }, {
                id: 'tag-2',
                title: 'vue',
                color: 'brown',
            }],
            createTime: '2017-1-1',
            updateTime: '2017-1-2',
            imgUrl: 'http://i.telehit.com/2017/04/taylor.jpg',
            content: stringCopy('使用travis自动部署执行测试并部署', Math.floor(Math.random() * 10 + 1)),
        });
    }

    return result;
}