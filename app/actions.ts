"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ethers } from "ethers";
import { uuidToUint256 } from "@/utils/conversions";
import { createClient as createAdminClient } from '@supabase/supabase-js'
import dayjs from "dayjs";
import { Log } from '@ethersproject/abstract-provider';


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

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  
const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
const contractAddress = process.env.CONTRACT_ADDRESS!;
const contract = new ethers.Contract(contractAddress, contractABI, signer);

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const supabaseAdmin = createAdminClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (signUpError) {
    console.error(signUpError.code + " " + signUpError.message);
    return encodedRedirect("error", "/sign-up", signUpError.message);
  } else {
    if (authData && authData.user) {
      const { error: insertError } = await supabaseAdmin
        .from('user')
        .insert({
          id: authData.user.id,
          email: authData.user.email,
          credits: 200
        });

      if (insertError) {
        console.error("Error inserting user data:", insertError);
        return encodedRedirect("error", "/sign-up", "Error creating user profile");
      }
    }
    
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/dashboard/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/dashboard/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const deleteAccountAction = async () => {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  const user = await supabase.auth.getUser();
  if (user.data.user == null) {
    return
  }
  const {data, error} = await supabaseAdmin.auth.admin.deleteUser(
    user.data.user.id
  )
  if (error) {
    console.log(error)
  }
  return redirect("/");
};

export const createPredictionAction = async (description: string) => {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (user.data.user) {
    const authuserid = user.data.user.id;
    const { data: userData, error: userError } = await supabase
      .from('user')
      .select('credits')
      .eq('id', authuserid)
      .single();
  
    if (userError) {
      return ["Error", "Couldn't fetch user credits"];
    }
  
    if (userData.credits <= 0) {
      return ["Error", "Not enough credits to make a prediction"];
    }

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

      const formattedUserId = uuidToUint256(authuserid);
    
      const tx = await contract.emitPrediction(formattedUserId, bytes32Array);
      
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

      const id = Number(parsedLog.args[0]);

      const { data, error } = await supabase.rpc('create_prediction_and_update_credits', {
        p_authuserid: authuserid,
        p_description: description,
        p_visible: true,
        p_id: id
      });
  
      if (error) {
        return ["Error", "Couldn't create prediction or update credits"]
      }

      const { new_credit_balance } = data[0];
      
      return ["Success", `Prediction added successfully! You have ${new_credit_balance} credits left`];
    } catch (error) {
      return ["Error", "Prediction could not be added"];
    }
  }
  return ["Error", "Unknown authentication error"];
}

interface Prediction {
  userId: bigint;                 // uint256 should be handled as a bigint in TypeScript
  predictionText: string[];        // bytes32[6] will be represented as an array of strings
  timestamp: bigint;               // uint256 should also be a bigint
}

interface FormattedPrediction {
  userId: string;                  // bigint converted to string for JSON
  predictionText: string;          // The concatenated string from bytes32[6]
  timestamp: string;               // bigint converted to string for JSON
}

function bytes32ArrayToString(arr: string[]): string {
  return arr.map((hex) => 
    ethers.decodeBytes32String(hex)
  ).join('');
}

export async function verifyPredictionById(id: string): Promise<[string, string | FormattedPrediction]> {
  try {
    const numberId = Number(id);

    const prediction: Prediction = await contract.getPredictionById(numberId);

    const formattedPrediction: FormattedPrediction = {
      userId: prediction.userId.toString(),
      predictionText: bytes32ArrayToString(prediction.predictionText),
      timestamp: dayjs((Number(prediction.timestamp))*1000).toISOString()
    };

    return ["Prediction verified!", formattedPrediction];
  } catch (error) {
    console.log(error);
    return ["Error", "Unknown problem occurred"];
  }
}


export const getUserPredictionsAction = async (userId: string, from: number, to: number) => {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase
    .from('prediction')
    .select('id, description, created_at')
    .eq('authuserid', userId)
    .eq('visible', true)
    .range(from, to)
    .order('created_at', { ascending: false });

  if (userError) {
    return null;
  } else {
    return userData;
  }
};

export const getPredictionByIdAction = async (id: string) => {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase
    .from('prediction')
    .select('authuserid, description, created_at')
    .eq('id', id)
    .eq('visible', true)
    .single()

  if (userError) {
    return null;
  } else {
    return userData;
  }
};