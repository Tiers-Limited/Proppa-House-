const PropertyViewingRequest = require("../../../models/PropertyViewingRequest");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const PACKAGE_PRICES = {
  Basic: 2000, // in cents (20 EUR)
  Pro: 4000, // in cents (40 EUR)
};

exports.createViewingRequest = async (req, res) => {
  try {
    const {
      userId,
      howFound,
      url,
      city,
      postalCode,
      street1,
      street2,
      street3,
      country,
      nameOfAgencyOrOwner,
      contactDetails,
      communicatedBefore,
      communicationExplanation,
      hasConcerns,
      concernExplanation,
      preferredLanguage,
      requestEarlyInspection,
      preferredDate,
      wantsOtherCommunication,
      communicationEmail,
      promoCode,
      viewingPackage,
    } = req.body;

    const newRequest = new PropertyViewingRequest({
      userId,
      howFound,
      url,
      city,
      postalCode,
      street1,
      street2,
      street3,
      country,
      nameOfAgencyOrOwner,
      contactDetails,
      communicatedBefore,
      communicationExplanation: communicatedBefore
        ? communicationExplanation
        : null,
      hasConcerns,
      concernExplanation: hasConcerns ? concernExplanation : null,
      preferredLanguage,
      requestEarlyInspection,
      preferredDate: requestEarlyInspection ? preferredDate : null,
      wantsOtherCommunication,
      communicationEmail: wantsOtherCommunication ? communicationEmail : null,
      promoCode,
      viewingPackage,
    });

    await newRequest.save();

    // Stripe Checkout Session
    const baseAmount = PACKAGE_PRICES[viewingPackage];
    const finalAmount = requestEarlyInspection
      ? Math.ceil(baseAmount * 1.4)
      : baseAmount;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${viewingPackage} Property Viewing Package`,
            },
            unit_amount: finalAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/viewing-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}`,
      metadata: {
        viewingRequestId: newRequest._id.toString(),
      },
    });

    newRequest.stripeSessionId = session.id;
    await newRequest.save();

    return res.status(200).json({
      message: "Property viewing request created successfully",
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

    const viewingRequest = await PropertyViewingRequest.findOne({
      stripeSessionId: session.id,
    });

    if (!viewingRequest) {
      return res.status(404).json({ message: "Viewing request not found" });
    }

    viewingRequest.paymentStatus = "Paid";
    await viewingRequest.save();

    return res.redirect(
      `${process.env.FRONTEND_URL}/viewing-success?paid=true`
    );
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
