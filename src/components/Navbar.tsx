import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React from 'react';
import styled from 'styled-components';

const NavContainer = styled.div`
    display: flex;
    justify-content: space-around;
    padding: 1vh;
    border-bottom: 1px solid black;
    color: black;
`;
const NavL = styled.div`
    color: black;
    align-self: center;
`;
const NavM = styled.nav`
    display: flex;
    justify-content: space-around;
    align-self: center;
`;
const Tabs = styled.a`
    text-decoration: none;
    color: black;
    text-transform: capitalize;
    padding: 0 0.6em;
    margin: 0 0.2em;
    hover {
        color: grey;
    }
`;

const NavR = styled.div``;
const ConnectButton = styled(WalletMultiButton)`
    color: white;
    background-color: black;
`;

const Navbar = () => {
    return (
        <NavContainer>
            <NavL>logo</NavL>
            <NavM>
                <Tabs href="/">home</Tabs>
                <Tabs href="/">Games</Tabs>
                <Tabs href="/">about us</Tabs>
                <Tabs href="/">Blogs</Tabs>
            </NavM>
            <NavR>
                <ConnectButton />
            </NavR>
        </NavContainer>
    );
};

export default Navbar;
