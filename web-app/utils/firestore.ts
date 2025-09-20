import {
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  addDoc
} from "firebase/firestore";

import { db, usersCollection } from "../firestore";
import { UserEntry } from "@/app/types/user";

export const registerUser = async (
    githubUsername: string,
    tokens: 200,
    NFTs: 0,
    walletAddress: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if email already exists
    const existingEntry = await checkWalletAddressExists(walletAddress);
    if (existingEntry) {
      return {
        success: true,
        message: "User is already registered.",
      };
    }

    // Add new entry
    const userEntry: UserEntry =  {
       githubUsername: githubUsername,
          tokens: tokens,
          NFTs: NFTs,
          walletAddress: walletAddress,
    };

    await addDoc(usersCollection, userEntry);

    return {
      success: true,
      message: "Successfully added to db!",
    };
  } catch (error) {
    console.error("Error adding to db:", error);
    return {
      success: false,
      message: "Failed to add to db. Please try again.",
    };
  }
};

// Check if email already exists in whitelist
export const checkWalletAddressExists = async (walletAddress: string): Promise<boolean> => {
  try {
    const q = query(
      usersCollection,
      where("walletAddress", "==", walletAddress.trim())
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking :", error);
    return false;
  }
};


export const updateUser = async (
  walletAddress: string,
  updatedData: Partial<UserEntry>
): Promise<{ success: boolean; message: string }> => {
  try {
    const q = query(
      usersCollection,
      where("walletAddress", "==", walletAddress.trim())
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        success: false,
        message: "User not found. Cannot update.",
      };
    }

    // There should only be one since walletAddress is unique
    const userDoc = querySnapshot.docs[0];

    await updateDoc(doc(db, "users", userDoc.id), {
      ...updatedData,
    });

    return {
      success: true,
      message: "User successfully updated.",
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      success: false,
      message: "Failed to update user. Please try again.",
    };
  }
};