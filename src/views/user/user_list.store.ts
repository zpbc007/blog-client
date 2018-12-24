import { ChangeSet, Column, Table, TableEditColumn } from '@devexpress/dx-react-grid';
import Axios from 'axios';
import { action, observable, runInAction } from 'mobx';
import { BooleanType, SchemaModel, StringType } from 'rsuite-schema';
import { getUserList, ResetPassModel, UserModel } from 'service/user';
import { createAuthHeader } from 'utils/request';

export const EditUserModel = SchemaModel({
    account: StringType()
        .maxLength(30, '账户不能大于30位')
        .minLength(6, '账户不能少于6位')
        .isRequired('账户不能为空'),
    avatar: StringType(),
    nickname: StringType()
        .maxLength(30, '昵称不能大于30位')
        .isRequired('昵称不能为空'),
    enable: BooleanType(),
    isSuper: BooleanType(),
});

export const RestPassModel = SchemaModel({
    password: StringType()
        .maxLength(30, '密码不能大于30位')
        .minLength(6, '密码不能少于6位')
        .isRequired('密码不能为空'),
    confirm_password: StringType()
        .isRequired('密码不能为空')
        .addRule((value: string, data: any) => {
            if (value !== data.password) {
                return false;
            }
            return true;
        }, '两次密码不一致'),
});

export const TableEditMessages: TableEditColumn.LocalizationMessages = {
    addCommand: '新建',
    editCommand: '编辑',
    deleteCommand: '删除',
    commitCommand: '保存',
    cancelCommand: '取消',
};

export class UserListStore {

    /**
     * table 获取数据
     */
    @observable
    tableLoading = false;

    /**
     * 编辑 添加
     */
    @observable
    dialogLoading = false;

    /**
     * 列定义
     */
    ColumnList: Column[] = [{
        name: 'action',
        title: '操作',
    }, {
        name: 'account',
        title: '账号',
    }, {
        name: 'avatar',
        title: '头像',
    }, {
        name: 'nickname',
        title: '昵称',
    }, {
        name: 'enable',
        title: '启用',
    }, {
        name: 'super',
        title: '超级管理员',
    }];

    /**
     * 列对齐
     */
    ColumnAlign: Table.ColumnExtension[] = [
        { columnName: 'action', align: 'center' },
        { columnName: 'account', align: 'left' },
        { columnName: 'avatar', align: 'center' },
        { columnName: 'nickname', align: 'left' },
        { columnName: 'enable', align: 'center' },
        { columnName: 'super', align: 'center' },
    ];

    /**
     * table 数据
     */
    @observable
    rowList: any[] = [];

    /** id-index */
    rowIdIndexMap: {[key: number]: number} = {};

    /**
     * 对话框开启 flag
     */
    @observable
    dialogOpen = false;

    @action
    toggleDiaglog = () => {
        this.dialogOpen = !this.dialogOpen;
    }

    /**
     * 当前编辑行index
     */
    curModifyRowIndex: number = -1;

    @action
    setModifyIndex = (index: number) => {
        this.curModifyRowIndex = index;
    }

    @action
    clearModifyIndex = () => {
        this.curModifyRowIndex = -1;
    }

    /**
     * 获取用户列表
     */
    @action
    fetchUserList = async () => {
        const self = this;
        this.tableLoading = true;
        this.rowIdIndexMap = {};
        const res = await getUserList();
        runInAction(() => {
            this.tableLoading = false;
            this.rowList = res;

            this.rowList.forEach(({ id }: {id: number}, index) => {
                this.rowIdIndexMap[id] = index;

                // 添加action列
                this.rowList[index].action = [{
                    text: '修改密码',
                    onClick: () => {
                        self.toggleDiaglog();
                        self.setModifyIndex(index);
                    },
                }];
            });
        });
    }

    /**
     * 保存当前form数据
     */
    @action
    saveUser = async (model: UserModel) => {
        this.tableLoading = true;
        const res = await Axios.post('/api/users', {
            avatar: '',
            ...model,
        }, {
            headers: createAuthHeader(),
        });

        runInAction(() => {
            this.tableLoading = false;

            this.fetchUserList();
        });
    }

    /**
     * 删除user
     */
    @action
    delUser = async (id: number) => {
        this.tableLoading = true;
        const res = await Axios.delete(`/api/users/${id}`, {
            headers: createAuthHeader(),
        });

        runInAction(() => {
            this.tableLoading = false;

            this.fetchUserList();
        });
    }

    @action
    savePass = async (model: ResetPassModel) => {
        const res = await Axios.post(`/api/users/changePass`, model, {
            headers: createAuthHeader(),
        });
    }

    @action
    commitChanges = ({ added, changed, deleted }: ChangeSet) => {
        if (added && added.length > 0) {
            this.saveUser(added[0]);
        }

        if (changed) {
            const rowId = Object.keys(changed)[0];
            const rowIndex = this.rowIdIndexMap[Number(rowId)];

            this.saveUser({
                ...this.rowList[rowIndex],
                ...changed[rowId],
            });
        }

        if (deleted) {
            this.delUser(deleted[0] as number);
        }
    }
}