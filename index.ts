import { config } from "dotenv";
import { readFileSync } from "fs";
import {
  createThirdwebClient,
  getContract,
  sendAndConfirmTransaction,
} from "thirdweb";
import { polygonAmoy } from "thirdweb/chains";
import { deployERC721Contract } from "thirdweb/deploys";
import { lazyMint } from "thirdweb/extensions/erc721";
import { privateKeyToAccount } from "thirdweb/wallets";

config();

const main = async () => {
  if (!process.env.WALLET_PRIVATE_KEY) {
    throw new Error("No private key found");
  }
  if (!process.env.THIRDWEB_SECRET_KEY) {
    throw new Error("No THIRDWEB_SECRET_KEY found");
  }
  try {
    const chain = polygonAmoy;
    const client = createThirdwebClient({
      secretKey: process.env.THIRDWEB_SECRET_KEY,
    });
    const account = privateKeyToAccount({
      client,
      privateKey: process.env.WALLET_PRIVATE_KEY,
    }); // private key account
    const address = await deployERC721Contract({
      chain,
      client,
      account,
      type: "DropERC721",
      params: {
        name: "My Drop",
        symbol: "MYNFT",
      },
    });
    console.log("Contract address: ", address);
    const contract = getContract({ address, chain, client });
    const nfts = [
      {
        name: "Blue Star",
        description: "A blue star NFT",
        image: readFileSync("assets/blue-star.png"),
      },
      {
        name: "Red Star",
        description: "A red star NFT",
        image: readFileSync("assets/red-star.png"),
      },
      {
        name: "Yellow Star",
        description: "A yellow star NFT",
        image: readFileSync("assets/yellow-star.png"),
      },
    ];
    const transaction = lazyMint({
      contract: contract,
      nfts,
    });
    const data = await sendAndConfirmTransaction({
      transaction,
      account,
    });
    console.log("Lazy minted successfully!");
    console.log(`Transaction hash: ${data.transactionHash}`);
  } catch (err) {
    console.error("Something went wrong: ", err);
  }
};

main();
