import { InfoIcon } from "lucide-react";

export default async function Page() {
    return (
      <div className="flex-1 w-full flex flex-col gap-12 mt-10">
        <div className="w-full">
        <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <InfoIcon size="16" strokeWidth={2} />
            <span>Here is some TypeScript code if you want to make transactions on your own.</span> 
        </div>
        </div>
        <div className="w-full">
        <pre className="mt-2 h-[500px] overflow-y-auto rounded-md bg-slate-950 p-4"><code className="text-white">{`
  import { ethers } from "ethers";
  import { Log } from '@ethersproject/abstract-provider';
  
  function uuidToUint256(uuid: string): bigint {
      const cleanUuid = uuid.replace(/-/g, '').toLowerCase();
    
      const bigIntValue = BigInt(\`0x\${cleanUuid}\`);
    
      const uint256Max = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
      const uint256Value = bigIntValue & uint256Max;
    
      return uint256Value;
  }
  
  const contractABI = [
      {
          "inputs": [
              {
                  "internalType": "uint256",
                  "name": "_userId",
                  "type": "uint256"
              },
              {
                  "internalType": "bytes32[6]",
                  "name": "_predictionText",
                  "type": "bytes32[6]"
              }
          ],
          "name": "emitPrediction",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "uint256",
                  "name": "_id",
                  "type": "uint256"
              }
          ],
          "name": "getPredictionById",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "userId",
                  "type": "uint256"
              },
              {
                  "internalType": "bytes32[6]",
                  "name": "predictionText",
                  "type": "bytes32[6]"
              },
              {
                  "internalType": "uint256",
                  "name": "timestamp",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [],
          "name": "getNextId",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "anonymous": false,
          "inputs": [
              {
                  "indexed": true,
                  "internalType": "uint256",
                  "name": "id",
                  "type": "uint256"
              },
              {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "userId",
                  "type": "uint256"
              },
              {
                  "indexed": false,
                  "internalType": "bytes32[6]",
                  "name": "predictionText",
                  "type": "bytes32[6]"
              },
              {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "timestamp",
                  "type": "uint256"
              }
          ],
          "name": "PredictionMade",
          "type": "event"
      }
  ]
    
  const provider = new ethers.JsonRpcProvider(YOUR_RPC_URL); //your RPC URL
      
  const signer = new ethers.Wallet(YOUR_PRIVATE_KEY!, provider); //your wallet to fund gas costs (likely less than a cent)
  const contractAddress = "0xed8a0fb12b17BA0b6669F80f4C1ea082459A2AFA";
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  const description = YOUR_DESCRIPTION //must be less than 192 single byte characters
    
  async function createPrediction(description: string) {
      try {
        const bytes32Array = Array(6).fill(ethers.ZeroHash);
  
        for (let i = 0; i < 6 && i * 32 < description.length; i++) {
            let chunk = (description.slice(i * 31, (i + 1) * 31 )) + " ";
            let byteArray = new TextEncoder().encode(chunk);
  
            if (byteArray.length > 31) {
                let truncatedChunk = '';
                let byteCount = 0;
  
                for (let char of chunk) {
                    const charBytes = new TextEncoder().encode(char).length;
                    if (byteCount + charBytes > 31) break;
                    truncatedChunk += char;
                    byteCount += charBytes;
                }
  
                chunk = truncatedChunk;
            }
  
            bytes32Array[i] = ethers.encodeBytes32String(chunk);
        }
      
        const tx = await contract.emitPrediction(uuidToUint256(""), bytes32Array);

        const receipt = await tx.wait();
      
      const event = receipt.logs.find(
        (log: Log) => log.topics[0] === contract.interface.getEvent('PredictionMade')?.topicHash
      );

      if (!event) {
        return ["Error", "PredictionMade event not found in transaction logs"];
      }

      const parsedLog = contract.interface.parseLog(event);
      
      if (parsedLog == null) {
        return ["Error", "Unknown error occurred"]
      }

      const id = (parsedLog.args[0]).toString();
        
        console.log("Success! Go to https://predi.ct.it/p/" + id + " and hit [Verify on chain] to see your prediction.");
      } catch (error) {
        console.log(error)
      }
  }

createPrediction(description)
          `}</code></pre>
          </div>
      </div>
    );
  }