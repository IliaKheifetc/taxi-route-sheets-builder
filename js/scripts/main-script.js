(function taxiModule() {
  ymaps.ready(function() {
    init();
    onDocumentReady();
  });

  const KALUGA_COORDINATES = [54.514533, 36.280053];
  const BEELINE_OFFICE_ADDRESS = "Московская ул., 289, Калуга";
  const CITY_NAME = "Калуга";
  const MAX_CAR_CAPACITY = 4;
  let myMap;
  let center;
  let currentMultiRoute = null;
  let multiRouteModel = null;

  function init() {
    myMap = new ymaps.Map("map", {
      center: KALUGA_COORDINATES,
      zoom: 12
    });

    center = myMap.geoObjects.add(
      new ymaps.Placemark(
        KALUGA_COORDINATES,
        {
          balloonContent: "<strong>ЦПК Калуга</strong>"
        },
        {
          iconColor: "#ff0000"
        }
      )
    );
  }

  function removeActiveClassFromMenuItems() {
    $(".nav-stacked li").removeClass("active");
  }

  function setItemAsActive(item) {
    $(item)
      .parent("li")
      .addClass("active");
  }

  function setEditorWindowHeight(editorWindow) {
    editorWindow.height(
      $(window).height() -
        $("#header-navbar").height() -
        $("#footer-bar").height() -
        200
    );
  }

  function getAddressAndPhone(addressAndPhoneText) {
    const phoneStartIndex = addressAndPhoneText.indexOf("+7");

    return {
      address: addressAndPhoneText.slice(0, phoneStartIndex),
      phone: addressAndPhoneText.slice(phoneStartIndex)
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

  function getSelectedTime(jqRadioButtons) {
    const radionButtons = Array.from(jqRadioButtons);
    const selectedRadionButton = radionButtons.find(button => button.checked);

    return selectedRadionButton ? selectedRadionButton.value : null;
  }

  function onMarkerClicked(event) {
    const target = event.get("target");
    const targetCoordinates = target.geometry.getCoordinates();

    this.timeSelectorModal.hide();

    if (!currentMultiRoute) {
      const routeReferencePoints = [BEELINE_OFFICE_ADDRESS, targetCoordinates];

      multiRouteModel = new ymaps.multiRouter.MultiRouteModel(
        routeReferencePoints
      );
      // Создадим мульти-маршрут и добавим его на карту.
      currentMultiRoute = new ymaps.multiRouter.MultiRoute(multiRouteModel, {
        // editorDrawOver: false,
        // wayPointDraggable: true,
        // viaPointDraggable: true,
        // // Зададим собственное оформление линий мультимаршрута.
        // routeStrokeColor: "000088",
        // routeActiveStrokeColor: "ff0000",
        wayPointIconFillColor: "red",
        wayPointVisible: false,
        boundsAutoApply: false,
        iconContent: "1"
      });

      myMap.geoObjects.add(currentMultiRoute);

      console.log("currentMultiRoute", currentMultiRoute);

      target.options.set("preset", "islands#darkGreenIcon");
      setProgressWindowState();
      return;
    }

    let routeReferencePoints = multiRouteModel.getReferencePoints();

    // Ищем в массиве точек индекс той точки, на которую сейчас кликнули
    const targetReferencePointIndex = routeReferencePoints.findIndex(
      referencePoint => {
        return (
          Array.isArray(referencePoint) &&
          targetCoordinates[0] === referencePoint[0] &&
          targetCoordinates[1] === referencePoint[1]
        );
      }
    );
    if (
      targetReferencePointIndex === -1 &&
      routeReferencePoints.length === MAX_CAR_CAPACITY + 1
    ) {
      alert("нельзя добавить в одну машину больше 4 пассажиров!");
      return;
    }

    if (targetReferencePointIndex === -1) {
      // добавляем точку в маршрут
      routeReferencePoints.push(targetCoordinates);
      target.options.set("preset", "islands#darkGreenIcon");
      // target.options.set("iconContent", routeReferencePoints.length);
    } else {
      // удаляем точку из маршрута
      routeReferencePoints.splice(targetReferencePointIndex, 1);
      target.options.set("preset", "islands#blueIcon");
    }

    multiRouteModel.setReferencePoints(routeReferencePoints);
    setProgressWindowState();
  }

  function setProgressWindowState() {
    const routeReferencePoints = multiRouteModel.getReferencePoints();
    this.progressWindow.css({
      display: routeReferencePoints.length > 1 ? "block" : "none"
    });
    const percentageValue = (routeReferencePoints.length - 1) * 25;
    this.chart.data("easyPieChart").update(percentageValue);
  }

  function initTooltips() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  function initPieChart(chartNode) {
    chartNode.easyPieChart({
      easing: "easeOutBounce",
      onStep: function(from, to, percent) {
        $(this.el)
          .find(".percent")
          .text(Math.round(percent));
      },
      barColor: "#68b3a5",
      trackColor: "#f2f2f2",
      scaleColor: false,
      lineWidth: 8,
      size: 130,
      animate: 500
    });
  }

  function onDocumentReady() {
    const viewEditorBtn = $("#viewEditorBtn");
    let timeTableEditor = $("#cke_pasteTimeTableEditor");
    const viewRouteSheetsBtn = $("#viewRouteSheets");
    let routeSheets = $("#cke_routeSheets");
    const viewTimeSelectorModalBtn = $("#viewTimeSelectorBtn");
    const timeSelectorModal = $("#timeSelectorModal");
    const showAddressesOnMapBtn = $("#send");
    const removeCurrentRouteBtn = $(".remove-route");
    const progressWindow = $(".car-fill-progress-window");
    const chart = $(".chart");
    setProgressWindowState = setProgressWindowState.bind({
      chart,
      progressWindow
    });
    onMarkerClicked = onMarkerClicked.bind({ timeSelectorModal });
    initTooltips();
    initPieChart(chart);

    $("#voronezh").bind("click", function() {
      haightAshbury = new ymaps.maps.LatLng(51.680647, 39.180847);
      setMapOnAll(null);
      markers.splice(1, markers.length - 1);
      markers[0].position = haightAshbury;
      markers[0].title = "ЦПК г.Воронеж";
      markers[0].code = "55.751574, 37.573856";
      setMapOnAll(map);
      map.setCenter(markers[0].getPosition());
    });

    $("#nino").bind("click", function() {
      haightAshbury = new ymaps.maps.LatLng(56.307438, 43.988931);
      setMapOnAll(null);
      markers.splice(1, markers.length - 1);
      markers[0].position = haightAshbury;
      markers[0].title = "ЦПК г.Нижний Новгород";
      markers[0].code = "55.751574, 37.573856";
      setMapOnAll(map);
      map.setCenter(markers[0].getPosition());
    });

    $("#perm").bind("click", function() {
      haightAshbury = new ymaps.maps.LatLng(58.009557, 56.187656);
      setMapOnAll(null);
      markers.splice(1, markers.length - 1);
      markers[0].position = haightAshbury;
      markers[0].title = "ЦПК г.Пермь";
      markers[0].code = "55.751574, 37.573856";
      setMapOnAll(map);
      map.setCenter(markers[0].getPosition());
    });

    $("#map").height(
      $(window).height() -
        $("#header-navbar").height() -
        $("#footer-bar").height() -
        20
    );

    viewEditorBtn.bind("click", function() {
      removeActiveClassFromMenuItems();
      setItemAsActive(this);
      timeSelectorModal.hide();

      timeTableEditor =
        timeTableEditor.length === 0
          ? $("#cke_pasteTimeTableEditor")
          : timeTableEditor;
      timeTableEditor.toggle();
      routeSheets.hide();
      //console.clear();
      console.log(
        $("#cke_1_contents iframe")
          .contents()
          .find("body table tr:eq(2)")
          .html()
      );

      setEditorWindowHeight($("#cke_1_contents"));
      // $("#add-box").css({
      //   top: $("#d_option:visible").outerHeight() + 20
      // });
    });

    viewTimeSelectorModalBtn.bind("click", function() {
      removeActiveClassFromMenuItems();
      setItemAsActive(this);
      timeTableEditor.hide();
      routeSheets.hide();
      timeSelectorModal.toggle();
      // $("#add-box").css({
      //   top: $("#d_option:visible").outerHeight() + 20
      // });
    });

    viewRouteSheetsBtn.bind("click", function() {
      removeActiveClassFromMenuItems();
      setItemAsActive(this);
      timeTableEditor.hide();
      timeSelectorModal.hide();

      setEditorWindowHeight($("#cke_2_contents"));
      routeSheets =
        routeSheets.length === 0 ? $("#cke_routeSheets") : routeSheets;

      routeSheets.toggle();
      // $("#add-box").css({
      //   top: $("#d_option:visible").outerHeight() + 20
      // });
    });

    showAddressesOnMapBtn.bind("click", function() {
      // TODO: разобраться с добавлением города или района в начало строки
      const radioButtons = $("#timeSelectorModal input[type='radio']");
      const selectedTime = getSelectedTime(radioButtons);

      // получаем все строки
      const jqRows = $("#cke_pasteTimeTableEditor iframe")
        .contents()
        .find("table > tbody > tr");

      // фильтруем строки по времени
      const rowsByTime = Array.from(jqRows).filter(row => {
        return row.innerText && row.innerText.includes(selectedTime);
      });

      if (!rowsByTime.length) {
        return;
      }

      const employees = rowsByTime
        .map(row =>
          Array.from(row.querySelectorAll("td")).map(
            element => element.innerText
          )
        )
        .map(createEmployeeObject);

      const addresses = employees.map(
        employee => `г. ${CITY_NAME}, ${employee.address}`
      );

      addresses.forEach(address => {
        ymaps
          .geocode(address)
          .then(result => {
            const geoObject = result.geoObjects.get(0);

            geoObject.options.set("hasBalloon", false);
            geoObject.events.add(["click"], onMarkerClicked);

            myMap.geoObjects.add(geoObject);
          })
          .catch(e => console.error(e));
      });

      return;

      $("#cke_2_contents iframe")
        .contents()
        .find("body")
        .html("");
      var ddd = new Date().getUTCMonth();
      ddd++;
      time = $("input[name=time]:checked").val();
      if ($("input[name=time]:checked").val() != "22:00") {
        ddate =
          new Date().getUTCDate() +
          1 +
          "." +
          ddd +
          "." +
          new Date().getUTCFullYear();
      } else {
        ddate =
          new Date().getUTCDate() +
          "." +
          ddd +
          "." +
          new Date().getUTCFullYear();
      }

      $("#cke_1_contents iframe")
        .contents()
        .find("body table tr")
        .css({ "background-color": "white" });
      waypts_length = [];
      waypts = [];
      calculateAndDisplayRoute(directionsService, directionsDisplay);
      if (
        $("#cke_1_contents iframe")
          .contents()
          .find("body table tr:eq(2)")
          .html() == undefined
      ) {
        $(".modal-body").html("Вы не загрузили таблицу с адресами!");
        $(".modal").modal();
        return false;
      }
      setMapOnAll(null);
      markers.splice(1, markers.length - 1);

      setMapOnAll(map);
      index =
        $("#cke_1_contents iframe")
          .contents()
          .find("body table tr:last")
          .index() + 1;
      //console.error(index);
      nach = 0;

      geocodeAddress(
        geocoder,
        map,
        $("#cke_1_contents iframe")
          .contents()
          .find("body table tr:eq(" + nach + ") td:eq(3)")
          .text()
      );
      //setTimeout('geocodeAddress(geocoder, map,$("#cke_1_contents iframe").contents().find('body table tr:eq('+nach+') td:eq(0)').text())',5000);
    });

    removeCurrentRouteBtn.bind("click", function() {
      multiRouteModel.setReferencePoints([BEELINE_OFFICE_ADDRESS]);
      setProgressWindowState();
      myMap.geoObjects.each(function(geoObject) {
        geoObject.options.set("preset", "islands#blueIcon");
      });
    });

    // создание нумерации
    //$("#send").bind("click",function(){
    //$("#cke_2_contents iframe").contents().find('body').html("");
    //var ddd=new Date().getUTCMonth();
    //ddd++;
    //time=$('input[name=time]:checked').val();
    //if ($('input[name=time]:checked').val()!="23:00"){ddate=(new Date().getUTCDate()+1)+"."+ddd+"."+new Date().getUTCFullYear();}
    //else {ddate=new Date().getUTCDate()+"."+ddd+"."+new Date().getUTCFullYear();

    $("#add").bind("click", function() {
      var html_text =
        '<table cellspacing="0" width="100%" border=1 ><tr><th colspan="2" bgcolor="LightGrey" >Маршрутный лист "БИЛАЙН"</tr>';
      //html_text += '<table cellspacing="0" width="100%" border=1 ><tr><th colspan="2" bgcolor="LightGrey" >GettTaxi</th></tr>';
      //html_text+='<tr><th>Дата: '+ddate+'</th><th>Время: '+time.substring(0, time.length - 2)+'10</th></tr>';
      html_text +=
        '<table cellspacing="0" width="100%" border=1 ><tr><th align="left">Дата исполнения заказа:</th><th width="50%">' +
        ddate +
        "</th></tr>";
      html_text +=
        '<table cellspacing="0" width="100%" border=1 ><tr><th align="left">Время посадки:</th><th width="50%">' +
        time.substring(0, time.length - 2) +
        "10</th></tr>";
      html_text +=
        '<table cellspacing="0" width="100%" border=1 ><tr><th align="left">Номер машины:</th><th width="50%"></th></tr>';
      html_text +=
        '<table cellspacing="0" width="100%" border=1 ><tr><th align="left">Номер заказа:</th><th width="50%"></th></tr>';
      //html_text += '<table cellspacing="0" width="100%" border=1 ><tr><th align="left">Километраж:</th><th width="50%">' + (s / 1000).toFixed(1) + ' км</th></tr>';
      //html_text += '<table cellspacing="0" width="100%" border=1 ><tr><th bgcolor="LightGrey"></th><th width="25%" bgcolor="LightGrey" align="right">Дежурный:</th><th width="50%" bgcolor="LightGrey"></th></tr>';
      html_text +=
        '<table cellspacing="0" width="100%" border=1 ><tr><th bgcolor="LightGrey" >ФИО</th><th width="25%" bgcolor="LightGrey">Улица</th><th width="50%" bgcolor="LightGrey">Район</th></tr>';

      for (t = 0; t < waypts_length.length; t++) {
        html_text +=
          "<tr><td>" +
          waypts_length[t].name +
          "</td><td>" +
          waypts_length[t].address +
          "</td><td>" +
          waypts_length[t].regon +
          "</td></tr>";
        //html_text+='<tr>'+(t+1)+'</tr>';
      }

      html_text += "</table><br>";
      $("#cke_2_contents iframe")
        .contents()
        .find("body")
        .append(html_text);
      $("#cke_2_contents iframe")
        .contents()
        .find("body table:last tr:last")
        .css({
          color: "black",
          "font-weight": "800",
          "font-weight": "bold"
        });
      $("#cke_2_contents iframe")
        .contents()
        .find("body table:last")
        .css({
          "font-family": "Time New Roman",
          "font-size": "10pt"
        });

      setMapOnAll(null);
      for (var y = 0; y < markers.length; y++) {
        console.error(markers[y].icon);
        if (markers[y].icon == "img/ic.png") {
          for (var t = markers[y].num + 1; t < markers.length; t++) {
            //console.log(waypts_length[t].num2);
            markers[t].num--;
          }
          markers.splice(markers[y].num, 1);
          y--;
        }
      }
      setMapOnAll(map);
      waypts_length = [];
      waypts = [];
      calculateAndDisplayRoute(directionsService, directionsDisplay);
      if (markers.length == 1) {
        $("#add-box").hide();
      }
    });
  }
})();
