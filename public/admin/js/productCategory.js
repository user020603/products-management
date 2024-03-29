// Change Status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonsChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");
  // console.log(path);
  // console.log(formChangeStatus);

  buttonsChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");

      let statusChange = statusCurrent == "active" ? "inactive" : "active";

      const action = path + `/${statusChange}/${id}?_method=PATCH`;
      formChangeStatus.action = action;

      formChangeStatus.submit();
    });
  });
}
// End Change Status

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
