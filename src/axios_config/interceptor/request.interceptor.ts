import { AxiosRequestConfig } from 'axios';
import { createAuthHeader } from 'utils/request';

/**
 * 配置校验成功 发送请求
 */
function onSuccess(config: AxiosRequestConfig) {
    const header = createAuthHeader() || {};
    if (!config.headers) {
        config.headers = {};
    }

    return {
        ...config,
        header,
    };
}

export {
    onSuccess,
};