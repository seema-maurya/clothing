// VariantReusable.js
import { useState, useEffect } from "react";
// import debounce from "lodash/debounce";
import axios from "axios";
import { toast } from "react-toastify";
// import { filterLatestProducts } from "./cartFunctions";

// Function to handle image hover
export const handleImageHover = (
  imageUrl,
  color,
  variantColor,
  setMainImage,
  setHoveredColor,
  setSelectedColor
) => {
  setMainImage(imageUrl);
  setHoveredColor(color);
  if (variantColor) {
    if (variantColor.trim().toLowerCase() === color.trim().toLowerCase()) {
      setSelectedColor(variantColor);
    }
  }
};

export const getSizeOptions = (variants, selectedColor) => {
  const selectedVariant =
    variants &&
    variants.find(
      (variant) =>
        variant.color.trim().toLowerCase() ===
        selectedColor.trim().toLowerCase()
    );
  return selectedVariant ? selectedVariant.sizes : [];
};
// Function to handle size change
export const handleSizeChange = (productId, e, setSelectedSizes) => {
  const selectedSize = e.target.value;
  setSelectedSizes((prevSizes) => ({
    ...prevSizes,
    [productId]: selectedSize,
  }));
};

// Function to get variant details
export const getVariantDetails = (
  variants,
  selectedColor,
  selectedSizeVariants
) => {
  if (!Array.isArray(variants)) {
    return {}; // Return an empty object if variants is not an array
  }

  const colorVariant = variants.find(
    (variant) =>
      variant.color.trim().toLowerCase() === selectedColor.trim().toLowerCase()
  );
  if (colorVariant) {
    const sizeDetail = colorVariant.sizes.find(
      (size) => size.size === selectedSizeVariants
    );
    return sizeDetail || {};
  }
  return {};
};

// Function to calculate discount percentage Important
export const calculateDiscountPercentage = (mrp, price) => {
  return Math.round(((mrp - price) / mrp) * 100) || 0;
};

export const findVariantCartItem = (
  cart,
  productId,
  selectedColor,
  selectedSizeVariants
) => {
  return cart.find(
    (item) =>
      item._id === productId &&
      item.selectedColor.trim().toLowerCase() ===
        selectedColor.trim().toLowerCase() &&
      item.selectedSizes === selectedSizeVariants
  );
};

// Fetch product variant details and prices
export const useProductVariantDetails = (
  product,
  selectedColor,
  selectedSizeVariants
  // quantityPurchased
) => {
  const [variantPrice, setVariantPrice] = useState(0);
  const [variantMrpPrice, setVariantMrpPrice] = useState(0);
  const [cartVariantQuantity, setCartVariantQuantity] = useState(0);
  const [QuantityPurchased, setQuantityPurchased] = useState(0);
  useEffect(() => {
    const variantDetails = getVariantDetails(
      product.variants,
      selectedColor,
      selectedSizeVariants
    );
    setVariantPrice(variantDetails.price || 0);
    setVariantMrpPrice(variantDetails.mrpPrice || 0);
    setCartVariantQuantity(variantDetails.quantity || 0);
    setQuantityPurchased(variantDetails.quantityPurchased || "");
  }, [selectedColor, selectedSizeVariants, product.variants]);

  return {
    variantPrice,
    variantMrpPrice,
    cartVariantQuantity,
    QuantityPurchased,
  };
};

export const handleShareClick = (product) => {
  const shareUrl = window.location.href; // Get current page URL
  const shareText = `${product.productName} - Check this out!`;

  // Check if the Web Share API is supported
  if (navigator.share) {
    navigator
      .share({
        title: shareText,
        url: shareUrl,
      })
      .then(() => console.log("Share successful"))
      .catch((error) => console.error("Error sharing:", error));
  } else {
    // Fallback for browsers that do not support the Web Share API
    const emailBody = `Check out this product: ${shareUrl}`;
    const emailUrl = `mailto:?subject=${encodeURIComponent(
      shareText
    )}&body=${encodeURIComponent(emailBody)}`;
    window.open(emailUrl, "_self");
  }
};

// Extracted reusable function (can be used in both functional and class components)
export const getProductVariantDetails = (
  product,
  selectedColor,
  selectedSizeVariants
) => {
  if (!product || !product.variants) {
    return { variantPrice: 0, variantMrpPrice: 0, cartVariantQuantity: 0 };
  }

  const variantDetails = getVariantDetails(
    product.variants,
    selectedColor,
    selectedSizeVariants
  );

  return {
    variantPrice: variantDetails.price || 0,
    variantMrpPrice: variantDetails.mrpPrice || 0,
    cartVariantQuantity: variantDetails.quantity || 0,
  };
};

export const updateVariantDetails = (
  product,
  selectedOptions,
  setSelectedOptions
) => {
  const selectedOptionsProduct = selectedOptions[product._id] || {};
  const selectedColor = selectedOptionsProduct.color || "";
  const selectedSizeVariants = selectedOptionsProduct.size || "";

  const { variantPrice, variantMrpPrice, cartVariantQuantity } =
    getProductVariantDetails(product, selectedColor, selectedSizeVariants);

  setSelectedOptions((prevOptions) => ({
    ...prevOptions,
    [product._id]: {
      ...prevOptions[product._id],
      variantPrice,
      variantMrpPrice,
      cartVariantQuantity,
    },
  }));
};

export const handleSearchKeyPress = (
  e,
  products,
  searchInput,
  setFilteredPaymentInfo,
  setCurrentPage
) => {
  const trimmedSearchInput = searchInput.trim(); // Trim the input here

  if (trimmedSearchInput) {
    if (e.key === "Enter") {
      const searchFields = [
        "_id",
        "categoryName",
        "subCategoryName",
        "brandName",
        "productName",
        "productQuantity",
        "productPrice",
        "productMrpPrice",
        "userEmail",
        "createdAt",
        "isApproved",
        "comment",
        "InvoiceNumber",
        "rating",
      ];

      const searchTerms = trimmedSearchInput
        .split(" ")
        .map((term) => term.toLowerCase().trim())
        .filter((term) => term.length > 0);

      const filteredPaymentInfo = products.filter((prod) => {
        return searchFields.some((field) => {
          const fieldValue = prod[field];

          if (typeof fieldValue === "number") {
            return searchTerms.some((term) =>
              fieldValue.toString().includes(term)
            );
          } else if (typeof fieldValue === "string") {
            return searchTerms.some((term) =>
              fieldValue.toLowerCase().includes(term)
            );
          } else if (typeof fieldValue === "boolean") {
            const boolStr = fieldValue ? "true" : "false";
            return searchTerms.some((term) => boolStr.includes(term));
          }
          return false;
        });
      });

      setFilteredPaymentInfo(filteredPaymentInfo);
      setCurrentPage(1);
    }
  }
};

