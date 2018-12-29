import axios from 'axios';
import { onSuccess } from './interceptor/request.interceptor';

let init = false;

/**
 * 初始化axios配置
 */
export function initAxios() {
    if (init) {
        return;
    }

    // 添加全局拦截
    axios.interceptors.request.use(onSuccess);

    init = true;
}