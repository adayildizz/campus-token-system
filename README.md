# 🎓 Campus Token App

A blockchain-based campus experience platform that empowers students to use their phones for identity, access, and event participation.  
Our vision is to merge **student life** with **Web3 primitives**, enabling secure, non-transferable digital assets that represent real campus privileges.

---

## ✨ Features

- **Campus Access via Phone**
  - Students can enter the campus area using their wallet and a verified on-chain studentship NFT.

- **Studentship NFT (SBT)**
  - Non-transferable, on-chain proof of enrollment.
  - Acts as the foundation of the student’s digital campus identity.

- **Event Tickets as NFTs**
  - Buy tickets to concerts, seminars, and campus activities directly as NFTs.
  - Respects ownership and transfer logic.

- **POAP (Proof of Attendance)**
  - Receive a **non-transferable POAP NFT** when attending events.
  - Creates an immutable record of campus engagement.

- **Campus Token**
  - Utility token for payments, rewards, and on-chain interactions.

---

## 📚 Smart Contracts

All smart contracts are developed in **Clarity** (Stacks blockchain) and deployed to the **testnet**.

1. **Token Contract** – Fungible utility token compliant with SIP-010 standard.  
2. **NFT Contract** – Standard transferable NFTs (e.g., event tickets).  
3. **Buy-NFT Contract** – Handles marketplace logic for purchasing NFTs.  
4. **SBT Contract** – Soulbound Studentship NFTs (non-transferable).  
5. **POAP Contract** – Non-transferable NFTs representing attendance proof.

Each contract is:
- ✅ **Developed**
- ✅ **Tested**
- ✅ **Deployed to Testnet**

---

## 💻 User Interface

- Current UI is a **prototype** that visualizes the long-term vision.  
- Functionality is minimal and may appear **broken or incomplete**, but it demonstrates:
  - Connecting wallet
  - Displaying token/NFT balances
  - Showing event ticketing flow
  - Highlighting proof-of-attendance mechanics

---

## 🛠️ Tech Stack

- **Blockchain**: Stacks Testnet (Clarity smart contracts)  
- **Frontend**: React / Next.js (prototype)  
- **Wallets**: Leather Wallet (for interaction & signing)  
- **Testing**: Clarinet  

---

## 🚀 Getting Started

### Prerequisites
- [Clarinet](https://github.com/hirosystems/clarinet) installed for testing contracts
- [Leather Wallet](https://leather.io/) for interacting with Stacks testnet
- Node.js (v18+) and Yarn/NPM for frontend
