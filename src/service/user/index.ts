import axios from 'axios';
import { LoginToken } from 'common/const';
import { ServerRes } from 'type/request';
import { createAuthHeader } from 'utils/request';

interface LoginModel {
    account: string;
    password: string;
}

export interface UserModel {
    id?: string;
    account?: string;
    avatar?: string;
    nickname?: string;
    enable?: boolean;
    isSuper?: boolean;
}

export interface ResetPassModel {
    id: number;
    password: string;
    confirm_password: string;
}

// 登录
async function login(model: LoginModel) {
    return await axios.post<ServerRes<string>>('/api/users/login', model);
}

// 判断是否登录
async function isLogin() {
    const token = localStorage.getItem(LoginToken);
    if (!token) {
        return false;
    }

    try {
        await axios.get<ServerRes<{isLogin: boolean}>>('/api/users/isLogin', {
            headers: createAuthHeader(),
        });

        return true;
    } catch (e) {
        return false;
    }
}

// 获取用户列表
async function getUserList() {
    const res = await axios.get('/api/users', {
        headers: createAuthHeader(),
    });

    return res.data;
}

async function saveUser(model: UserModel) {
    const res = await axios.post('/api/users', model, {
        headers: createAuthHeader(),
    });

    return res.data;
}

export {
    login,
    isLogin,
    getUserList,
    saveUser,
};