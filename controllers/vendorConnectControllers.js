const stripe = require("stripe")(
  "sk_test_51OlWaLDTWn8Wuwsr5BINSR2IjyNYldYqigWhncPsPl0PIhYBOueNfhX9RmbfXNsI4FTJvuS6GeRL6PsB60ajx3Ko00trh18mCM"
);
const create = async (req, res) => {
  const { email } = req.body;
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
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: "https://example.com/reauth",
      return_url: "https://example.com/return",
      type: "account_onboarding",
    });

    console.log("Stripe account created:", accounts);

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
  const { accountId } = req.body;
  const account = await stripe.accounts.retrieve(accountId);
  res.status(200).json({ message: account });
  console.log(account, "account");
};

const sentMoney = async (req, res) => {
  const { accountId, amount } = req.body;
  try {
    const transfer = await stripe.transfers.create({
      amount: amount,
      currency: "usd",
      destination: accountId,
    });
    const payout = await stripe.payouts.create({
      amount: amount * 100,
      currency: "usd",
      destination: accountId,
    });
    console.log(transfer, "payout");
    res.status(200).json({ message: "Sent Succes" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = { create, get, sentMoney, updateAccount };
