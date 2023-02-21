import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import './extra.css';
import React, { FC, ReactNode, useMemo } from 'react';
import Footer1 from './components/Footer';
import GameArea from './components/GameArea';
import Navbar from './components/Navbar';
import styled from 'styled-components';

import Walletconnectercontext from './walletconnectercontext';

const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    overflow: hidden;
`;

require('./App.css');
require('@solana/wallet-adapter-react-ui/styles.css');

const App: FC = () => {
    return (
        <Walletconnectercontext>
            <WalletModalProvider>
                <MainContainer>
                    <Navbar />
                    <GameArea />

                    <Footer1 />
                </MainContainer>
            </WalletModalProvider>
        </Walletconnectercontext>
    );
};
export default App;
