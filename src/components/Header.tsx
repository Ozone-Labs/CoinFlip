import { WalletContextState } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { MiniLoading } from './PageLoading';
import { DepositIcon, SolSvgIcon } from './svgIcons';
import styled from 'styled-components';
import Confetti from 'react-confetti';
import Dicon from '../../public/img/deposit.png';

const StyledWalletIcon = styled(WalletMultiButton)`
    color: white !important;
    background-color: black !important;
    border: 2px solid white !important;
    border-radius: 0.5em;
`;
const GameDetailsArea = styled.div`
    width: 100%;
    border: 2px solid white;
    height: fit-content;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: center;
    margin: 1em;
    border-radius: 0.5em;
    background: linear-gradient(to top right, #33ccff 0%, #ff99cc 100%);
`;
const WalletDetailsBox = styled.div`
    margin: 1em auto;
`;

const PlayerBalancebox = styled.div`
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    padding: 0.5em 1em;
    background-color: black;
    border-radius: 0.8em;
`;

const SolBalanceBox = styled.div`
    border: 1px solid black;
    display: flex;
    font-size: 20px;
    flex-direction: column;
    background-color: black;
    // display: none;
    padding: 0.5em 1em;
    border-radius: 20px;

    p {
        text-align: center;
        button {
            border: none;
        }
    }
`;

const FundLabel = styled.label`
    font-size: 25px;
    background-color: black;
`;

const FundAvl = styled.div`
    display: flex;
    justify-content: space-around;
    text-align: center;
    border: 1px solid black;
    background-color: black;
    color: white;
    p {
        border: 1px solid black;
        font-size: 35px;
        justify-content: space-around;
        // margin: revert;
        display: flex;
    }
    img {
        width: 35px;
    }
    button {
        border: none;
        background-color: black;
        padding: 0 0.5em;
    }
`;

export default function Header(props: {
    solBalance: number;
    userFunds: number;
    handleClaim: Function;
    wallet: WalletContextState;
    isClaiming: boolean;
    isEnd: boolean;
    isWon: boolean;
    userLoading: boolean;
}) {
    const { userFunds, solBalance, userLoading, isClaiming, handleClaim, wallet, isEnd, isWon } = props;
    return (
        <GameDetailsArea>
            {wallet.publicKey && (
                <>
                    <WalletDetailsBox>
                        <StyledWalletIcon />
                    </WalletDetailsBox>
                    <WalletDetailsBox>
                        <PlayerBalancebox>
                            <FundLabel>{!isClaiming ? 'player funds' : 'claiming...'}</FundLabel>
                            <FundAvl>
                                <div>
                                    <p>{userLoading ? '--' : userFunds.toLocaleString()}&nbsp;SOL</p>
                                </div>
                                <button className="claim-button" disabled={isClaiming} onClick={() => handleClaim()}>
                                    <img src="./img/deposite.png" alt="error" />
                                    {isClaiming && <MiniLoading />}
                                </button>
                            </FundAvl>
                        </PlayerBalancebox>
                    </WalletDetailsBox>

                    <WalletDetailsBox>
                        {wallet.publicKey && (
                            <SolBalanceBox>
                                <p>Available Balance</p>

                                <p>
                                    {userLoading ? '--' : solBalance.toLocaleString()}&nbsp;
                                    <span>SOL</span>
                                </p>
                            </SolBalanceBox>
                        )}
                        {isEnd && <div className="win-effect">{isWon && <Confetti width={2000} height={2000} />}</div>}
                    </WalletDetailsBox>
                </>
            )}
        </GameDetailsArea>
    );
}
