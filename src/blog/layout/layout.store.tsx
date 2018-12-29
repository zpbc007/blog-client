import { action, observable, runInAction } from 'mobx';
import { getWord } from 'service/one_word.service';

export class LayoutStore {
    // 一言文字
    @observable
    menuText: string = '';

    // 一言文字作者
    @observable
    textFrom: string = '';

    // 侧边栏是否关闭
    @observable
    collapsed = false;

    // 改变开关状态
    @action
    toggleCollapsed = () => {
        this.collapsed = !this.collapsed;
    }

    // 请求一言数据
    @action
    fetchOneWord = async () => {
        const { text, from } = await getWord();

        runInAction(() => {
            this.menuText = text;
            this.textFrom = from;
        });
    }
}

export const layoutStoreIns = new LayoutStore();