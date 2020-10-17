(function() {
  function getAddressAndPhone(addressAndPhoneText) {
    const phoneStartIndex = addressAndPhoneText.indexOf("+7");

    let address =
      phoneStartIndex !== -1
        ? addressAndPhoneText.slice(0, phoneStartIndex)
        : addressAndPhoneText;
    const lastCommaIndex = address.lastIndexOf(",");
    address =
      lastCommaIndex !== -1 ? address.slice(0, lastCommaIndex) : address;

    const phone =
      phoneStartIndex !== -1 ? addressAndPhoneText.slice(phoneStartIndex) : "";

    return {
      address,
      phone
    };
  }

  function createEmployeeObject(employeeDataArray) {
    const { address, phone } = getAddressAndPhone(employeeDataArray[3]);

    return {
      rideTime: employeeDataArray[0],
      district: employeeDataArray[1],
      fullName: employeeDataArray[2],
      address,
      phone
    };
  }

  function isSameEmployee(employee1, employee2) {
    return ["rideTime", "district", "fullName", "address", "phone"].every(
      key => employee1[key] === employee2[key]
    );
  }

  function getFormattedFullName(fullName) {
    console.log("fullName", fullName);
    const [lastName, firstName, patronymic] = fullName.split(" ");
    return `${lastName} ${firstName[0]}. ${patronymic[0]}.`;
  }

  function addGeoObjectField(employee, geoObject) {
    return {
      ...employee,
      geoObject
    };
  }

  function setItemAsActive(item) {
    $(item)
      .parent("li")
      .addClass("active");
  }

  function getSelectedTime(jqRadioButtons) {
    const radionButtons = Array.from(jqRadioButtons);
    const selectedRadionButton = radionButtons.find(button => button.checked);

    return selectedRadionButton ? selectedRadionButton.value : null;
  }

  function getAddressForGeocoding(
    districtsRequiredForGeocoding,
    cityName,
    employee
  ) {
    const shouldSpecifyDistrict = districtsRequiredForGeocoding.some(district =>
      employee.district.toLowerCase().includes(district.toLowerCase())
    );
    if (shouldSpecifyDistrict) {
      return `г. ${cityName}, ${employee.district},  ${employee.address}`;
    }

    return `г. ${cityName},  ${employee.address}`;
  }

  function getStringWithoutLetters(str) {
    return str.replace(/\D/g, "");
  }

  window._taxi_utils = {
    addGeoObjectField,
    createEmployeeObject,
    getAddressAndPhone,
    getAddressForGeocoding,
    getFormattedFullName,
    getSelectedTime,
    getStringWithoutLetters,
    isSameEmployee,
    setItemAsActive
  };
})(window);
