import { toast } from "react-toastify";
import axios from "axios";

// This function gets the default size, which is the first size if only one size is available
export const renderShareOptions = (
  index,
  prod,
  showShareOptions,
  handleShareButtonClick
) => {
  return showShareOptions === index ? (
    <div
      className="share-options"
      style={{
        position: "",
        top: "100%",
        left: "10%",
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "15px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        zIndex: -2,
        lineHeight: "0px",
        height: "400px",
      }}
    >
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
          window.location.href
        )}&text=${encodeURIComponent(prod.productName)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          margin: "5px 0",
          color: "#3b5998",
        }}
      >
        <i className="fa fa-facebook"></i>
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
          window.location.href
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          margin: "5px 0",
          color: "#1da1f2",
        }}
      >
        <i className="fa fa-twitter"></i>
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          window.location.href
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          margin: "5px 0",
          color: "#0077b5",
        }}
      >
        <i className="fa fa-linkedin"></i>
      </a>
      <a
        href={`mailto:?subject=${encodeURIComponent(
          prod.productName
        )}&body=${encodeURIComponent(window.location.href)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          margin: "5px 0",
          color: "#dd4b39",
        }}
      >
        <i className="fa fa-envelope"></i>
      </a>
    </div>
  ) : (
    <button
      className="share-button"
      style={{
        backgroundColor: "red",
        border: "none",
        color: "white",
        cursor: "pointer",
        padding: "0px",
        borderRadius: "2px",
        position: "inherit",
      }}
      onClick={(e) => handleShareButtonClick(index, e)}
    >
      <i className="pe-7s-share"></i>
    </button>
  );
};

s

export const handleClearCart = async (
  setCart,
  confirm = false,
  setSelectedSizes
) => {
  const confirmed =
    confirm || window.confirm("Are you sure you want to clear the cart?");
  if (confirmed) {
    const userId = localStorage.getItem("userId");

    if (userId) {
      // User is logged in, so call the backend to clear the cart
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}cart/cart/clear`,
          {
            data: { userId }, // Send userId in the request body
          }
        );

        if (response.status === 200) {
          // Successfully cleared from backend, now update the frontend
          localStorage.removeItem("cart");
          console.log("Cart cleared successfully.");

          setCart([]);
        } else {
          console.error("Failed to clear the cart:", response.statusText);
        }
      } catch (error) {
        console.error("Error clearing the cart:", error);
      }
    } else {
      setCart([]);
      localStorage.removeItem("cart");
    }
  } else {
    console.log("Clear cart action cancelled.");
    toast("cancelled");
  }
};

export const calculateTotal = (cart) => {
  let total = 0;
  cart.forEach((item) => {
    const price = parseFloat(item.variantPrice);
    const quantity = parseInt(item.variantQuantity);
    if (!isNaN(price) && !isNaN(quantity)) {
      total += price * quantity;
    }
  });
  const shippingCost = 0;
  total += shippingCost;
  return total;
};
