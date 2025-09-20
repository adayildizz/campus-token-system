export default function TokensDashboard() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-16 space-y-10">
        {/* Page header */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Cafe Rewards</h1>
            <p className="text-slate-400 mt-1">Sync your GitHub, claim tokens, and spend them on coffee discounts.</p>
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
                  <span className="text-xs text-slate-400">Required step</span>
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  Connect your GitHub to earn tokens based on your public activity.
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <button className="group relative inline-flex items-center gap-2 rounded-lg border border-sky-500/40 bg-sky-600/20 px-4 py-2 text-sm font-medium hover:bg-sky-600/30 transition">
                    {/* GitHub mark */}
                    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 fill-current">
                      <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.6-4.04-1.6-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.85 1.24 1.85 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.32.47-2.39 1.24-3.23-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.47 11.47 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.3c0 .32.21.7.82.58A12 12 0 0 0 12 .5Z"/>
                    </svg>
                    Sync GitHub
                  </button>

                  <span className="text-xs text-slate-400">No private access requested.</span>
                </div>
              </section>

              {/* Claim Tokens */}
              <section className="rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-medium">Claim Tokens</h2>
                  <Badge>Wallet not connected</Badge>
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  Tokens are minted from your public GitHub footprint. Claim them after syncing.
                </p>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <Pill label="Claimable" value="0" suffix="TOK" />
                  <Pill label="Lifetime" value="0" suffix="TOK" />
                  <Pill label="Spent" value="0" suffix="TOK" />
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button className="inline-flex items-center justify-center rounded-lg bg-amber-500/90 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-50" disabled>
                    Claim Tokens
                  </button>
                  <button className="inline-flex items-center justify-center rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/5">
                    Connect Wallet
                  </button>
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  You’ll be able to claim once GitHub is synced and allocation is calculated.
                </p>
              </section>
            </div>

            {/* Discounts showcase */}
            <section className="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-medium">Coffee Discounts</h2>
                <span className="text-xs text-slate-400">Spend tokens to unlock drinks</span>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DiscountCard
                  brand="Espresso Shot"
                  description="Strong and bold pick-me-up"
                  discount="30% off"
                  cost={80}
                  stock="Unlimited"
                />
                <DiscountCard
                  brand="Cappuccino"
                  description="Classic Italian with frothy milk"
                  discount="20% off"
                  cost={100}
                  stock="250 left"
                />
                <DiscountCard
                  brand="Latte"
                  description="Smooth and creamy delight"
                  discount="25% off"
                  cost={120}
                  stock="200 left"
                />
                <DiscountCard
                  brand="Cold Brew"
                  description="Chilled slow-brewed coffee"
                  discount="15% off"
                  cost={90}
                  stock="Rolling"
                />
                <DiscountCard
                  brand="Mocha"
                  description="Chocolate flavored indulgence"
                  discount="35% off"
                  cost={140}
                  stock="Invite-only"
                />
                <DiscountCard
                  brand="Flat White"
                  description="Velvety microfoam texture"
                  discount="40% off"
                  cost={150}
                  stock="120 left"
                />
              </div>

              <div className="mt-5 rounded-lg border border-white/10 p-4">
                <h3 className="text-sm font-medium">Pricing model (demo)</h3>
                <p className="mt-1 text-xs text-slate-400">
                  For demo purposes, each <span className="font-semibold text-slate-200">1% discount ≈ 4 TOK</span>.
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

function DiscountCard({ brand, description, discount, cost, stock }: { brand: string; description: string; discount: string; cost: number; stock: string }) {
  return (
    <div className="group rounded-xl border border-white/10 bg-gradient-to-br from-slate-800/40 to-slate-900/40 p-4 hover:from-slate-800/60 hover:to-slate-900/60 transition">
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

      <div className="mt-4 flex items-center gap-2">
        <button className="flex-1 rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/5 disabled:opacity-50" disabled>
          Redeem
        </button>
        <button className="rounded-lg bg-white text-slate-900 px-3 py-2 text-sm font-semibold disabled:opacity-50" disabled>
          Details
        </button>
      </div>
    </div>
  );
}
