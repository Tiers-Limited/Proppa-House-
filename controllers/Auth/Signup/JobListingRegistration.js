const JobListing = require("../../../models/JobListing");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const packagePricing = {
  "Free Listing": { amount: 0, interval: "month" },
  "Stater Plan": { amount: 2000, interval: "3-months" },
  "Growth Plan": { amount: 4000, interval: "6-months" },
  "Pro Plan": { amount: 6500, interval: "1-year" },
};

exports.registerForJobListing = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      postalCode,
      role,
      companyName,
      companyRegistrationCode,
      position,
      landlordDetails,
      propertyOwnerDetails,
      listingPackage,
    } = req.body;

    if (!packagePricing[listingPackage]) {
      return res.status(400).json({ message: "Invalid package selected" });
    }

    // Save user registration
    const registration = new JobListing({
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      postalCode,
      role,
      status: "Inactive",
      companyName,
      companyRegistrationCode,
      position,
      landlordDetails,
      propertyOwnerDetails,
      listingPackage,
    });

    await registration.save();

    if (listingPackage === "Free Listing") {
      registration.isPaid = true;
      registration.status = "Active";
      await registration.save();

      return res.status(200).json({
        message: "Registered with Free Listing. No payment required.",
        registration,
      });
    }

    // Create Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: listingPackage,
            },
            unit_amount: packagePricing[listingPackage].amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      //   success_url: `${process.env.BACKEND_URI}/api/v1/auth/signup/jobListing/successHandler?session_id={CHECKOUT_SESSION_ID}`,
      success_url: `${process.env.FRONTEND_URL}/job-listing-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}`,
      metadata: {
        registrationId: registration._id.toString(),
      },
    });

    registration.stripeSessionId = session.id;
    await registration.save();

    return res.status(200).json({ checkoutUrl: session.url });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.stripeSuccessHandler = async (req, res) => {
  try {
    const { session_id } = req.query;

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session || session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const registration = await JobListing.findOne({
      stripeSessionId: session.id,
    });

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    registration.isPaid = true;
    registration.status = "Active";
    await registration.save();

    // Redirect to frontend success page
    return res.redirect(
      `${process.env.FRONTEND_URL}/job-listing-success?paid=true`
    );
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
