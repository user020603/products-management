// Delete Role
const buttonDeleteRole = document.querySelectorAll("[button-delete-role]");
if (buttonDeleteRole.length > 0) {
  const formDeleteRole = document.querySelector("#form-delete-role");
  const path = formDeleteRole.getAttribute("data-path");

  buttonDeleteRole.forEach((button) => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Ban co chac muon xoa khong?");
      if (isConfirm) {
        const id = button.getAttribute("data-id");
        const action = `${path}/${id}?_method=DELETE`;
        formDeleteRole.action = action;
        formDeleteRole.submit();
      } else return;
    });
  });
}
// End Delete Role

//  Permissions
const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
  const buttonSubmit = document.querySelector("[button-submit]");
  // console.log(buttonSubmit)
  buttonSubmit.addEventListener("click", () => {
    let permissions = [];
    const rows = tablePermissions.querySelectorAll("[data-name]");
    rows.forEach((row) => {
      const name = row.getAttribute("data-name");
      const inputs = row.querySelectorAll("input");

      //   console.log(name)
      //   console.log(inputs)

      if (name == "id") {
        inputs.forEach((input) => {
          const id = input.value;
          permissions.push({
            id: id,
            permissions: [],
          });
        });
      } else {
        inputs.forEach((input, index) => {
          const checked = input.checked;
          if (checked) {
            permissions[index].permissions.push(name);
          }
        });
      }
    });
    console.log(permissions);

    if (permissions.length > 0) {
      const formChangePermissions = document.querySelector(
        "[form-change-permissions]"
      );
      console.log(formChangePermissions);
      const inputPermissions = formChangePermissions.querySelector(
        "input[name='permissions']"
      );
      inputPermissions.value = JSON.stringify(permissions);
      formChangePermissions.submit();
    }
  });
}
//  End Permissions

// Permission Data Default
const dataRecords = document.querySelector("[data-records]");
if (dataRecords) {
    const records = JSON.parse(dataRecords.getAttribute("data-records"));
    console.log(records)
    const tablePermissions = document.querySelector("[table-permissions]");

    records.forEach((record, index) => {
        // Lay ra cac permission con
        const permissions = record.permissions;
        
        permissions.forEach((permission) => {
            const row = tablePermissions.querySelector(`[data-name="${permission}"]`);
            const input = row.querySelectorAll('input')[index];
            input.checked = true;
        })
    })   
}
// End Permission Data Default
