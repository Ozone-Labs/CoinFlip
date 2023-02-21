import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.div`
    display: flex;
    text-align: center;
    justify-content: space-around;
    bottom: 0;
    color: black;
    width: 100vw;
    border-top: 1px solid black;
    padding: 0.5vh;
`;

const Footer1 = () => {
    return <FooterContainer>All Rights Reserved | Ozone Labs | 2021-2023</FooterContainer>;
};

export default Footer1;
