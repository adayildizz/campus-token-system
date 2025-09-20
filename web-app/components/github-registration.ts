import {
  fetchCallReadOnlyFunction,
  stringAsciiCV,
  principalCV,
  uintCV,
  cvToJSON,
  cvToHex,
  contractPrincipalCV,
  type ClarityValue,
} from '@stacks/transactions';
import { request as connectRequest } from '@stacks/connect';
import { StacksNetwork } from '@stacks/network';


type NetworkName = 'testnet' | 'mainnet';

const DEFAULT_API: Record<NetworkName, string> = {
  mainnet: 'https://api.mainnet.hiro.so',
  testnet: 'https://api.testnet.hiro.so',
};

export interface GitHubUser {
  githubUsername: string;
  registrationDate: number;
  totalEarned: bigint;
  totalSpent: bigint;
  isActive: boolean;
}

export interface CafeItem {
  name: string;
  price: bigint;
  formattedPrice: string;
}

export interface PurchaseResult {
  purchaseId: number;
  item: string;
  price: bigint;
  message: string;
}

/** Just the .value tree from cvToJSON */
function getJSONValue(cv: ClarityValue): any {
  return (cvToJSON(cv) as any).value;
}

/** Encode Clarity args as hex strings (Leather expects string[]) */
const hexArgs = (args: ClarityValue[]) => args.map(cv => cvToHex(cv));

/** Use Leather if available, else fall back to @stacks/connect */
async function walletRequest<M extends string, P extends object>(
  method: M,
  params: P
): Promise<any> {
  const provider = (globalThis as any)?.LeatherProvider?.request;
  if (typeof provider === 'function') {
    return provider(method, params);
  }
  return connectRequest(method as any, params as any);
}

export class GitHubTokenManager {
  private contractAddress: string;
  private network: NetworkName;
  private client: { baseUrl: string };

  constructor(contractAddress: string, network: NetworkName = 'testnet', apiBaseUrl?: string) {
    this.contractAddress = contractAddress; // e.g. STXXXX...
    this.network = network;
    this.client = { baseUrl: apiBaseUrl ?? DEFAULT_API[network] };
  }

  // ---------- WRITES (signed in wallet) ----------

  async registerGitHubUser(githubUsername: string) {
    
    return walletRequest('stx_callContract', {
      contract: `${this.contractAddress}.github-registry`,
      functionName: 'register-github-user',
      functionArgs: hexArgs([stringAsciiCV(githubUsername)]),
      
    });
  }


  async mintTokensToUser(amount: bigint, recipient: string) {
    return walletRequest('stx_callContract', {
      contract: `${this.contractAddress}.study-token`,
      functionName: 'mint',
      functionArgs: hexArgs([uintCV(amount), principalCV(recipient)]),
    });
  }

  async updateEarnedTokens(userAddress: string, amount: bigint) {
    return walletRequest('stx_callContract', {
      contract: `${this.contractAddress}.github-registry`,
      functionName: 'update-earned-tokens',
      functionArgs: hexArgs([principalCV(userAddress), uintCV(amount)]),
    });
  }

  async transferTokens(amount: bigint, sender: string, recipient: string) {
    // Ensure this matches your contract’s transfer signature
    return walletRequest('stx_callContract', {
      contract: `${this.contractAddress}.study-token`,
      functionName: 'transfer',
      functionArgs: hexArgs([uintCV(amount), principalCV(sender), principalCV(recipient)]),
    });
  }

  async purchaseCafeItem(itemName: string) {
    const res = await walletRequest('stx_callContract', {
      contract: `${this.contractAddress}.cafe-system`,
      functionName: 'purchase-item',
      functionArgs: hexArgs([
        stringAsciiCV(itemName),
        contractPrincipalCV(this.contractAddress, 'study-token'),
      ]),
    });
    const result: PurchaseResult = {
      purchaseId: 0,
      item: itemName,
      price: BigInt(0),
      message: 'Purchase submitted! Check your transaction.',
    };
    return { ...result, txid: (res as any)?.result?.txid ?? (res as any)?.txid };
  }

  // ---------- READS (no signature) ----------
  // These still take CV objects and DO include network + client + senderAddress.

//   network = new StacksNetwork({
//   url: 'https://stacks-node-api.testnet.stacks.co', // testnet endpoint
// });

async simulateRegister(githubUsername: string, contractAddress: string) {
  const [deployer, contractName] = contractAddress.split('.');
  
  const result = await fetchCallReadOnlyFunction({
    contractAddress: deployer,
    contractName,
    functionName: 'register-github-user',
    functionArgs: [stringAsciiCV(githubUsername)],
    network: this.network,
    senderAddress: 'ST1S0VTM4F4FSMQK9AJWCWAE8GGS8FTSJQGGNRKCP',
    client: this.client,
  });
  return result;
  console.log("Simulation result:", result);
}

  async getGitHubUsername(walletAddress: string): Promise<string | null> {
    const cv = await fetchCallReadOnlyFunction({
      contractAddress: this.contractAddress,
      contractName: 'github-registry',
      functionName: 'get-github-by-address',
      functionArgs: [principalCV(walletAddress)],
      senderAddress: walletAddress,
      network: this.network,
      client: this.client,
    });
    const v = getJSONValue(cv);
    return v?.value ?? null;
  }

  async getWalletByGitHub(githubUsername: string, senderAddress: string): Promise<string | null> {
    const cv = await fetchCallReadOnlyFunction({
      contractAddress: this.contractAddress,
      contractName: 'github-registry',
      functionName: 'get-address-by-github',
      functionArgs: [stringAsciiCV(githubUsername)],
      senderAddress,
      network: this.network,
      client: this.client,
    });
    const v = getJSONValue(cv);
    return v?.value ?? null;
  }

  async getUserProfile(walletAddress: string): Promise<GitHubUser | null> {
    const cv = await fetchCallReadOnlyFunction({
      contractAddress: this.contractAddress,
      contractName: 'github-registry',
      functionName: 'get-user-profile',
      functionArgs: [principalCV(walletAddress)],
      senderAddress: walletAddress,
      network: this.network,
      client: this.client,
    });
    const root = getJSONValue(cv);
    if (!root) return null;
    const p = root.value;
    return {
      githubUsername: p['github-username']?.value ?? '',
      registrationDate: Number(p['registration-date']?.value ?? 0),
      totalEarned: BigInt(p['total-earned']?.value ?? '0'),
      totalSpent: BigInt(p['total-spent']?.value ?? '0'),
      isActive: Boolean(p['is-active']?.value),
    };
  }

  async getTokenBalance(walletAddress: string): Promise<bigint> {
    const cv = await fetchCallReadOnlyFunction({
      contractAddress: this.contractAddress,
      contractName: 'study-token',
      functionName: 'get-balance',
      functionArgs: [principalCV(walletAddress)],
      senderAddress: walletAddress,
      network: this.network,
      client: this.client,
    });
    const v = getJSONValue(cv);
    return BigInt(v?.value ?? '0');
  }

  async getCafeItemPrice(itemName: string, senderAddress: string): Promise<bigint | null> {
    const cv = await fetchCallReadOnlyFunction({
      contractAddress: this.contractAddress,
      contractName: 'cafe-system',
      functionName: 'get-item-price',
      functionArgs: [stringAsciiCV(itemName)],
      senderAddress,
      network: this.network,
      client: this.client,
    });
    const v = getJSONValue(cv);
    return v ? BigInt(v.value) : null;
  }

  async getCafeMenu(senderAddress: string): Promise<CafeItem[]> {
    const items = ['espresso', 'cappuccino', 'latte', 'americano', 'croissant', 'sandwich', 'muffin', 'cookie'];
    const out: CafeItem[] = [];
    for (const name of items) {
      const price = await this.getCafeItemPrice(name, senderAddress);
      if (price !== null) out.push({ name, price, formattedPrice: this.formatTokenAmount(price) });
    }
    return out;
  }

  // ---------- Utils ----------

  formatTokenAmount(amount: bigint, decimals: number = 6): string {
    const divisor = BigInt(10 ** decimals);
    const whole = amount / divisor;
    const frac = amount % divisor;
    if (frac === BigInt(0)) return whole.toString();
    const fracStr = frac.toString().padStart(decimals, '0');
    return `${whole}.${fracStr}`.replace(/\.?0+$/, '');
  }

  parseTokenAmount(amount: string, decimals: number = 6): bigint {
    const [w = '0', f = '0'] = amount.split('.');
    const whole = BigInt(w);
    const fracPadded = f.padEnd(decimals, '0').slice(0, decimals);
    return whole * BigInt(10 ** decimals) + BigInt(fracPadded || '0');
  }
}
