// Delete Category
const buttonDeleteCategory = document.querySelectorAll(
  "[button-delete-category]"
);
if (buttonDeleteCategory.length > 0) {
  const formDeleteCategory = document.querySelector("#form-delete-category");
  const path = formDeleteCategory.getAttribute("data-path");
  console.log(path);

  buttonDeleteCategory.forEach((button) => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Ban co chac muon xoa khong?");
      if (isConfirm) {
        const id = button.getAttribute("data-id");
        const action = `${path}/${id}?_method=DELETE`;
        formDeleteCategory.action = action;
        formDeleteCategory.submit();
      } else return;
    });
  });
}
// End Delete Category
