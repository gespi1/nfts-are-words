import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import myEpicNft from './utils/MyEpicNFT.json';

const TWITTER_HANDLE = "gespi_";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TOTAL_MINT_COUNT = 99;
const CONTRACT_ADDRESS = "0x9Ea8e9C93024ff1EF59Dc6c58684AC5AE2f400e6";
const OPENSEA_URL = "https://testnets.opensea.io/";
const OPENSEA_COLLECTION = `${OPENSEA_URL}collection/3wordsnft-f1os4xzn0x`;
const OPENSEA_ASSET_URL = `${OPENSEA_URL}assets/${CONTRACT_ADDRESS}/`;
var OPENSEA_ASSET_TOKEN_URL = "";


const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");

  function setMintedCountStatus(mintedCount) {
    const status = document.getElementById("mintedCountStatus");
    status.innerHTML = `${mintedCount}/${TOTAL_MINT_COUNT} NFTs Minted`;
  }

  function setMintedStatus() {
    const status = document.getElementById("mintedStatus");
    status.href = OPENSEA_ASSET_TOKEN_URL;
    status.innerHTML = " Mint Complete 💪 Your NFT will be available for viewing on Opensea shortly";
  }

  function generateMintedNftUrl(mintedCount) {
    OPENSEA_ASSET_TOKEN_URL = `${OPENSEA_ASSET_URL}${mintedCount}`;
    console.log(`URL to Minted Item: ${OPENSEA_ASSET_TOKEN_URL}`);
  }

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log("Connected to chain " + chainId);

    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = "0x4"; 
    if (chainId !== rinkebyChainId) {
      alert("You are not connected to the Rinkeby Test Network!");
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)

    } else {
      console.log("No authorized account found")
    }
    
  }

  /*
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
      * Fancy method to request access to account.
      */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

          console.log("Going to pop wallet now to pay gas...")
          let nftTxn = await connectedContract.make3WordNFT();

          console.log("Mining...please wait.")
          await nftTxn.wait();
          
          console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);
          
          let mintedCount = await connectedContract.getTotalNFTsMintedSoFar();
          
          // since we minted a NFT successfully lets update this on our site
          getMintedCount();

          // generate URL for users newly Minted NFT
          generateMintedNftUrl(mintedCount);

          // send user the link to their NFT
          setMintedStatus();

        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error)
      }
  }


  const getMintedCount = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        console.log("Going to pop wallet now to pay gas...");
        let mintedCount = await connectedContract.getTotalNFTsMintedSoFar();

        console.log("Calculating minted count...please wait.");
        console.log(`Minted Count: ${mintedCount}`);

        setMintedCountStatus(mintedCount)
        return mintedCount

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getMintedCount();
    checkIfWalletIsConnected();
  }, [])

  /*
  * Added a conditional render! We don't want to show Connect to Wallet if we're already conencted :).
  */
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">3 Word NFTs</p>
          <p className="sub-text">
            Each unique. Each beautiful. Randomly Generated 3 Worded NFT.
          </p>
          {currentAccount === "" ? (
            <button onClick={connectWallet} className="cta-button connect-wallet-button">
              Connect to Wallet
            </button>
          ) : (
              <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
                Mint NFT
            </button>
            )}
          <p>
            <button className="cta-button opensea-button">
              <a href={OPENSEA_COLLECTION} target="_blank" className="mint-count">🌊 View Collection on OpenSea</a>
            </button>
          </p>
          <p>
            <span id="mintedCountStatus" className="mint-count"></span>
          </p>
          <br/>
          <p>
            <a href={OPENSEA_ASSET_TOKEN_URL} id="mintedStatus" className="mint-count" target="_blank"></a>
          </p>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
