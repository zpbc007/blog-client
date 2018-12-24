import { EditingState  } from '@devexpress/dx-react-grid';
import { Grid, Table, TableEditColumn, TableEditRow, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper } from '@material-ui/core';
import { withStoreIns } from 'hoc/withStore';
import { observer } from 'mobx-react';
import * as React from 'react';
import { toast } from 'react-toastify';
import { compose } from 'recompose';
import { ResetPassModel, UserModel } from 'service/user';
import { ActionTypeProvider, BooleanTypeProvider } from './column_provider';
import { TableEditMessages, UserListStore } from './user_list.store';
import { UserResetPass } from './user_reset_pass';

interface InnerPropsInterface {
    store: UserListStore;
}

const getRowId = (row: any) => row.id;

@observer
export class UserList extends React.Component<InnerPropsInterface>{
    formRef: React.RefObject<UserResetPass> = React.createRef();

    handleAddBtnClick = () => {
        const { toggleDiaglog } = this.props.store;

        toggleDiaglog();
    }

    handleDialogCancel = () => {
        const { toggleDiaglog, clearModifyIndex } = this.props.store;

        toggleDiaglog();
        clearModifyIndex();
    }

    handleDialogConfirm = async () => {
        const { toggleDiaglog, savePass, clearModifyIndex, curModifyRowIndex, rowList } = this.props.store;

        if (this.formRef.current) {
            const { result, data = {} } = this.formRef.current.getFormValue();

            if (result) {
                const res = await savePass({
                    ...data,
                    id: rowList[curModifyRowIndex].id,
                } as ResetPassModel );
                toggleDiaglog();
                clearModifyIndex();
            } else {
                toast.error('表单填写错误, 请核对');
            }
        }
    }

    render() {
        return (
            <Paper>
                <h2>用户列表</h2>
                {this.renderTable()}
                {this.renderDialog()}
            </Paper>
        );
    }

    renderDialog() {
        const {
            dialogOpen,
        } = this.props.store;

        return (
            <Dialog
                open={dialogOpen}
            >
                <DialogTitle>
                    用户信息
                </DialogTitle>
                <DialogContent>
                    <UserResetPass
                        ref={this.formRef}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleDialogCancel}>
                        取消
                    </Button>
                    <Button onClick={this.handleDialogConfirm}>
                        确认
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    renderTable() {
        const {
            ColumnList,
            ColumnAlign,
            rowList,
            commitChanges,
        } = this.props.store;

        return (
            <Grid
                columns={ColumnList}
                rows={rowList}
                getRowId={getRowId}
            >
                <BooleanTypeProvider
                    for={['enable', 'super']}
                />
                <ActionTypeProvider
                    for={['action']}
                />
                <EditingState
                    onCommitChanges={commitChanges}
                />
                <Table columnExtensions={ColumnAlign} />
                <TableHeaderRow />
                <TableEditRow />
                <TableEditColumn
                    showAddCommand={true}
                    showEditCommand={true}
                    showDeleteCommand={true}
                    messages={TableEditMessages}
                />
            </Grid>
        );
    }

    componentDidMount() {
        this.props.store.fetchUserList();
    }
}

export default compose<InnerPropsInterface, any>(withStoreIns(new UserListStore()))(UserList);