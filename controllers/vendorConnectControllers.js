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
    console.log("Stripe account link created:", accountLink);

    // Redirect the vendor to the Stripe account onboarding flow
    // res.redirect(accountLink.url);
  } catch (error) {
    console.error("Error creating Stripe account:", error);
    // Send error response
    res.status(500).json({
      success: false,
      message: "Error creating Stripe account",
      error: error.message,
    });
  }
};
const get = async (req, res) => {
  const account = await stripe.accounts.retrieve("acct_1PEegdRkzWdWYv5p");
  res.status(200).json({ message: account });
  console.log(account, "account");
};

const sentMoney = async (req, res) => {
  try {
    const transfer = await stripe.transfers.create({
      amount: 100,
      currency: "usd",
      destination: "acct_1PEegdRkzWdWYv5p",
    });
    console.log(transfer, "payout");
    res.send(transfer);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
module.exports = { create, get, sentMoney };
