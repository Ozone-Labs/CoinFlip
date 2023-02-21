import React, { FC } from 'react';
import styled from 'styled-components';
import './comp.css';
import { useState, useEffect } from 'react';
import { QuotLeft, QuotRight, SolSvgIcon } from '../components/svgIcons';
import { useWallet } from '@solana/wallet-adapter-react';
import Confetti from 'react-confetti';
import HistoryItem from '../components/HistoryItem';
import { getNetworkFromConnection, getSolbalance, postWinOrLoseToDiscordAPI, solConnection } from '../contexts/utils';
import { MiniLoading } from '../components/PageLoading';
import Header from '../components/Header';
import {
    claim,
    getAllTransactions,
    getBankBalance,
    getGlobalState,
    getUserFundsBalanceSOL,
    getUserPoolState,
    playGame,
} from '../contexts/transactions';
import { errorAlert } from '../components/toastGroup';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { HistoryItem as HistoryItemType, PROGRAM_ID } from '../contexts/type';
import ProgressBar from '../components/ProgressBar';
import LoadingText from '../components/LoadingText';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import CoinFlipping from '../components/CoinFlipping';
import Coin from '../components/Coin';

import Skeleton, { SkeletonProps } from 'react-loading-skeleton';

window.Buffer = window.Buffer || require('buffer').Buffer;

interface CustomSkeletonProps extends SkeletonProps {
    variant: 'rect' | 'circle' | 'text' | undefined;
}

const CustomSkeleton: React.FC<CustomSkeletonProps> = (props) => {
    return (
        <Skeleton
            {...props}
            width={'100%'}
            height={56}
            style={{
                borderRadius: 9,
                backgroundColor: '#1e1f1e60',
            }}
        />
    );
};

const MainContainer = styled.div`
    width: 100vw;
    display: flex;
    color: black;
    justify-content: space-around;
    min-height: 100vh;
    background: linear-gradient(to right, #33ccff 0%, #ff99cc 100%);
    // margin-top: 10vh;
    font-family: 'Julee', cursive;
    @media (max-width: 1000px) {
        flex-direction: column;
        min-height: 100vh;
    }
`;
const LeftContainer = styled.div`
    width: 70%;
    display: flex;
    color: black;
    float: left;
    font-family: 'Julee', cursive;
    justify-content: center;

    @media (max-width: 1000px) {
        width: 80%;
        margin: 1em auto;
        // display: none;
    }

    // background-color: black;
`;
const RightContainer = styled.div`
    min-width: 25%;
    display: flex;
    color: black;
    font-family: 'Julee', cursive;
    float: right !important;
    @media (max-width: 1000px) {
        width: 80%;
        margin: 1em auto;
    }
`;
const PlayBox = styled.div`
    min-height: fit-content;
    display: flex;
    justify-content: space-around;
    margin: 1em;
    font-family: 'Julee', cursive;
    border-radius: 0.8em;
    border: 2px solid white;
    background: linear-gradient(to top right, #33ccff 0%, #ff99cc 100%);
    // margin: auto;
`;

const OptionBox = styled.div`
    // width: 100%;
    display: flex;
    font-family: 'Julee', cursive;
    width: 80%;
    margin: auto;
    justify-content: center;
    border-radius: 1em;
    background: linear-gradient(to right, #ff99cc 0%, #33ccff 80%);
`;
const ChooseBox = styled.div`
    width: fit-content;
    border: 2px solid white;
    background: linear-gradient(to right, #33ccff 0%, #ff99cc 100%);
    background-color: blue;
    margin: 0.5em;
    font-family: 'Julee', cursive;
    border-radius: 0.5em;
    display: flex;
    flex-direction: column;
    img {
        margin: auto;
    }
    span {
        margin: auto;
    }
`;
const BetLine = styled.p`
    margin: 0.8em 0em;
    font-size: 2em;
    text-align: center;
    font-family: 'Julee', cursive;
    color: black;
`;

const CoinAnim = styled.div`
    display: flex;
    background: linear-gradient(to top right, #33ccff 0%, #ff99cc 100%) !important;
    border: 3px solid white;
    margin: 1em 1em;
    font-family: 'Julee', cursive;
    border-radius: 0.5em;
    justify-content: center;
    // width: fit-content;
    background: radial-gradient(50% 50% at 50% 50%, rgba(49, 51, 49, 0.23) 0%, rgba(250, 255, 0, 0) 100%);
    img {
        border: 5px solid white;
        width: 50%;
        border-radius: 5em;
        margin: 1.5em 0em;
    }
`;

const FirstPrio = styled.div`
    display: flex;
    font-family: 'Julee', cursive;
    flex-direction: column;
`;

const BidSelect = styled.div`
    border: 3px solid white;
    background: linear-gradient(to right, #33ccff 0%, #ff99cc 100%);
    margin: 1em 1em;
    padding-bottom: 1em;
    font-family: 'Julee', cursive;
    border-radius: 0.5em;
    display: flex;
    justify-content: center;
    flex-direction: column;
`;

const ButtonsBox = styled.div`
    // border: 5px solid red;
    display: flex;
    flex-wrap: wrap;
    font-family: 'Julee', cursive;
    width: 50%;
    justify-content: center;
    margin: 1em auto;

    button {
        width: 7em;
        padding: 0.5em;
        margin: 0.5em auto;
    }
`;

const BetLine2 = styled.div`
    display: flex;
    justify-content: space-around;
    margin-bottom: 1em;
`;
const StyledWalletIcon = styled(WalletMultiButton)`
    color: white !important;
    background-color: black !important;
    border: 2px solid white !important;
    font-family: 'Julee', cursive;
    border-radius: 0.5em;
`;

const GameContainer = styled.div`
    display: flex;
`;
const PlayGround = styled.div`
    width: auto;
    border: 1px solid black;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    flex-direction: column;
`;
const GameDetailsArea = styled.div`
    width: 30%;
    border: 1px solid black;
    min-height: 100vh;
`;

const GameBox = styled.div`
    width: 80%;
    height: fit-content;
    margin: 1em auto;
`;
const ControlPanel = styled.div`
    width: 90%;
    height: fit-content;
    margin: 1em auto;
`;

const GameArea = () => {
    const wallet = useWallet();
    const [isBet, setIsBet] = useState(true);
    const [amount, setAmount] = useState(0.05);
    const [userLoading, setUserLoading] = useState(false);
    const [solBalance, setSolBanace] = useState(0);
    const [betLoading, setBetLoading] = useState(false);
    const [claimLoading, setClaimLoading] = useState(false);

    const [isDepositing, setIsDepositing] = useState(false);
    const [isFlipping, setIsFlipping] = useState(false);
    const [isEnd, setIsEnd] = useState(false);
    const [isWon, setIsWon] = useState(false);
    const [setValue, setSetValue] = useState(0.05);
    const [userFunds, setUserFunds] = useState(0);
    const [txLoading, setTxLoading] = useState(false);
    const [isStartFlipping, setIsStartFlipping] = useState(false);

    const [isInc, setIsInc] = useState(false);
    const [isDec, setIsDec] = useState(false);

    const [isProgress, setIsProgress] = useState(false);
    const [txHistory, setTxHistory] = useState<HistoryItemType[]>([]);

    const getGlobalData = async () => {
        setIsDec(false);
        setUserLoading(true);
        if (wallet.publicKey !== null) {
            console.log('Connection:', getNetworkFromConnection(solConnection));

            const globalState = await getGlobalState();
            console.log('Global State:', globalState);

            const balance = await getSolbalance(wallet.publicKey);
            const funds = await getUserPoolState(wallet);
            const bankBalance = await getBankBalance();
            console.log('Bank Balance: ', bankBalance / LAMPORTS_PER_SOL);

            if (funds) {
                setUserFunds(funds.claimableReward.toNumber() / LAMPORTS_PER_SOL);
            }

            setSolBanace(balance);
            console.log('Player Balance:', balance);

            const userFundsBalanceBeforeWithdrawal = await getUserFundsBalanceSOL(wallet);
            console.log('Player Funds Balance:', userFundsBalanceBeforeWithdrawal);
        }

        setUserLoading(false);
    };

    const getAllTxs = async () => {
        setTxLoading(true);
        //const bankBalance = await getBankBalance();
        //console.log("Bank Balance: ", bankBalance / LAMPORTS_PER_SOL);
        if (wallet.publicKey !== null) {
            const allTx = await getAllTransactions(new PublicKey(PROGRAM_ID));
            setTxHistory(allTx);
        }
        setTxLoading(false);
    };

    const updatePage = async () => {
        await getGlobalData();
        await getAllTxs();
    };

    const handlePlayAgain = () => {
        setIsEnd(false);
        setIsWon(false);
        setIsProgress(false);
        setIsDec(false);
        setIsStartFlipping(false);
    };

    const setPlayResult = (isWon: boolean) => {
        setIsWon(isWon);
        console.log('IsWon:', isWon);

        postWinOrLoseToDiscordAPI(wallet!.publicKey!, isWon, amount, solConnection);
    };

    const handlePlay = async () => {
        if (wallet.publicKey === null) {
            errorAlert('Please connect wallet!');
            return;
        }
        if (amount + 0.002 > solBalance) {
            errorAlert("You don't have enough balance to play!");
            return;
        }

        if (amount + 0.002 > (await getSolbalance(wallet.publicKey))) {
            errorAlert("You don't have enough balance to play!");
            return;
        }

        try {
            const result = await playGame(
                wallet,
                isBet ? 1 : 0,
                amount,
                (e: boolean) => setBetLoading(e),
                (e: boolean) => setIsDepositing(e),
                (e: boolean) => setIsFlipping(e),
                (e: boolean) => setIsEnd(e),
                (e: boolean) => setIsProgress(e),
                (e: boolean) => setIsDec(e),
                (e: boolean) => setIsInc(e),
                (e: boolean) => setPlayResult(e),
                (e: boolean) => setIsStartFlipping(e),
                () => getAllTxs()
            );

            console.log('playGame result:', result);

            if (result && result.gameData.rewardAmount.toNumber() !== 0) {
                setSetValue(result.gameData.amount.toNumber() / LAMPORTS_PER_SOL);
            }

            getGlobalData();
        } catch (error) {
            setIsEnd(false);
            setIsWon(false);
            console.log(error);
        }
    };

    const [forceRender, serForceRender] = useState(false);
    const decWalletBalance = (value: number) => {
        let balance = solBalance;
        setSolBanace(balance - value);
        serForceRender(!forceRender);
    };

    const incFundsBalance = (value: number) => {
        let balance = userFunds;
        setUserFunds(balance + value);
        serForceRender(!forceRender);
    };

    useEffect(() => {
        if (isDec) {
            decWalletBalance(amount);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDec]);

    useEffect(() => {
        if (isWon) {
            setTimeout(() => {
                incFundsBalance(amount * 2);
            }, 3000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isWon, isInc]);

    const handleClaim = async () => {
        if (wallet.publicKey === null) {
            errorAlert('Please connect wallet!');
            return;
        }

        if (userFunds === 0) {
            errorAlert('No funds available for withdrawal!');
            return;
        }

        try {
            await claim(
                wallet,
                () => setClaimLoading(true),
                () => setClaimLoading(false),
                () => handlePlayAgain(),
                () => updatePage()
            );

            setIsEnd(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getGlobalData();
        getAllTxs();
        // getDataByInterval();
        // eslint-disable-next-line
    }, [wallet.connected, wallet.publicKey]);
    return (
        <>
            <style>@import url('https://fonts.googleapis.com/css2?family=Julee&display=swap');</style>
            <MainContainer>
                {wallet.publicKey === null ? (
                    <>
                        <LeftContainer>
                            <PlayBox>
                                <div>
                                    {isProgress ? (
                                        <div className="flip-box-progrsess">
                                            {isFlipping ? (
                                                <CoinFlipping heads={isBet} />
                                            ) : (
                                                <>
                                                    {isEnd ? (
                                                        <Coin
                                                            isHead={isWon === isBet}
                                                            result={isWon || !isProgress}
                                                            className="coin-animation"
                                                        />
                                                    ) : (
                                                        <Coin isHead={isBet} className="coin-animation" />
                                                    )}
                                                </>
                                            )}
                                            {isEnd ? (
                                                <>
                                                    {isWon ? (
                                                        <>
                                                            <p className="result-text won">YOU WON</p>
                                                            <p className="result-value won">{amount * 2} SOL</p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="result-text lost">YOU LOST</p>
                                                            <p className="result-value lost">{amount} SOL</p>
                                                        </>
                                                    )}

                                                    <ProgressBar
                                                        isEnd={isEnd}
                                                        isFetched={!userLoading}
                                                        handlePlayAgain={handlePlayAgain}
                                                        isWon={isWon}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    {isDepositing && !isFlipping && (
                                                        <LoadingText
                                                            text="waiting for deposit..."
                                                            className="waiting"
                                                        />
                                                    )}
                                                    {isFlipping && (
                                                        <LoadingText text="Flipping..." className="waiting" />
                                                    )}

                                                    <h4>
                                                        <QuotLeft />
                                                        {isBet ? 'HEADS' : 'TAILS'}{' '}
                                                        <span className="text-purple">FOR</span>{' '}
                                                        <span className="text-yellow">{amount}</span> SOL
                                                        <QuotRight />
                                                    </h4>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <FirstPrio>
                                                <CoinAnim className="coin">
                                                    {isBet ? (
                                                        <img
                                                            src="/img/head.png"
                                                            alt=""
                                                            width="20%"
                                                            className="coin-animation"
                                                        />
                                                    ) : (
                                                        // eslint-disable-next-line
                                                        <img
                                                            src="/img/tail.png"
                                                            alt=""
                                                            width="20%"
                                                            className="coin-animation"
                                                        />
                                                    )}
                                                </CoinAnim>
                                                <BetLine>I BET ON</BetLine>
                                                <OptionBox>
                                                    <ChooseBox onClick={() => setIsBet(true)}>
                                                        {/* eslint-disable-next-line */}
                                                        <img src="/img/head.png" alt="head" width="10%" />
                                                        <span className={`${isBet ? 'text-green' : 'text-purple'}`}>
                                                            HEADS
                                                        </span>
                                                    </ChooseBox>

                                                    <ChooseBox onClick={() => setIsBet(false)}>
                                                        {/* eslint-disable-next-line */}
                                                        <img src="/img/tail.png" alt="tail" width="10%" />
                                                        <span className={`${!isBet ? 'text-green' : 'text-purple'}`}>
                                                            TAILS
                                                        </span>
                                                    </ChooseBox>
                                                </OptionBox>

                                                {wallet.publicKey === null ? (
                                                    <>
                                                        <BetLine>Connect Wallet</BetLine>
                                                        <BetLine2>
                                                            <StyledWalletIcon />
                                                        </BetLine2>
                                                    </>
                                                ) : (
                                                    <BidSelect>
                                                        <BetLine>I BET FOR</BetLine>
                                                        <ButtonsBox>
                                                            <button
                                                                onClick={() => setAmount(0.05)}
                                                                disabled={solBalance <= 0.05}
                                                                className={`btn-sol ${amount === 0.05 ? 'active' : ''}`}
                                                            >
                                                                <span>0.05 SOL</span>
                                                            </button>
                                                            <button
                                                                onClick={() => setAmount(0.1)}
                                                                disabled={solBalance <= 0.1}
                                                                className={`btn-sol ${amount === 0.1 ? 'active' : ''}`}
                                                            >
                                                                <span>0.1 SOL</span>
                                                            </button>
                                                            <button
                                                                onClick={() => setAmount(0.25)}
                                                                disabled={solBalance <= 0.25}
                                                                className={`btn-sol ${amount === 0.25 ? 'active' : ''}`}
                                                            >
                                                                <span>0.25 SOL</span>
                                                            </button>
                                                            <button
                                                                onClick={() => setAmount(0.5)}
                                                                disabled={solBalance <= 0.5}
                                                                className={`btn-sol ${amount === 0.5 ? 'active' : ''}`}
                                                            >
                                                                <span>0.5 SOL</span>
                                                            </button>
                                                            <button
                                                                onClick={() => setAmount(1)}
                                                                disabled={solBalance <= 1}
                                                                className={`btn-sol ${amount === 1 ? 'active' : ''}`}
                                                            >
                                                                <span>1 SOL</span>
                                                            </button>
                                                            <button
                                                                onClick={() => setAmount(2)}
                                                                disabled={solBalance <= 2}
                                                                className={`btn-sol ${amount === 2 ? 'active' : ''}`}
                                                            >
                                                                <span>2 SOL</span>
                                                            </button>
                                                        </ButtonsBox>

                                                        <div className="action">
                                                            <button
                                                                className={`to-bet button white ${
                                                                    betLoading ? 'load-active' : ''
                                                                }  ${userLoading ? 'loading' : ''}`}
                                                                title={
                                                                    solBalance <= amount + 0.002 ? 'No enough SOL' : ''
                                                                }
                                                                disabled={betLoading}
                                                                onClick={() => handlePlay()}
                                                            >
                                                                <>Double or nothing</>
                                                                {betLoading && <MiniLoading />}
                                                            </button>
                                                        </div>
                                                    </BidSelect>
                                                )}
                                            </FirstPrio>
                                        </>
                                    )}
                                </div>
                            </PlayBox>
                        </LeftContainer>
                    </>
                ) : (
                    <>
                        {!isFlipping && (
                            <RightContainer>
                                <Header
                                    solBalance={solBalance}
                                    wallet={wallet}
                                    userFunds={userFunds}
                                    handleClaim={handleClaim}
                                    isClaiming={claimLoading}
                                    userLoading={userLoading}
                                    isEnd={isEnd}
                                    isWon={isWon}
                                />
                            </RightContainer>
                        )}
                        <LeftContainer>
                            <PlayBox>
                                <div>
                                    {isProgress ? (
                                        <div className="flip-box-progress">
                                            {isFlipping ? (
                                                <CoinFlipping heads={isBet} />
                                            ) : (
                                                <>
                                                    {isEnd ? (
                                                        <Coin
                                                            isHead={isWon === isBet}
                                                            result={isWon || !isProgress}
                                                            className="coin-animation"
                                                        />
                                                    ) : (
                                                        <Coin isHead={isBet} className="coin-animation" />
                                                    )}
                                                </>
                                            )}
                                            {isEnd ? (
                                                <>
                                                    {isWon ? (
                                                        <>
                                                            <p className="result-text won">YOU WON</p>
                                                            <p className="result-value won">{amount * 2} SOL</p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="result-text lost">YOU LOST</p>
                                                            <p className="result-value lost">{amount} SOL</p>
                                                        </>
                                                    )}

                                                    <ProgressBar
                                                        isEnd={isEnd}
                                                        isFetched={!userLoading}
                                                        handlePlayAgain={handlePlayAgain}
                                                        isWon={isWon}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    {isDepositing && !isFlipping && (
                                                        <LoadingText
                                                            text="waiting for deposit..."
                                                            className="waiting"
                                                        />
                                                    )}
                                                    {isFlipping && (
                                                        <LoadingText text="Flipping..." className="waiting" />
                                                    )}

                                                    <h4>
                                                        <QuotLeft />
                                                        {isBet ? 'HEADS' : 'TAILS'}{' '}
                                                        <span className="text-purple">FOR</span>{' '}
                                                        <span className="text-yellow">{amount}</span> SOL
                                                        <QuotRight />
                                                    </h4>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <FirstPrio>
                                                <CoinAnim className="coin">
                                                    {isBet ? (
                                                        <img
                                                            src="/img/head.png"
                                                            alt=""
                                                            width="20%"
                                                            className="coin-animation"
                                                        />
                                                    ) : (
                                                        // eslint-disable-next-line
                                                        <img
                                                            src="/img/tail.png"
                                                            alt=""
                                                            width="20%"
                                                            className="coin-animation"
                                                        />
                                                    )}
                                                </CoinAnim>
                                                <BetLine>I BET ON</BetLine>
                                                <OptionBox>
                                                    <ChooseBox onClick={() => setIsBet(true)}>
                                                        {/* eslint-disable-next-line */}
                                                        <img src="/img/head.png" alt="head" width="10%" />
                                                        <span className={`${isBet ? 'text-green' : 'text-purple'}`}>
                                                            HEADS
                                                        </span>
                                                    </ChooseBox>

                                                    <ChooseBox onClick={() => setIsBet(false)}>
                                                        {/* eslint-disable-next-line */}
                                                        <img src="/img/tail.png" alt="tail" width="10%" />
                                                        <span className={`${!isBet ? 'text-green' : 'text-purple'}`}>
                                                            TAILS
                                                        </span>
                                                    </ChooseBox>
                                                </OptionBox>

                                                {wallet.publicKey === null ? (
                                                    <>
                                                        <BetLine>Connect Wallet</BetLine>
                                                        <BetLine2>
                                                            <StyledWalletIcon />
                                                        </BetLine2>
                                                    </>
                                                ) : (
                                                    <BidSelect>
                                                        <BetLine>I BET FOR</BetLine>
                                                        <ButtonsBox>
                                                            <button
                                                                onClick={() => setAmount(0.05)}
                                                                disabled={solBalance <= 0.05}
                                                                className={`btn-sol ${amount === 0.05 ? 'active' : ''}`}
                                                            >
                                                                <span>0.05 SOL</span>
                                                            </button>
                                                            <button
                                                                onClick={() => setAmount(0.1)}
                                                                disabled={solBalance <= 0.1}
                                                                className={`btn-sol ${amount === 0.1 ? 'active' : ''}`}
                                                            >
                                                                <span>0.1 SOL</span>
                                                            </button>
                                                            <button
                                                                onClick={() => setAmount(0.25)}
                                                                disabled={solBalance <= 0.25}
                                                                className={`btn-sol ${amount === 0.25 ? 'active' : ''}`}
                                                            >
                                                                <span>0.25 SOL</span>
                                                            </button>
                                                            <button
                                                                onClick={() => setAmount(0.5)}
                                                                disabled={solBalance <= 0.5}
                                                                className={`btn-sol ${amount === 0.5 ? 'active' : ''}`}
                                                            >
                                                                <span>0.5 SOL</span>
                                                            </button>
                                                            <button
                                                                onClick={() => setAmount(1)}
                                                                disabled={solBalance <= 1}
                                                                className={`btn-sol ${amount === 1 ? 'active' : ''}`}
                                                            >
                                                                <span>1 SOL</span>
                                                            </button>
                                                            <button
                                                                onClick={() => setAmount(2)}
                                                                disabled={solBalance <= 2}
                                                                className={`btn-sol ${amount === 2 ? 'active' : ''}`}
                                                            >
                                                                <span>2 SOL</span>
                                                            </button>
                                                        </ButtonsBox>

                                                        <div className="action">
                                                            <button
                                                                className={`to-bet button white ${
                                                                    betLoading ? 'load-active' : ''
                                                                }  ${userLoading ? 'loading' : ''}`}
                                                                title={
                                                                    solBalance <= amount + 0.002 ? 'No enough SOL' : ''
                                                                }
                                                                disabled={betLoading}
                                                                onClick={() => handlePlay()}
                                                            >
                                                                <>Double or nothing</>
                                                                {betLoading && <MiniLoading />}
                                                            </button>
                                                        </div>
                                                    </BidSelect>
                                                )}
                                            </FirstPrio>
                                        </>
                                    )}
                                </div>
                            </PlayBox>
                        </LeftContainer>
                    </>
                )}
            </MainContainer>
        </>
    );
};

export default GameArea;
