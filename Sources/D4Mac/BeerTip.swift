import SwiftUI

/// Mirror of the website's tagline list. Kept hardcoded (not fetched) so the
/// in-app experience works offline and the bundle has no extra network deps.
/// Two copies; if the list ever drifts, that's fine — they're independent
/// surfaces.
private let beerTaglines: [String] = [
    "Inarius would tip. Be unlike Lilith.",
    "Beer: the only legendary drop with a 100% rate.",
    "Helped you slay D4? Help me slay these bugs.",
    "Hops are the cheapest reagent on this table.",
    "One beer = one less curse on the codebase.",
    "Tip jar's open. Mephisto's not watching.",
    "$5 buys two more rounds of bug-hunting in Hell.",
    "Patch notes brewed in the cellar.",
    "Tyrael blesses generous tippers. Probably.",
    "Demons drink souls. I prefer pilsner.",
    "This launcher cost a weekend. Pay it forward in pints.",
    "Even Deckard Cain says: stay awhile, and tip.",
    "Battle-tested. Bottle-powered.",
    "Buy a beer, unlock zero achievements. Worth it anyway.",
    "Free as in beer. Tip as in beer.",
    "Free launcher. Five-buck beer. Math checks out.",
    "Andariel's Visage doesn't have a tip option. This does.",
    "Tipping the dev: +5 to Karma, untyped, doesn't stack.",
    "Sanctuary's saved. Tip the night-shift sysadmin.",
    "Loot dropped: 1× peace of mind. Crack a cold one.",
    "An IPA costs less than a Helltide reagent.",
    "If this worked first try, that was the lager.",
    "No DRM. No telemetry. Just vibes — and a beer fund.",
    "The codebase has 0 microtransactions. This is the only one.",
    "Lilith would never. You would.",
    "Hops: the unofficial 6th class.",
    "Click the button. The Lord of Terror commands it.",
    "Worship the brew. The brew keeps the lights on.",
    "If this saved you a Bootcamp reboot, throw a beer.",
    "Five bucks. One beer. Zero demons summoned.",
    "Patches don't write themselves. Pints help.",
    "Open-source vibes, closed-source bar tab.",
]

/// Dedicated tip landing page on the website; the button there drives the
/// Stripe checkout flow.
private let beerTipURL = URL(string: "https://d4mac.com/beer")!

struct BeerTipView: View {
    @State private var index: Int = 0
    private let timer = Timer.publish(every: 60, on: .main, in: .common).autoconnect()

    var body: some View {
        VStack(spacing: 12) {
            Text(beerTaglines[index])
                .font(.callout)
                .multilineTextAlignment(.center)
                .foregroundStyle(Color.appSubhead)
                .frame(maxWidth: 360, minHeight: 36)
                .fixedSize(horizontal: false, vertical: true)
                .id(index)
                .transition(.opacity)

            Button {
                NSWorkspace.shared.open(beerTipURL)
            } label: {
                HStack(spacing: 8) {
                    Image(systemName: "mug.fill")
                    Text("Buy me a beer")
                        .fontWeight(.semibold)
                }
                .font(.callout)
                .foregroundStyle(.white)
                .padding(.horizontal, 18)
                .padding(.vertical, 9)
                .background(
                    Capsule()
                        .fill(
                            LinearGradient(
                                colors: [.bnetBlueLight, .bnetBlue, .bnetBlueDeep],
                                startPoint: .top, endPoint: .bottom
                            )
                        )
                        .shadow(color: .bnetBlue.opacity(0.4), radius: 8, x: 0, y: 3)
                )
            }
            .buttonStyle(.plain)
        }
        .onAppear {
            // Randomise initial pick so two windows opened at the same minute
            // don't read the same line.
            index = Int.random(in: 0..<beerTaglines.count)
        }
        .onReceive(timer) { _ in
            withAnimation(.easeInOut(duration: 0.5)) {
                index = (index + 1) % beerTaglines.count
            }
        }
    }
}

#Preview {
    BeerTipView()
        .padding(40)
        .background(Color.appBgTop)
}
