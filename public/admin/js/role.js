// Delete Role
const buttonDeleteRole = document.querySelectorAll("[button-delete-role]")
if (buttonDeleteRole.length > 0) {
    const formDeleteRole = document.querySelector("#form-delete-role")
    const path = formDeleteRole.getAttribute("data-path")
    
    buttonDeleteRole.forEach((button) => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Ban co chac muon xoa khong?");
            if (isConfirm) {
                const id = button.getAttribute("data-id")
                const action = `${path}/${id}?_method=DELETE`
                formDeleteRole.action = action
                formDeleteRole.submit();
            }
            else return
        })
    })
}
// End Delete Role