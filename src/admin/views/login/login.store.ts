import { action, observable } from 'mobx';

export class LoginStore {
    @observable
    account: string = '';

    @observable
    password: string = '';

    @action
    onFieldsChange = (fields: any) => {
        console.log('form fields', fields);
    }
}

export const loginStoreIns = new LoginStore();