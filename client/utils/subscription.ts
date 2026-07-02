export const SUBSCRIPTION_URL =
  "https://paystack.com/buy/today-predictions-vbmpjc";
export const SUBSCRIPTION_LANDING_PATH = "/subscribe";
export const SUBSCRIPTION_VERIFICATION_PATH = "/predictions";
export const PAYSTACK_REFERENCE_PARAMS = ["reference", "trxref"];

export function getSubscriptionCheckoutUrl(
  origin: string = window.location.origin,
) {
  const checkoutUrl = new URL(SUBSCRIPTION_URL);
  checkoutUrl.searchParams.set(
    "redirect_url",
    `${origin}${SUBSCRIPTION_VERIFICATION_PATH}`,
  );
  return checkoutUrl.toString();
}

export function goToSubscriptionLanding() {
  window.location.href = SUBSCRIPTION_LANDING_PATH;
}
