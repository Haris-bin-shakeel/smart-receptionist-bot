import React, { useEffect } from "react";

const PaddleSubscribeButton = ({ userEmail, userId }) => {
  useEffect(() => {
    // Load Paddle script only once
    if (!window.Paddle) {
      const script = document.createElement("script");
      script.src = "https://cdn.paddle.com/paddle/paddle.js";
      script.async = true;
      script.onload = () => {
        window.Paddle.Setup({ vendor: YOUR_VENDOR_ID }); // <-- Replace with your Paddle Vendor ID
      };
      document.body.appendChild(script);
    } else {
      window.Paddle.Setup({ vendor: YOUR_VENDOR_ID }); // <-- Replace with your Paddle Vendor ID
    }
  }, []);

  const handleSubscribe = () => {
    window.Paddle.Checkout.open({
      product: YOUR_PRODUCT_ID, // <-- Replace with your Paddle Product ID
      email: userEmail,         // Optionally pre-fill user's email
      passthrough: JSON.stringify({ userId }), // Pass user info for webhook
    });
  };

  return (
    <button className="btn-upgrade" onClick={handleSubscribe}>
      Subscribe Now
    </button>
  );
};

export default PaddleSubscribeButton; 