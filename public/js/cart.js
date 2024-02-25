// Cap nhat so luong san pham trong gio hang
const inputsQuantity = document.querySelectorAll("input[name='quantity']");
if (inputsQuantity.length > 0) {
  inputsQuantity.forEach((input) => {
    input.addEventListener("change", (e) => {
      const productId = input.getAttribute("product-id");
      const quantity = parseInt(input.value); // input.value = e.target.value
      if (quantity > 0) {
        window.location.href = `/cart/update/${productId}/${quantity}`;
      }
    });
  });
}
// End Cap nhat so luong san pham trong gio hang
