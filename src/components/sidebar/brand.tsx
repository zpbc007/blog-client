import { Avatar } from '@material-ui/core';
import * as React from 'react';
import { transition } from 'style';
import styled from 'styled-components';

export interface PropsInterface {
    // 头像src
    avatar: string;
    // 昵称
    nickName: string;
    // 显示文字
    text: string;
    onClick: () => void;
    open: boolean;
}
// 最外层容器
const BrandWrapper = styled.div`
    text-align: center;
`;

// 图标容器 控制图标大小
const AvatarWrapper = styled(({ width,
                                height,
                                marginTop,
                                marginBottom,
                                ...props }: any) =>
                            (<Avatar {...props} />),
)<{width: number, height: number, marginTop: number, marginBottom: number}>`
    && {
        width: ${props => props.width}px;
        height: ${props => props.height}px;
        margin: ${props => props.marginTop}px auto ${props => props.marginBottom}px;
        transition: ${transition('width', 'height', 'margin')};
    }
`;

const TextWrapper = styled.div<{show: boolean}>`
    opacity: ${props => props.show ? 1 : 0};
    transition: ${transition('opacity')};
    h1 {
        color: #696969;
    }
    p {
        color: #999;
        line-height: 1.75;
        font-size: 1.2rem;
    }
`;

// 背景div
const TopBackDiv = styled.div``;
const imgOpenSize = 100;
const imgCloseSize = 34;
const imgOpenMargin = 20;
// 侧边栏中的头像部分
export class Brand extends React.PureComponent<PropsInterface> {
    render() {
        const { avatar, text, nickName, onClick, open } = this.props;
        const imgSize = open ? imgOpenSize : imgCloseSize;
        const marginValue = open ? imgOpenMargin : (imgOpenMargin + (imgOpenSize - imgCloseSize) / 2);

        return (
            <BrandWrapper onClick={onClick}>
                <AvatarWrapper
                    src={avatar}
                    width={imgSize}
                    height={imgSize}
                    marginTop={marginValue}
                    marginBottom={marginValue}
                    alt={nickName}
                />
                <TextWrapper show={open}>
                    <h1>{nickName}</h1>
                    <p>{text}</p>
                </TextWrapper>
            </BrandWrapper>
        );
    }
}