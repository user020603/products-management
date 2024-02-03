// Button Status
const buttonStatus = document.querySelectorAll("[button-status]");
console.log(buttonStatus);
if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);
    // console.log(url);

    buttonStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            // console.log(status); 
            if (status) {
                url.searchParams.set("status", status);
            }
            else {
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        })
    })
}

// End Button Status

// Form Search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(window.location.href);

    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value
        // console.log(keyword);
        if (keyword != "") {
            url.searchParams.set("keyword", keyword);
        }
        else {
            url.searchParams.delete("keyword");
        }
        window.location.href = url.href;
    });
}
// End Form Search

// Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if (buttonPagination) {
    let url = new URL(window.location.href);
    buttonPagination.forEach(button => {
        button.addEventListener(("click"), () => {
            const page = button.getAttribute("button-pagination");
            url.searchParams.set("page", page);
            window.location.href = url.href;
        });
    });
};

//End pagination

// Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
// console.log(checkboxMulti);
if (checkboxMulti) {
    // console.log(checkboxMulti);
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputIds = checkboxMulti.querySelectorAll("input[name='id']")

    // console.log(inputCheckAll);
    // console.log(inputIds);

    inputCheckAll.addEventListener("click", () => {
        if (inputCheckAll.checked) {
            inputIds.forEach(input => {
                input.checked = true;
            });
        }
        else {
            inputIds.forEach(input => {
                input.checked = false;
            })
        }
    });

    inputIds.forEach((input) => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
            if (countChecked == inputIds.length) {
                inputCheckAll.checked = true;
            }
            else inputCheckAll.checked = false;
        })
    })
}
// End Checkbox Multi

// Form change multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();

        const checkboxMulti = document.querySelector("[checkbox-multi]");
        // console.log(checkboxMulti);
        const inputsChecked = checkboxMulti.querySelectorAll(
            "input[name='id']:checked"
        )

        if (inputsChecked.length > 0) {
            let ids = []
            const inputIds = formChangeMulti.querySelector("input[name='ids']");
            inputsChecked.forEach(input => {
                const id = input.value;
                ids.push(id);
            });
            // console.log(ids.join(", "));
            inputIds.value = ids.join(", ");
            formChangeMulti.submit();
        } else {
            alert("Vui long chon it nhat mot ban ghi! :)");
        }
    })
}
// End Form change multi