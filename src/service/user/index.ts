import axios from 'axios';
import { LoginToken } from 'common/const';
import { ServerRes } from 'type/request';

interface LoginModel {
    username: string;
    password: string;
}

// 登录
async function login(model: LoginModel) {
    return await axios.post<ServerRes<{token: string}>>('/api/users/login', model);
}

// 判断是否登录
async function isLogin() {
    const token = localStorage.getItem(LoginToken);
    if (!token) {
        return false;
    }
    const res = await axios.get<ServerRes<{isLogin: boolean}>>('/api/users/isLogin', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data.data.isLogin;
}

export {
    login,
    isLogin,
};