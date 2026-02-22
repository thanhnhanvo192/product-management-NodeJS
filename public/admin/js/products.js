// Change satus
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonsChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");
  console.log(path);

  buttonsChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      const currentStatus = button.getAttribute("data-status");
      const newStatus = currentStatus == "active" ? "inactive" : "active";
      console.log(id, currentStatus, newStatus);

      const action = path + `/${newStatus}/${id}?_method=PATCH`;
      console.log(action);
      formChangeStatus.action = action;
      formChangeStatus.submit();
    });
  });
}
// End Change satus
