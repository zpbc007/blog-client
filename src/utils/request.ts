import * as UrlUtil from 'url';

/**
 * 替换路径参数
 * @param url 需要进行路径参数替换的url
 * @param pathVariables 路径参数对象
 */
export function replace(url: string, pathVariables: {
    [key: string]: string | number | boolean;
}) {
    const regex = /\{([^{^}]*)\}/g;
    return url.replace(regex, (match, $1) => {
        const variable = pathVariables[$1];
        return variable as string;
    });
}

/**
 * 添加查询字符串
 * @param  url
 * @param  queryVariables
 */
export function addQuery(url: string, queryVariables: {[key: string]: any}) {
    const urlObject = UrlUtil.parse(url, true);
    queryVariables = {
        ...queryVariables,
        ...urlObject.query,
    };
    return `${urlObject.pathname}?${Object.keys(queryVariables).map(element => {
        const val = queryVariables[element];
        // 过滤
        if (!val && val !== 0) {
            return null;
        }
        return `${element}=${queryVariables[element]}`;
    }).join('&')}`;
}