const stripe = require("stripe")(
  "sk_test_51OlWaLDTWn8Wuwsr5BINSR2IjyNYldYqigWhncPsPl0PIhYBOueNfhX9RmbfXNsI4FTJvuS6GeRL6PsB60ajx3Ko00trh18mCM"
);
const create = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "email is required" });
  }
  try {
    const accounts = await stripe.accounts.create({
      type: "express", // Use 'express' type for simplicity
      country: "US",
      email: email,
    });

    const accountLink = await stripe.accountLinks.create({
      account: accounts.id,
      refresh_url: "https://example.com/reauth",
      return_url: "https://example.com/return",
      type: "account_onboarding",
    });

    console.log("Stripe account created:", accounts);

    res.status(200).json({ accountId: accounts.id, url: accountLink.url });
  } catch (error) {
    console.error("Error creating Stripe account:", error);

    res.status(500).json({
      success: false,
      message: "Error creating Stripe account",
      error: error.message,
    });
  }
};
const updateAccount = async (req, res) => {
  const { accountId } = req.body;
  if (!accountId) {
    return res.status(400).json({ message: "Account ID is required" });
  }
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: "https://example.com/reauth",
      return_url: "https://example.com/return",
      type: "account_onboarding",
    });

    res.status(200).json({ url: accountLink.url });
  } catch (error) {
    console.error("Error creating Stripe account:", error);

    res.status(500).json({
      success: false,
      message: "Error creating Stripe Link",
      error: error.message,
    });
  }
};

const get = async (req, res) => {
  try {
    // Validate the input
    const { accountId } = req.body;
    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    // Retrieve the Stripe account
    const account = await stripe.accounts.retrieve(accountId);

    // Check if the account is verified
    const isVerified = account.charges_enabled && account.payouts_enabled;

    // Return the account information with verification status
    res.status(200).json({
      message: "Account retrieved successfully",

      verificationStatus: isVerified
        ? "Account is verified"
        : "Account is not verified",
    });
  } catch (error) {
    console.error("Error retrieving account:", error);

    // Handle Stripe errors
    if (error.type === "StripeInvalidRequestError") {
      return res.status(400).json({
        message: "Invalid request to Stripe API",
        details: error.message,
      });
    }

    // Handle other possible errors
    return res
      .status(500)
      .json({ message: "Internal Server Error", details: error.message });
  }
};

const sentMoney = async (req, res) => {
  const { accountId, amount } = req.body;
  try {
    const transfer = await stripe.transfers.create({
      amount: amount,
      currency: "usd",
      destination: accountId,
    });
    const payout = await stripe.payouts.create(
      {
        amount: amount,
        currency: "usd",
      },
      {
        stripeAccount: accountId,
      }
    );
    console.log(transfer, payout, "payout");
    res.status(200).json({ message: "Sent Succes" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
module.exports = { create, get, sentMoney, updateAccount };
