import { config } from "dotenv";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { readFileSync } from "fs";

config();

const main = async () => {
  if (!process.env.WALLET_PRIVATE_KEY) {
    throw new Error("No private key found");
  }

  try {
    const sdk = ThirdwebSDK.fromPrivateKey(
      process.env.WALLET_PRIVATE_KEY,
      "mumbai",
      {
        secretKey: process.env.THIRDWEB_SECRET_KEY,
      }
    );

    const contractAddress = await sdk.deployer.deployNFTDrop({
      name: "My Drop",
      primary_sale_recipient: "0x39Ab29fAfb5ad19e96CFB1E1c492083492DB89d4",
    });

    console.log("Contract address: ", contractAddress);

    const contract = await sdk.getContract(contractAddress, "nft-drop");

    const metadatas = [
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

    await contract.createBatch(metadatas);
    console.log("Created batch successfully!");
  } catch (e) {
    console.error("Something went wrong: ", e);
  }
};

main();
