// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "D4Mac",
    platforms: [.macOS(.v14)],
    targets: [
        .executableTarget(
            name: "D4Mac",
            path: "Sources/D4Mac"
        )
    ]
)
