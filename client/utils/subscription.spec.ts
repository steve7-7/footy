import { describe, expect, it } from "vitest";
import {
  SUBSCRIPTION_LANDING_PATH,
  SUBSCRIPTION_VERIFICATION_PATH,
  getSubscriptionCheckoutUrl,
} from "./subscription";

describe("subscription checkout helpers", () => {
  it("always redirects Paystack returns through the verification page", () => {
    const checkoutUrl = new URL(
      getSubscriptionCheckoutUrl("https://example.test"),
    );

    expect(checkoutUrl.searchParams.get("redirect_url")).toBe(
      `https://example.test${SUBSCRIPTION_VERIFICATION_PATH}`,
    );
  });

  it("keeps the internal subscription landing route separate from payment verification", () => {
    expect(SUBSCRIPTION_LANDING_PATH).toBe("/subscribe");
    expect(SUBSCRIPTION_VERIFICATION_PATH).toBe("/predictions");
  });
});
