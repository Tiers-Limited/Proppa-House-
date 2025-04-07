const PropertySearchRequest = require("../../../models/PropertySearchRequest");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const PACKAGE_PRICE = 5000; // Dummy amount in cents (50 EUR)

exports.submitPropertySearch = async (req, res) => {
  try {
    const {
      phoneNumber,
      fullName,
      email,
      preferredContactMethod,
      propertyPreferences,
      locationAndBudget,
      moveInAssistance,
    } = req.body;

    // Create a new property search request
    const newRequest = new PropertySearchRequest({
      phoneNumber,
      fullName,
      email,
      preferredContactMethod,
      propertyPreferences,
      locationAndBudget,
      moveInAssistance,
    });

    await newRequest.save();

    // Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Property Search Request",
            },
            unit_amount: PACKAGE_PRICE,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/property-search-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/property-search-cancel`,
      metadata: {
        propertySearchRequestId: newRequest._id.toString(),
      },
    });

    newRequest.stripeSessionId = session.id;
    await newRequest.save();

    return res.status(200).json({
      message: "Property search request created successfully",
      checkoutUrl: session.url,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.handleStripeSuccess = async (req, res) => {
  try {
    const { session_id } = req.query;

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const propertySearchRequest = await PropertySearchRequest.findOne({
      stripeSessionId: session.id,
    });

    if (!propertySearchRequest) {
      return res
        .status(404)
        .json({ message: "Property search request not found" });
    }

    propertySearchRequest.status = "Paid";
    await propertySearchRequest.save();

    return res.redirect(
      `${process.env.FRONTEND_URL}/property-search-success?paid=true`
    );
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
