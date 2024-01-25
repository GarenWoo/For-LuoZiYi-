// import './App.css'
// import { useState, useEffect, useRef } from 'react'
// import { formatBalance, formatChainInDecimalAsString } from './utils'
import { ethers } from "ethers";
// import NFTMarketABI from "./utils/NFTMarketABI.json"
// import ERC777TokenGTTABI from "./utils/ERC777TokenGTTABI.json"
// import ERC721TokenABI from "./utils/ERC721Token.json"

const signPermit = async (_name, _chainId, _verifyingContract, _spender, _value, _deadline, _userAddress,) => {
  const name = _name;
  const version = "1";
  const chainId = _chainId;
  const verifyingContract = _verifyingContract;
  const spender = _spender;
  const value = _value;
  const deadline = _deadline;
  const userAddress = _userAddress;
  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()
  const owner = await signer.getAddress();
  const tokenAddress = verifyingContract;
  const tokenAbi = ["function nonces(address owner) view returns (uint256)"];
  let tokenContract
  let nonce
  if (tokenAddress) {
    tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);
    nonce = await tokenContract.nonces(userAddress);
  } else {
    console.log("Invalid token address");
  }

  const domain = {
    name: name,
    version: version,
    chainId: chainId,
    verifyingContract: verifyingContract,
  };

  const types = {
    Permit: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" }
    ],
  };

  const message = {
    owner: owner,
    spender: spender,
    value: value,
    nonce: nonce,
    deadline: deadline,
  };

  try {
    const signedMessage = await signer.signTypedData(domain, types, message);
    const signatureResult = ethers.Signature.from(signedMessage);
    console.log("v: ", signatureResult.v);
    console.log("r: ", signatureResult.r);
    console.log("s: ", signatureResult.s);
  } catch (error) {
    console.error("Error signing permit:", error);
  }
}