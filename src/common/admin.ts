interface AdminItem {
    title: string;
    desc: string;
    path: string;
}

export const AdminData: AdminItem[] = [{
    title: '用户配置',
    desc: '配置用户信息',
    path: '/user',
}];