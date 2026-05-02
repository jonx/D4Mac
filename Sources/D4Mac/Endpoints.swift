import Foundation

enum Endpoints {
    /// Base URL for the storefront. Debug builds (default `swift build`) use
    /// localhost; release builds (`swift build -c release` via `build.sh`)
    /// use the production domain.
#if DEBUG
    static let baseURL = URL(string: "http://localhost:3000")!
#else
    static let baseURL = URL(string: "https://d4mac.com")!
#endif

    /// Public skin shop landing page, listing all paid SKUs with previews.
    static let skinsPageURL = baseURL.appending(path: "skins")

    /// Direct buy link — server creates a Stripe Checkout session and 303s
    /// to it. Use this for "click locked chip → straight to payment".
    static func buyURL(for skinId: String) -> URL {
        var components = URLComponents(
            url: baseURL.appending(path: "api/checkout"),
            resolvingAgainstBaseURL: false
        )!
        components.queryItems = [URLQueryItem(name: "sku", value: skinId)]
        return components.url!
    }
}
