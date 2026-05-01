import SwiftUI

@main
struct D4MacApp: App {
    @StateObject private var bottle = BottleManager()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(bottle)
                .frame(minWidth: 480, minHeight: 360)
                .task { await bottle.refresh() }
                .preferredColorScheme(.dark)
                .tint(.bnetBlue)
        }
        .windowStyle(.hiddenTitleBar)
        .windowResizability(.contentSize)
        .commands {
            CommandGroup(replacing: .newItem) {}
        }

        Settings {
            SettingsView()
                .environmentObject(bottle)
                .frame(width: 460, height: 340)
                .preferredColorScheme(.dark)
                .tint(.bnetBlue)
        }
    }
}
