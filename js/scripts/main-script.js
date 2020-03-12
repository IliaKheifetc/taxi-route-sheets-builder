ymaps.ready(function() {
    init();
    onDocumentReady();
});

const KALUGA_COORDINATES = [54.514533, 36.280053];
const CITY_NAME = "Калуга";
let myMap;
let center;

function init() {
    myMap = new ymaps.Map("map", {
        center: KALUGA_COORDINATES,
        zoom: 12,
        controls: ["routePanelControl"]
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

    // const multiRoute = new ymaps.multiRouter.MultiRoute(
    //     {
    //         // Описание опорных точек мультимаршрута.
    //         referencePoints: [[55.734876, 37.59308], "Москва, ул. Мясницкая"],
    //         // Параметры маршрутизации.
    //         params: {
    //             // Ограничение на максимальное количество маршрутов, возвращаемое маршрутизатором.
    //             results: 2
    //         }
    //     },
    //     {
    //         // Внешний вид путевых точек.
    //         wayPointStartIconColor: "#FFFFFF",
    //         wayPointStartIconFillColor: "#B3B3B3",
    //         // Внешний вид линии активного маршрута.
    //         routeActiveStrokeWidth: 8,
    //         routeActiveStrokeStyle: "solid",
    //         routeActiveStrokeColor: "#002233",
    //         // Внешний вид линий альтернативных маршрутов.
    //         routeStrokeStyle: "dot",
    //         routeStrokeWidth: 3,
    //         boundsAutoApply: true
    //     }
    // );

    // myMap.geoObjects.add(multiRoute);

    // var myMap = new ymaps.Map("map", {
    //     center: [55.753994, 37.622093],
    //     zoom: 9,
    //     controls: ["routePanelControl"]
    // });

    // Получение ссылки на панель маршрутизации.
    var control = myMap.controls.get("routePanelControl");

    // Задание состояния для панели маршрутизации.
    control.routePanel.state.set({
        // Адрес начальной точки.
        from: "Москва, Льва Толстого, 16",
        // Адрес конечной точки.
        to: "Москва, метро Черемушки"
    });
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

function removePhoneNumber(addressAndPhoneText) {
    const phoneStartIndex = addressAndPhoneText.indexOf("+7");
    return phoneStartIndex === -1
        ? addressAndPhoneText
        : addressAndPhoneText.slice(0, phoneStartIndex);
}

function getAddresses(addressCells) {
    const addressTags = Array.from(addressCells);
    const phoneAndAddressTexts = addressTags.map(item => item.innerText);
    const adresses = phoneAndAddressTexts.map(item => removePhoneNumber(item));

    return adresses;
}

function getSelectedTime(jqRadioButtons) {
    const radionButtons = Array.from(jqRadioButtons);
    const selectedRadionButton = radionButtons.find(button => button.checked);

    return selectedRadionButton ? selectedRadionButton.value : null;
}

function onMarkerClicked(event) {
    console.log("event", event);

    console.log("geoObject was clicked");
    console.log(
        "event.originalEvent.target.geometry.getCoordinates()",
        event.originalEvent.target.geometry.getCoordinates()
    );
    //const centerCoordinates = center.geometry.getCoordinates();
    const targetCoordinates = event.originalEvent.target.geometry.getCoordinates();

    // Создадим мульти-маршрут и добавим его на карту.
    var multiRoute = new ymaps.multiRouter.MultiRoute(
        {
            referencePoints: [
                "г. Калуга, ул. генерала Попова",
                targetCoordinates
            ]
        },
        {
            // editorDrawOver: false,
            // wayPointDraggable: true,
            // viaPointDraggable: true,
            // // Зададим собственное оформление линий мультимаршрута.
            // routeStrokeColor: "000088",
            // routeActiveStrokeColor: "ff0000",
            // pinIconFillColor: "ff0000",
            boundsAutoApply: true
        }
    );

    myMap.geoObjects.add(multiRoute);
}

function onDocumentReady() {
    //setTimeout(function() {

    const viewEditorBtn = $("#viewEditorBtn");
    let timeTableEditor = $("#cke_pasteTimeTableEditor");
    const viewRouteSheetsBtn = $("#viewRouteSheets");
    let routeSheets = $("#cke_routeSheets");
    const viewTimeSelectorModalBtn = $("#viewTimeSelectorBtn");
    const timeSelectorModal = $("#timeSelectorModal");
    const showAddressesOnMapBtn = $("#send");

    console.log("viewEditorBtn", viewEditorBtn);

    //$("#kaluga").bind("click", function() {
    // haightAshbury = new ymaps.maps.LatLng(54.563598, 36.261442);
    // setMapOnAll(null);
    // markers.splice(1, markers.length - 1);
    // markers[0].position = haightAshbury;
    // markers[0].title = "ЦПК г.Калуга";
    // markers[0].code = "55.751574, 37.573856";
    // setMapOnAll(map);
    // map.setCenter(markers[0].getPosition());
    //});

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
        $("#add-box").css({
            top: $("#d_option:visible").outerHeight() + 20
        });
    });

    viewTimeSelectorModalBtn.bind("click", function() {
        removeActiveClassFromMenuItems();
        setItemAsActive(this);
        timeTableEditor.hide();
        routeSheets.hide();
        timeSelectorModal.toggle();
        $("#add-box").css({
            top: $("#d_option:visible").outerHeight() + 20
        });
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
        $("#add-box").css({
            top: $("#d_option:visible").outerHeight() + 20
        });
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

        const addressCells = rowsByTime.map(row =>
            row.querySelector("td:nth-child(4)")
        );

        const addresses = getAddresses(addressCells).map(
            address => `г. ${CITY_NAME}, ${address}`
        );

        addresses.forEach(address => {
            ymaps
                .geocode(address)
                .then(result => {
                    const geoObject = result.geoObjects.get(0);
                    console.log("geoObject", geoObject);
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
            .css({ "font-family": "Time New Roman", "font-size": "10pt" });

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
    //}, 500);
}
