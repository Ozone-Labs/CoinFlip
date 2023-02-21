import React from 'react';
import styled from 'styled-components';

const CoinContainer = styled.div`
    margin: 1em;
    border: 4px solid white;
    background: linear-gradient(to top right, skyblue 0%, lightpink 100%);

    border-image: linear-gradient(100deg, white, white);
    -webkit-text-fill-color: transparent;
    -moz-text-fill-color: transparent;

    display: flex;
    border-radius: 8em;
    justify-content: center;
    img {
        width: 40vh;
        border: 5px solid white;
        border-radius: 8em;

        margin: auto;
    }
`;

export default function Coin(props: { isHead: boolean; result?: boolean; className?: string }) {
    const { isHead, result, className } = props;
    return (
        <CoinContainer className="coin-animation">
            {isHead ? (
                <img
                    src="/img/head.png"
                    alt="head"
                    className={`coin ${className ? className : ''} ${result ? 'normal' : 'lost'}`}
                />
            ) : (
                <img
                    src="/img/tail.png"
                    alt="tail"
                    className={`coin ${className ? className : ''} ${result ? '' : 'lost'}`}
                />
            )}
        </CoinContainer>
    );
}
