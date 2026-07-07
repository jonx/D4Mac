# D4Mac

> Free, open-source Battle.net launcher for Apple Silicon Macs. Run Diablo IV
> and other Blizzard games natively. No CrossOver licence. No subscription.

🌐 [d4mac.com](https://d4mac.com) · 📥 [Download latest](https://github.com/MichaelLod/D4Mac/releases/latest) · 🐛 [Report an issue](https://github.com/MichaelLod/D4Mac/issues/new/choose) · 🍺 [Buy me a beer](https://d4mac.com/#beer)

---

> ### ⚙️ This is a community build (jonx fork)
>
> Unofficial build maintained at **[github.com/jonx/D4Mac](https://github.com/jonx/D4Mac)**
> while upstream is quiet — every change is also submitted upstream as a PR. Not
> affiliated with @MichaelLod; tips still go to him.
>
> **Supported**
> - **Hardware/OS:** Apple Silicon (M1–M4/M5), macOS 14 Sonoma or later.
> - **Diablo IV:** ✅ **confirmed working on the current patch — 3.1.0** (verified
>   end-to-end on `3.1.0.72698`, Season 14, 2026-07). 3.1.0 started importing
>   `FindNextFileNameW`, which stock Wine doesn't export, so the game aborts at
>   launch with **error 127** on other builds — this one adds the export, so it
>   launches to the menu and plays.
> - Blizzard can change the client on any patch; if a future D4 patch breaks launch,
>   [open an issue](https://github.com/jonx/D4Mac/issues) and it'll need a new build.
>
> **Good to know**
> - **Logging in works** — an emailed verification code, a **browser passkey**, or the
>   **Battle.net mobile app** push notification all work for signing in.
> - **D4Mac doesn't need network access.** It makes no game-server connections and
>   doesn't need the *"find devices on local network"* permission — that prompt comes
>   from **Battle.net** (its LAN peer-download feature) and is safe to **Deny**.
>   (D4Mac only reaches the internet to check for its own updates.)
> - **You can quit D4Mac once your game is running** — Battle.net and the game run as
>   independent processes and keep playing after the launcher closes.
> - **First-play stutter is normal.** Diablo IV compiles Metal shaders the first time you
>   cross into a new area or trigger a new effect, which causes brief hitches. They fade
>   as you play — the shader cache builds up and persists across sessions, so revisits and
>   later sessions are smooth. (Not a bug, and not specific to this build.)
> - **RAM matters.** Diablo IV wants ~20 GB of unified memory. Verified comfortable on a
>   **32 GB** Mac; on **16 GB** Macs expect heavy swapping and stutter — set **Texture
>   Quality to Low/Medium** and close other apps, or it'll struggle.

## What's different in this fork

Everything here is also open as an upstream PR — this build just bundles them while
upstream is between releases:

- **Diablo IV 3.1.0 launch fix** — exports `FindNextFileNameW` so the Season 14 client loads (else: error 127).
- **Battle.net installs on a clean Apple Silicon Mac** — bundles the x86_64 FreeType/GnuTLS chain, so no Intel Homebrew needed (fixes the blank-window / `BLZBNTBTS…` install failures). *(PR [#4](https://github.com/MichaelLod/D4Mac/pull/4))*
- **Fast downloads + stable gameplay** — Wine sync defaults to `None` and the Settings toggle actually works (fixes the ~4 KB/s throttle and mid-session freezes). *(PR [#4](https://github.com/MichaelLod/D4Mac/pull/4))*
- **Live install progress bar** (%, GB, MB/s). *(PR [#4](https://github.com/MichaelLod/D4Mac/pull/4))*
- **Import an existing Diablo IV install** — reuse a CrossOver/Porting Kit/Whisky/GPTK download instead of re-downloading ~140 GB. *(PR [#6](https://github.com/MichaelLod/D4Mac/pull/6))*
- **Move bottle to another disk** — put everything on an external SSD, linked back invisibly. *(PR [#9](https://github.com/MichaelLod/D4Mac/pull/9))*
- **Reset launcher state** — one-click fix for Battle.net stuck on "Update — Queued." *(PR [#8](https://github.com/MichaelLod/D4Mac/pull/8))*
- **Metal FPS/HUD toggle.** *(PR [#7](https://github.com/MichaelLod/D4Mac/pull/7))*
- **Signed + notarized** — clean double-click install (no right-click bypass).

## Credits & respect

- **[@MichaelLod](https://github.com/MichaelLod)** — created D4Mac. All the hard parts (the Wine/GPTK stack, the launcher) are his. **Tips go to him**, via the in-app button and [d4mac.com](https://d4mac.com).
- **[@BastianOrth2](https://github.com/MichaelLod/D4Mac/pull/4)** — the FreeType/GnuTLS bundling, sync-off default, and progress bar (PR [#4](https://github.com/MichaelLod/D4Mac/pull/4)).
- **@0ximu** — deep diagnostics in [issue #2](https://github.com/MichaelLod/D4Mac/issues/2) (missing-library cascade, sync deadlocks, launcher-state reset, external-SSD setup).
- **[@jonx](https://github.com/jonx/D4Mac)** (this fork) — the Diablo IV 3.1.0 fix, plus [#6](https://github.com/MichaelLod/D4Mac/pull/6) (import existing install), [#7](https://github.com/MichaelLod/D4Mac/pull/7) (Metal HUD), [#8](https://github.com/MichaelLod/D4Mac/pull/8) (reset launcher state) and [#9](https://github.com/MichaelLod/D4Mac/pull/9) (external-drive move).

This fork is a stopgap and will happily be obsoleted by an official release.

## What it is

A native macOS `.app` that wraps a self-contained Wine 11.0 + Apple Game
Porting Toolkit 3.0 stack, set up specifically to run Battle.net and
Diablo IV on Apple Silicon. Drag-to-Applications, double-click, log into
Battle.net, play.

The launcher itself is MIT-licensed open source. The `.app` bundle ships
third-party binaries (Wine, GPTK, DXMT, MoltenVK, MS VC++ Redist, Adobe
Source Han Sans) — see [`THIRD_PARTY_LICENSES.md`](./THIRD_PARTY_LICENSES.md)
for the full breakdown.

## Status

| Game / app                  | Status                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| Battle.net                  | ✓ launches, login + chat work, keyboard works                                               |
| Diablo IV                   | ✓ playable end-to-end · **patch 3.1.0 confirmed working (3.1.0.72698, 2026-07)**             |
| First-launch shader compile | ⚠ ~50 % of the time it hangs once on the Metal pipeline race; second launch always works    |
| Other Blizzard titles       | not tested — try and [open an issue](https://github.com/MichaelLod/D4Mac/issues/new/choose) |

## Requirements

- Apple Silicon Mac (M1, M2, M3, M4 — any)
- macOS 14 (Sonoma) or later
- ~400 MB free for the `.app` bundle, plus space for the Battle.net + game install (Diablo IV is ~80 GB)
- Apple ID (only if Gatekeeper prompts you to verify the bundle on first launch)

Intel Macs are not supported and will not be — Apple's GPTK is Apple-Silicon-only.

## Install

1. Grab the latest signed `D4Mac.dmg` from the [Releases page](https://github.com/MichaelLod/D4Mac/releases/latest).
2. Open it, drag `D4Mac.app` to `/Applications`.
3. Launch it. The first run unpacks Wine and runs the Battle.net installer; it takes ~2 minutes.
4. Log in to Battle.net, install your game, play.

If a launch ever gets weird (Battle.net hangs, login fails repeatedly), open
**Settings → Reset bottle**. The reset rebuilds the bottle from the bundled
prereqs — your `D4Mac.app` itself stays untouched.

## Why this exists

Battle.net + Diablo IV on Apple Silicon already work via CrossOver, but
CrossOver is $74 and bundles features most users don't need. Apple's GPTK
is free for non-commercial redistribution, and Wine has been LGPL since
forever. There was no reason this had to cost anything — so it doesn't.

D4Mac is funded entirely by [beer tips](https://d4mac.com/#beer).
Optional, never gated, no nag.

## Build from source

```bash
git clone https://github.com/MichaelLod/D4Mac.git
cd D4Mac
Resources/Fonts/fetch.sh   # downloads MS Core Fonts (one-time)
Prereqs/fetch.sh           # downloads VC++ Redistributable (one-time)
# build.sh also auto-runs Prereqs/fetch-wine-libs.py to stage the x86_64
# FreeType/GnuTLS chain into the Wine runtime (one-time, ~8 MB from GHCR).
./build.sh                 # debug build
./build.sh --release       # optimised
./build.sh --release --notarize --dmg   # full release pipeline
```

You'll also need a built Wine 11.0 runtime staged at `../wine-cx26.1/`.
See [`THIRD_PARTY_LICENSES.md`](./THIRD_PARTY_LICENSES.md) for sources, or
the LGPL CodeWeavers release at [media.codeweavers.com/pub/crossover/source/](https://media.codeweavers.com/pub/crossover/source/).

`build.sh --release --notarize --dmg` produces a signed + notarised DMG ready for distribution. Notarisation requires:

- Developer ID Application certificate installed in your keychain
- Apple notarytool credentials saved as profile name `D4Mac` (`xcrun notarytool store-credentials D4Mac …`)

## Architecture

```
   ┌──────────────────────┐
   │   D4Mac.app (Swift)  │   SwiftUI launcher: bottle manager,
   │                      │   first-run installer, Battle.net launcher
   └──────────┬───────────┘
              │ spawns
              ▼
   ┌──────────────────────┐
   │   Wine 11.0 (LGPL)   │   PE loader, kernel32, ntdll, …
   │  + Apple GPTK 3.0    │   D3D12 / D3D11 (64-bit) → Metal forwarders
   │  + DXMT v0.72        │   D3D11 / DXGI (32-bit, BNet CEF) → Metal
   │  + MoltenVK          │   Vulkan fallback
   └──────────────────────┘
```

The whole runtime lives inside the `.app` bundle at
`Contents/SharedSupport/Wine/`. No system-wide install, no PATH
manipulation, no admin password.

## Repository layout

| Path                         | Purpose                                                                                              |
| ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| `Sources/D4Mac/`             | SwiftUI launcher source                                                                              |
| `Resources/`                 | App icon, `Info.plist`, fonts, entitlements                                                          |
| `Resources/Fonts/fetch.sh`   | One-time fetch of MS Core Fonts For The Web                                                          |
| `Prereqs/fetch.sh`           | One-time fetch of VC++ Redistributable installers                                                    |
| `Prereqs/fetch-wine-libs.py` | Stages the x86_64 FreeType/GnuTLS chain into Wine's `lib/external` (GHCR bottles)                    |
| `web/`                       | The [d4mac.com](https://d4mac.com) Next.js site (download landing page, BMC tip checkout, dashboard) |
| `build.sh`                   | Build / notarise / DMG packaging                                                                     |
| `THIRD_PARTY_LICENSES.md`    | Per-component licence breakdown                                                                      |
| `LICENSE`                    | MIT — for the launcher source only                                                                   |

## Reporting issues

Use [GitHub Issues](https://github.com/MichaelLod/D4Mac/issues/new/choose).
Include:

- macOS version (e.g. _14.5 Sonoma_)
- Mac model (e.g. _MacBook Pro M3 Pro_)
- D4Mac version (Settings → About)
- Logs from `~/Library/Logs/D4Mac/`
- Screenshots if you have them

## Licence

Launcher source: **MIT** — see [`LICENSE`](./LICENSE).

The `.app` bundle ships third-party binaries with their own licences.
Most importantly, **Apple's GPTK is redistributable for non-commercial
use only**, which means D4Mac itself can be freely distributed for
download but **may not be sold** while GPTK is bundled. See
[`THIRD_PARTY_LICENSES.md`](./THIRD_PARTY_LICENSES.md) for every
component and its terms.

## Not affiliated

D4Mac is a community project. Not affiliated with, endorsed by, or
sponsored by Blizzard Entertainment, Apple Inc., or CodeWeavers Inc.
"Diablo" and "Battle.net" are trademarks of Blizzard Entertainment.
