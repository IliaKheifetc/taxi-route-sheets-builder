const handleValidityState = ({
  errorHelpText,
  formGroup,
  icon,
  touched,
  validity
}) => {
  if (touched && (!validity.valid || validity.valueMissing)) {
    formGroup.classList.remove("has-success");
    formGroup.classList.add("has-error");

    icon.classList.remove("glyphicon-ok");
    icon.classList.add("glyphicon-remove");

    errorHelpText.innerText = validity.valueMissing
      ? "Телефон обязателен для заполнения"
      : "Введите телефон в формате +7-999-999-99-99";
  } else {
    formGroup.classList.remove("has-error");
    formGroup.classList.add("has-success");

    icon.classList.add("glyphicon-ok");
    icon.classList.remove("glyphicon-remove");
    errorHelpText.innerText = "";
  }
};

export const getPhoneInputElement = globalState => {
  let touched = false;
  const formGroup = document.createElement("div");
  formGroup.classList.add("form-group", "has-feedback");

  const icon = document.createElement("span");
  icon.classList.add("glyphicon", "glyphicon-remove", "form-control-feedback");

  const errorHelpText = document.createElement("div");
  errorHelpText.classList.add("phone-error-text", "text-danger");

  const input = document.createElement("input");
  input.autofocus = true;
  input.type = "tel";
  input.pattern = "^((\\+7)|8)-[0-9]{3}-[0-9]{3}-[0-9]{2}-[0-9]{2}$";
  input.title = "Введите телефон в формате +7-999-999-99-99";
  input.required = true;

  input.classList.add("form-control");

  input.addEventListener("input", e => {
    console.log(e);
    console.log("e.target.validity", e.target.validity);
    globalState.employeeOnDutyPhoneNumber = e.target.value;

    handleValidityState({
      errorHelpText,
      formGroup,
      icon,
      touched,
      validity: e.target.validity
    });
  });

  input.addEventListener("blur", e => {
    touched = true;

    handleValidityState({
      errorHelpText,
      formGroup,
      icon,
      touched,
      validity: e.target.validity
    });
  });

  formGroup.appendChild(input);
  formGroup.appendChild(icon);
  formGroup.appendChild(errorHelpText);

  return formGroup;
};
