import * as React from 'react';
import { LeftMenu } from './left_menu';
import { Header } from './header';
import { Footer } from './footer';

/**
 * 组件的组合
 */
export class MainLayout extends React.PureComponent {
    render() {
        return (
            <div>
                <LeftMenu></LeftMenu>
                <Header></Header>
                <Footer></Footer>
            </div>
        );
    }
}