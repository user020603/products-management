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

// Delete Item
const buttonDelete = document.querySelectorAll("[button-delete]");
if (buttonDelete.length > 0) {
  const formDeleteItem = document.querySelector("#form-delete-item");
  const path = formDeleteItem.getAttribute("data-path");

  buttonDelete.forEach((button) => {
    button.addEventListener("click", () => {
      // console.log(button);
      const isConfirm = confirm("Ban co chac muon xoa khong?");
      if (isConfirm) {
        const id = button.getAttribute("data-id");
        // console.log(id);
        const action = `${path}/${id}?_method=DELETE`;
        // console.log(action);
        formDeleteItem.action = action;
        formDeleteItem.submit();
      } else return;
    });
  });
}
// End Delete Item

// Restore Item
const buttonRestore = document.querySelectorAll("[button-restore]");
if (buttonRestore.length > 0) {
    const formRestore = document.querySelector("#form-restore-item");
    const path = formRestore.getAttribute("data-path");

    buttonRestore.forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("data-id");
            localStorage.setItem('restoreItem', id);
            const action = `${path}/${id}?_method=PATCH`;
            formRestore.action = action;
            formRestore.submit();
        });
    });
}

// Delete Permanent
const buttonDeletePermanent = document.querySelectorAll("[button-delete-permanent]");
if (buttonDeletePermanent.length > 0) {
    const formDeletePermanent = document.querySelector("#form-delete-permanent-item");
    const path = formDeletePermanent.getAttribute("data-path");

    buttonDeletePermanent.forEach((button) => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Xoa vinh vien san pham?");
            if (isConfirm) {
                const id = button.getAttribute("data-id");
                localStorage.setItem('deleteItem', id); // Save id in local storage
                const action = `${path}/${id}?_method=DELETE`;
                formDeletePermanent.action = action;
                formDeletePermanent.submit();
            } else return;
        });
    });
}
