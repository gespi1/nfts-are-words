const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory('MyEpicNFT');
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  // call the mint function
  let txn = await nftContract.make3WordNFT()
  // wait for it to be minted
  await txn.wait()

  // mint another NFT
  txn = await nftContract.make3WordNFT()
  await txn.wait()

  // mint another NFT
  txn = await nftContract.make3WordNFT()
  await txn.wait()

};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();