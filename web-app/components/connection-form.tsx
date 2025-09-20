"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { connect, isConnected, request, getLocalStorage } from "@stacks/connect";
import { CheckCircle, AlertCircle } from "lucide-react";
import { GitHubTokenManager } from "./github-registration";
import { registerUser } from "@/utils/firestore";
import { UserContext } from "@/context/user-context";
import { UserEntry } from "@/app/types/user";


export function ConnectWallet() {
  const [connected, setConnected] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // CHECK THIS
  const CONTRACT_ADDRESS = "ST1S0VTM4F4FSMQK9AJWCWAE8GGS8FTSJQGGNRKCP.github-registry"; 
 
  const NETWORK: "testnet" | "mainnet" = "testnet";

  const manager = new GitHubTokenManager(CONTRACT_ADDRESS, NETWORK);

  const router = useRouter();
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("ConnectWallet must be used within a UserProvider");
  }
  const { setUser } = userContext;


  const userData = getLocalStorage();



  useEffect(() => {

    
    const boot = async () => {
      try {
        if (isConnected()) {
          setConnected(true);
          return;
        }
        const res = await connect();
        if (res && (res as any).provider) setConnected(true);
      } catch (err) {
        console.log(err);
        setMessage({ type: "error", text: "Failed to connect wallet. Please try again." });
      }
    };
    boot();
  }, []);

  const handleClick = async () => {
    if (!connected){
      try {
       
        const res = await connect();
        if (res && (res as any).provider) setConnected(true);
      } catch (err) {
        console.log(err);
        setMessage({ type: "error", text: "Failed to connect wallet. Please try again." });
      }
    } else {
      try {

        if (userData?.addresses) {
        const walletAddress = userData.addresses.stx[0].address;
        const newUser: UserEntry = {
          githubUsername: "",
          tokens: 200,
          NFTs: 0,
          walletAddress: walletAddress,
        };
        // Update the global state
        setUser(newUser);
        const result = await registerUser("", 200, 0, walletAddress);

  if (result.success) {
    console.log(result.message);
    router.push("/home");
  } else {
    console.error(result.message);
  }
}
      } catch(err){
        console.log(err);
      }

     
    }

  }

  return (
    <div className="w-full max-w-xl mx-auto mb-20">
      <div className="relative">
      
        <div className="absolute inset-0 bg-gradient-to-r from-amber-800/25 via-amber-600/20 to-sky-600/25 rounded-2xl blur-2xl animate-pulse" />
        <div className="relative rounded-2xl border border-amber-900/30 bg-gradient-to-br from-slate-950/70 via-slate-900/70 to-slate-900/60 backdrop-blur-xl p-8 shadow-2xl text-white space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleClick();
            }}
            className="space-y-6"
          >
            {message && (
              <div
                role="status"
                aria-live="polite"
                className={`rounded-xl px-4 py-3 text-sm ${
                  message.type === "error"
                    ? "bg-red-900/40 text-red-200 border border-red-600/70"
                    : "bg-emerald-900/40 text-emerald-200 border border-emerald-600/70"
                }`}
              >
                <div className="flex items-center gap-2">
                  {message.type === "error" ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : (
                    <CheckCircle className="w-5 h-5" />
                  )}
                  <span>{message.text}</span>
                </div>
              </div>
            )}

            {/* Wallet status (non-blocking) */}
            <div className="text-center text-sm">
              {connected ? (
                <span className="text-amber-200">Wallet connected ✅</span>
              ) : (
                <span className="text-sky-200/80">Please connect your wallet</span>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-700 to-sky-600 text-white font-semibold py-3 rounded-xl shadow transition hover:from-amber-600 hover:to-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {connected ? "Continue" : "Launch App"}
            </button>

            {/* subtle footer line */}
            <p className="text-center text-xs text-amber-200/60">
              Brew discounts from your commits ☕️
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
