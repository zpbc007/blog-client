import { Avatar } from 'antd';
import * as React from 'react';
import { transition } from 'style';
import styled from 'styled-components';

interface PropsInterface {
    avatar: string;
    nickName: string;
    text: string;
    textFrom: string;
    open: boolean;
}

const BrandWrapper = styled.div`
    text-align: center;
`;

const StyledAvatar = styled(Avatar)`
    && {
        margin-top: 10px;
        margin-bottom: 8px;
    }
`;

const TextWrapper = styled.div<{show: boolean}>`
    overflow: ${props => props.show ? 'auto' : 'hidden'};
    transition: ${transition('heigth')};
    height: ${props => props.show ? null : '0'};
    padding: 0 1em;
    h3 {
        color: #fff;
    }
    p {
        color: #D7DBDD;
        line-height: 1.75;
        font-size: 1rem;
    }
`;

const SentenceWrapper = styled.p`
    text-align: left;
`;

const AuthorWrapper = styled.p`
    text-align: right;
`;

export class Brand extends React.Component<PropsInterface> {
    render() {
        const { avatar, open, nickName, text, textFrom } = this.props;

        return (
            <BrandWrapper>
                <StyledAvatar
                    size={open ? 100 : 'small'}
                    src={avatar}
                />
                <TextWrapper show={open}>
                    <h3>{nickName}</h3>
                    {text ? (<SentenceWrapper>{text}</SentenceWrapper>) : null}
                    {textFrom ? (<AuthorWrapper>- {textFrom}</AuthorWrapper>) : null}
                </TextWrapper>
            </BrandWrapper>
        );
    }
}