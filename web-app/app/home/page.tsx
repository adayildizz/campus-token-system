"use client"
import { UserContext } from "@/context/user-context";
import { useContext } from "react"
import { updateUser } from "@/utils/firestore";
import {
  contractPrincipalCV,
  uintCV,
  standardPrincipalCV,
  noneCV,
  
} from "@stacks/transactions";
import { openContractCall } from "@stacks/connect";

const FT_CONTRACT = {
  address: "ST2P6SD88KJYXBNDJB0TQCNTV09940WF6NVX6C8J",
  name: "clarity-coin",
};

const NFT_CONTRACT = {
  address: "ST2P6SD88KJYXBNDJB0TQCNTV09940WF6NVX6C8J",
  name: "ticket",
};

const CONTRACT_OWNER = "ST2P6SD88KJYXBNDJB0TQCNTV09940WF6NVX6C8J";

const toMicroTOK = (amount: number) => amount * 1_000_000;

export default function TokensDashboard() {

     const userContext = useContext(UserContext);
      if (!userContext) {
        throw new Error("ConnectWallet must be used within a UserProvider");
      }
      const { user } = userContext;
    
      console.log("user", user)

const handleGetTicket = async (costTok: number) => {
  if (!user?.walletAddress) {
    alert("Please connect your wallet first.");
    return;
  }

  await openContractCall({
    contractAddress: FT_CONTRACT.address,
    contractName: FT_CONTRACT.name, // must match deployed name
    functionName: "transfer",
    functionArgs: [
      uintCV(toMicroTOK(costTok)),                     // amount (microTOK)
      standardPrincipalCV(user.walletAddress),         // sender
      standardPrincipalCV(CONTRACT_OWNER),             // recipient
      noneCV(),                                        // memo
    ],
    network: "testnet",
    appDetails: { name: "NFT Rewards", icon: `${window.location.origin}/logo.png` },
    onFinish: (data) => {
      console.log("FT transfer tx:", data.txId);
      window.open(`https://explorer.stacks.co/txid/${data.txId}?chain=testnet`, "_blank");

     
    },
  });

  
      updateUser(user.walletAddress, {
        tokens: (user.tokens ?? 0) - costTok,
        NFTs: user.NFTs ?? 0,
        githubUsername: user.githubUsername,
      }).catch(console.error);
};

    const handleGetAttendance = async () => {
 if (!user?.walletAddress) {
      alert("Please connect your wallet first.");
      return;
    }

     await openContractCall({
    contractAddress: NFT_CONTRACT.address,
    contractName: NFT_CONTRACT.name,
    functionName: "mint",
    functionArgs: [standardPrincipalCV(user.walletAddress)],
    network: "testnet",
    appDetails: { name: "NFT Rewards", icon: `${window.location.origin}/logo.png` },
    onFinish: async (data) => {
      console.log("NFT mint tx:", data.txId);
      window.open(`https://explorer.stacks.co/txid/${data.txId}?chain=testnet`, "_blank");
    },
  });
    await updateUser(user.walletAddress, {
    tokens: user.tokens ?? 0,
    NFTs: (user.NFTs ?? 0) + 1,
    githubUsername: user.githubUsername,
  });
    }

    
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-16 space-y-10">
        {/* Page header */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">NFT Rewards</h1>
            <p className="text-slate-400 mt-1">Sync your GitHub, attend to activities using units, and win NFTs!</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-900/20 px-3 py-1 text-sm">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            Beta
          </span>
        </header>

        {/* Glow background */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-800/25 via-amber-600/20 to-sky-600/25 rounded-2xl blur-2xl animate-pulse" />

          <div className="relative rounded-2xl border border-amber-900/30 bg-gradient-to-br from-slate-950/70 via-slate-900/70 to-slate-900/60 backdrop-blur-xl p-6 md:p-8 shadow-2xl">
            {/* 2-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sync GitHub */}
              <section className="rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium">Sync GitHub</h2>
                 
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  Connect your GitHub to earn NFTs based on your public activity.
                </p>
<div className="mt-4 flex flex-col gap-3">
  <button className="group relative inline-flex items-center gap-2 rounded-lg border border-sky-500/40 bg-sky-600/20 px-4 py-2 text-sm font-medium hover:bg-sky-600/30 transition">
    {/* GitHub mark */}
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
      <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.6-4.04-1.6-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.85 1.24 1.85 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.32.47-2.39 1.24-3.23-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.47 11.47 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.3c0 .32.21.7.82.58A12 12 0 0 0 12 .5Z"/>
    </svg>
    Sync GitHub
  </button>
  <span className="text-xs text-slate-400">No private access requested.</span>
  <p className="mt-3 text-xs text-slate-400">
    You’ll be able to claim once GitHub is synced and allocation is calculated.
  </p>
</div>
              </section>

              {/* Tokens and NFT Balances here */}
              <section className="rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium">Your Balances</h2>
                  {/* Here show the wallet connection, if not give no access error */}
                {user?.walletAddress ? (
  <Badge >Wallet connected</Badge>
) : (
  <Badge >Wallet not connected</Badge>
)}

                </div>

                <p className="mt-2 text-sm text-slate-400">
                  NFTs are minted based on your in-campus activities! Use your tokens to get a ticket.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Pill label="Tokens" value={user?.tokens ?? 0} suffix="TOK" />
                  <Pill label="NFTs" value={user?.NFTs ?? 0} suffix="NFT" />
                 
                </div>

                
              </section>
            </div>

            {/* Discounts showcase */}
         
<section className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
  <div className="flex items-center justify-between gap-4">
    <h2 className="text-xl font-medium">Campus Activities</h2>
    <span className="text-xs text-slate-400">Join events and meet new people</span>
  </div>

  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <EventCard
      brand="Halloween Party"
      description="Spooky night of fun and games"
      discount="Oct 31, 8 PM"
      cost={150}
      stock="300 tickets left"
       onGetTicket={() => handleGetTicket(150)}
          onAttend={handleGetAttendance}
    />
    <EventCard
      brand="Freshman Party"
      description="Meet your classmates and make new friends"
      discount="Sep 25, 7 PM"
      cost={100}
      stock="200 tickets left"
      onGetTicket={() => handleGetTicket(100)}
          onAttend={handleGetAttendance}
    />
    <EventCard
      brand="Film Night"
      description="Enjoy a classic movie under the stars"
      discount="Nov 10, 9 PM"
      cost={50}
      stock="Limited seats"
      onGetTicket={() => handleGetTicket(50)}
          onAttend={handleGetAttendance}
    />
    <EventCard
      brand="Hackathon"
      description="Compete and create with fellow developers"
      discount="Dec 5-6"
      cost={200}
      stock="100 spots left"
      onGetTicket={() => handleGetTicket(200)}
          onAttend={handleGetAttendance}
    />
    <EventCard
      brand="Talent Show"
      description="Show off your skills and win prizes"
      discount="Nov 20, 6 PM"
      cost={80}
      stock="Rolling"
      onGetTicket={() => handleGetTicket(80)}
          onAttend={handleGetAttendance}
    />
    <EventCard
      brand="Career Fair"
      description="Connect with top companies and recruiters"
      discount="Oct 15, 10 AM"
      cost={0}
      stock="Unlimited"
      onGetTicket={() => handleGetTicket(0)}
          onAttend={handleGetAttendance}
    />
  </div>

  <div className="mt-5 rounded-lg border border-white/10 p-4">
    <h3 className="text-sm font-medium">Pricing model (demo)</h3>
    <p className="mt-1 text-xs text-slate-400">
      Prices for events are based on ticket costs and exclusive access.
    </p>
  </div>
</section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-lg leading-6">{value}</div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px]">
      <span className="size-1.5 rounded-full bg-yellow-400" />
      {children}
    </span>
  );
}

function Pill({ label, value, suffix }: { label: string; value: string | number; suffix?: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-gradient-to-br from-slate-800/40 to-slate-900/40 p-3">
      <div className="text-[11px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}{suffix ? <span className="ml-1 text-sm text-slate-400">{suffix}</span> : null}</div>
    </div>
  );
}

function EventCard({
  brand,
  description,
  discount,
  cost,
  stock,
  onGetTicket,
  onAttend,
}: {
  brand: string;
  description: string;
  discount: string;
  cost: number;
  stock: string;
  onGetTicket: () => void;
  onAttend: () => void;
}) {
  return (
    <div className="group rounded-xl border border-white/10 bg-gradient-to-br from-slate-800/40 to-slate-900/40 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">{brand}</h3>
        <span className="text-xs text-slate-400">{stock}</span>
      </div>
      <p className="mt-1 text-sm text-slate-400">{description}</p>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-2xl font-semibold">{discount}</div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Cost</div>
          <div className="text-lg font-semibold">{cost} <span className="text-sm text-slate-400">TOK</span></div>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        <button
          onClick={onGetTicket}
          className="rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/5"
        >
          Get Ticket!
        </button>
        <button
          onClick={onAttend}
          className="rounded-lg bg-white text-slate-900 px-3 py-2 text-sm font-semibold"
        >
          Attendance Confirmation
        </button>
      </div>
    </div>
  );
}