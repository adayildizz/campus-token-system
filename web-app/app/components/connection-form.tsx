"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { connect, isConnected, request } from "@stacks/connect";
import { CheckCircle, AlertCircle } from "lucide-react";
import { GitHubTokenManager } from "./github-registration";

export function ConnectWallet() {
  const [githubUsername, setGithubUsername] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // CHECK THIS
  const CONTRACT_ADDRESS = "ST1S0VTM4F4FSMQK9AJWCWAE8GGS8FTSJQGGNRKCP.github-registry"; 
 
  const NETWORK: "testnet" | "mainnet" = "testnet";

  const manager = new GitHubTokenManager(CONTRACT_ADDRESS, NETWORK);

  const router = useRouter();

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

  const getSenderAddress = async (net: "testnet" | "mainnet") => {
  const res: any = await request("stx_getAccounts");
  const addr =
    res?.addresses?.find((a: any) => a.network === net)?.address ??
    res?.addresses?.[0]?.address;
  if (!addr) throw new Error("Could not get a Stacks address from the wallet.");
  return addr; // ST... for testnet, SP... for mainnet
};

  const handleClick = async () => {
    if (!githubUsername.trim()) {
      setMessage({ type: "error", text: "Please enter your GitHub username." });
      return;
    }
    const githubUsernameRegex = /^(?!-)(?!.*--)[a-zA-Z0-9-]{1,39}(?<!-)$/;

    if (!githubUsernameRegex.test(githubUsername)) {
    setMessage({ type: "error", text: "Invalid GitHub username format." });
    return;
    }

    
    // //saving the wallet github mapping to blockchain
    // try {
    //   const  result = await manager.simulateRegister(githubUsername, CONTRACT_ADDRESS);
    //   console.log(result)
    //   const senderAddress = await getSenderAddress("testnet");
    //   const owner = await manager.getWalletByGitHub(githubUsername, senderAddress);


    // } catch(error){
    //   console.error(error);
    // }

    //handling navigation/validation here
    setMessage({ type: "success", text: `GitHub username saved: ${githubUsername}` });
    console.log("GitHub username:", githubUsername);

    router.push("/home")

  };

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

            {/* Always-visible GitHub field */}
            <div>
              <label htmlFor="github" className="block text-lg font-bold mb-2 text-amber-200">
                GitHub Username
              </label>
              <input
                id="github"
                type="text"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-amber-800/40 text-white placeholder-amber-200/50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="e.g. octocat"
                autoComplete="off"
              />
            </div>

            {/* Wallet status (non-blocking) */}
            <div className="text-center text-sm">
              {connected ? (
                <span className="text-amber-200">Wallet connected ✅</span>
              ) : (
                <span className="text-sky-200/80">Connecting wallet…</span>
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
