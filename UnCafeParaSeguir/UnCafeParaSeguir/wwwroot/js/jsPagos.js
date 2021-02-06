
String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
}
String.prototype.ltrim = function () {
    return this.replace(/^\s+/, "");
}
String.prototype.rtrim = function () {
    return this.replace(/\s+$/, "");
}

function validaInicioSesion() {

    $.ajax({
        url: '/Charla/varSesionCharla',
        type: 'POST',

    }).done(function (SesionCharla) {

        $.ajax({
            url: '/Admin/varSesionCorreo',
            type: 'POST',

        }).done(function (SesionCorreo) {

            if (SesionCorreo != "" && SesionCharla != "") {
                $("#iccs").val(SesionCharla);
                CargarDatos(SesionCharla);
                llenarAnnos();
            } else {
                location.href = "/Home/Index";
            }
        });
    });
}

function llenarAnnos() {

    var nowY = new Date().getFullYear(),
        options = "";

    var maxYear = nowY + 15;

    for (var Y = nowY; Y <= maxYear; Y++) {
        options += "<option>" + Y + "</option>";
    }

    $("#txtgpExpirationYear").append(options);

}

function CargarDatos(SesionCharla) {

    $.ajax({
        url: '/Charla/Cargar_Charla_Filtrada',
        data: { 'pIdCharla': SesionCharla },
        type: 'POST',

    }).done(function (response) {
        var datos = JSON.parse(response);

        $("#txtgpNombreCharla").html(datos[0].nombreCharla);
        $("#imagenCharla").attr('src', datos[0].imagenCharla);
        $("#txtgpNombreCharlista").html(datos[0].nombreUsuario + " " + datos[0].apellidosUsuario);
        $("#txtgpPrecioInfoCharla").html(datos[0].precioCharla);
        $("#txtgpPrecio").html(datos[0].precioCharla);

    });
}

function ValidarCompra() {

    var tT = "";

    txtgpNombre = $("#txtgpNombre").val();
    txtgpApellido = $("#txtgpApellido").val();
    txtgpCardNumero = $("#txtgpCardNumero").val();
    txtgpExpirationMonth = $("#txtgpExpirationMonth").val();
    txtgpExpirationYear = $("#txtgpExpirationYear").val();
    txtgpCardCVC = $("#txtgpCardCVC").val();
    txtgpNombreCharla = $("#txtgpNombreCharla").text();
    txtgpPrecio = $("#txtgpPrecio").text();
    iccs = $("#iccs").val();

    var Visa = $("#pyVisa").is(":checked");

    if (Visa == true) {
        tT = 1;
    } else {
        tT = 2;
    }

    if (txtgpNombre.trim() == "" || txtgpApellido.trim() == "" || txtgpCardNumero.trim() == "" || txtgpExpirationMonth.trim() == "" || txtgpExpirationYear.trim() == "" || txtgpCardCVC.trim() == "") {

        $('#alertaVacios').click();

    } else {

        document.getElementById("bnCancelar").setAttribute('style', 'display:none');

        document.getElementById("bnValidarCompra").setAttribute('onclick', '');
        document.getElementById("bnValidarCompra").setAttribute('style', 'display:inline-block');
        document.getElementById("bnValidarCompra").className = '';
        document.getElementById("bnValidarCompra").className = 'btn btn-primary is-loading is-loading-sm';

        $.ajax({
            url: '/Admin/varSesionIdUsuario',
            type: 'POST',

        }).done(function (vsU) {

            var datos = new FormData($("#Form_Pago")[0]);

            $.ajax({
                url: '/Pagos/validaCreedenciales',
                type: 'POST',
                data: datos,
                contentType: false,
                processData: false,

            }).done(function (response) {

                if (response == "True") {

                    datos.append('ptT', tT);
                    datos.append('pvsU', vsU);
                    datos.append('pvsCh', iccs);

                    $.ajax({
                        url: '/Pagos/RealizarCompra',
                        type: 'POST',
                        data: datos,
                        contentType: false,
                        processData: false,

                    }).done(function (response) {

                        if (response == 1) {

                            var consultaVincuVideUsu = {
                                pIdUsuario: vsU, pIdCharla: iccs
                            };

                            $.ajax({
                                url: '/Admin/VinculacionVideoUsuario',
                                type: 'POST',
                                data: consultaVincuVideUsu,

                            }).done(function (response) {
                                $('#confirmarVinculacion').click();
                                $('#AsignarModal').modal('toggle');

                            });

                            $('#txtgpNombre').val('');
                            $('#txtgpApellido').val('');
                            $('#txtgpCardNumero').val('');
                            $('#txtgpCardCVC').val('');

                            document.getElementById("txtgpExpirationMonth").value = 1;
                            llenarAnnos();

                            $('#CompraExitosa').click();
                            $("#infoConfirmacion").empty();

                            var pInfoCompra = document.getElementById("infoConfirmacion");

                            pInfoCompra.appendChild(document.createTextNode("Gracias por tu compra!"));
                            pInfoCompra.appendChild(document.createElement("br"));
                            pInfoCompra.appendChild(document.createTextNode("Ahora puedes acceder a " + txtgpNombreCharla));
                            pInfoCompra.appendChild(document.createElement("br"));
                            pInfoCompra.appendChild(document.createTextNode("y aprender mas sobre la cultura del café."));
                            $('#bnValidarCompra').html('De Acuerdo');

                            document.getElementById("bnValidarCompra").className = 'btn btn-primary text-white-100';
                            document.getElementById("bnValidarCompra").setAttribute('onclick', 'CargarPagCharlaDetalle(' + iccs + ')');

                        } else {
                            $('#errorGeneral').click();

                            $("#infoConfirmacion").empty();

                            $('#txtgpNombre').val('');
                            $('#txtgpApellido').val('');
                            $('#txtgpCardNumero').val('');
                            $('#txtgpCardCVC').val('');

                            document.getElementById("txtgpExpirationMonth").value = 1;
                            llenarAnnos();

                            document.getElementById("bnValidarCompra").className = 'btn btn-primary text-white-100';
                            document.getElementById("bnValidarCompra").setAttribute('data-dismiss', 'modal');

                            var pInfoCompra = document.getElementById("infoConfirmacion");

                            var strong = document.createElement("strong");
                            strong.appendChild(document.createTextNode("Error:"));

                            pInfoCompra.appendChild(strong);
                            pInfoCompra.appendChild(document.createElement("br"));
                            pInfoCompra.appendChild(document.createTextNode("Algo salio mal, por favor contacta con administracion para confirmar tu compra"));

                            $('#bnValidarCompra').html('De Acuerdo');

                        }
                    });

                } else if (response == "SinPrecio") {
                    $('#sinPrecio').click();

                    $("#infoConfirmacion").empty();

                    $('#txtgpNombre').val('');
                    $('#txtgpApellido').val('');
                    $('#txtgpCardNumero').val('');
                    $('#txtgpCardCVC').val('');

                    document.getElementById("txtgpExpirationMonth").value = 1;
                    llenarAnnos();

                    document.getElementById("bnValidarCompra").className = 'btn btn-primary text-white-100';
                    document.getElementById("bnValidarCompra").setAttribute('data-dismiss', 'modal');

                    var pInfoCompra = document.getElementById("infoConfirmacion");

                    var strong = document.createElement("strong");
                    strong.appendChild(document.createTextNode("Error:"));

                    pInfoCompra.appendChild(strong);
                    pInfoCompra.appendChild(document.createElement("br"));
                    pInfoCompra.appendChild(document.createTextNode("La charla no posee un precio definido"));

                    $('#bnValidarCompra').html('De Acuerdo');

                }
                else {
                    $('#errorPago').click();

                    $("#infoConfirmacion").empty();

                    $('#txtgpNombre').val('');
                    $('#txtgpApellido').val('');
                    $('#txtgpCardNumero').val('');
                    $('#txtgpCardCVC').val('');

                    document.getElementById("txtgpExpirationMonth").value = 1;
                    llenarAnnos();

                    document.getElementById("bnValidarCompra").className = 'btn btn-primary text-white-100';
                    document.getElementById("bnValidarCompra").setAttribute('data-dismiss', 'modal');

                    var pInfoCompra = document.getElementById("infoConfirmacion");

                    var strong = document.createElement("strong");
                    strong.appendChild(document.createTextNode("Error:"));

                    pInfoCompra.appendChild(strong);
                    pInfoCompra.appendChild(document.createElement("br"));
                    pInfoCompra.appendChild(document.createTextNode("Los datos de tarjeta ingresados son incorrectos."));

                    $('#bnValidarCompra').html('De Acuerdo');
                }
            });
        });
    }
}

function ConfirmarCompra() {

    document.getElementById("bnCancelar").setAttribute('style', 'display:inline');

    $('#bnValidarCompra').html('Confirmar Pago');
    document.getElementById("bnValidarCompra").className = 'btn btn-primary text-white-100';
    document.getElementById("bnValidarCompra").setAttribute('onclick', 'ValidarCompra();');
    document.getElementById("bnValidarCompra").setAttribute('data-dismiss', '');

    $("#infoConfirmacion").empty();

    var Visa = $("#pyVisa").is(":checked");

    if (Visa == true) {
        tipoTarjeta = "Visa";
    } else {
        tipoTarjeta = "Master Card";
    }

    var cbTipoMonedaSimbolo = "₡";

    txtgpNombre = $("#txtgpNombre").val();
    txtgpApellido = $("#txtgpApellido").val();

    txtgpCardNumero = $("#txtgpCardNumero").val();
    txtgpExpirationMonth = $("#txtgpExpirationMonth").val();
    txtgpExpirationYear = $("#txtgpExpirationYear").val();
    txtgpCardCVC = $("#txtgpCardCVC").val();

    var tarjetaTermina = txtgpCardNumero.substr(txtgpCardNumero.length - 4);

    txtgpNombreCharla = $("#txtgpNombreCharla").text();
    txtgpPrecio = $("#txtgpPrecio").text();

    if (txtgpNombre.trim() == "" || txtgpApellido.trim() == "" || txtgpCardNumero.trim() == "" || txtgpExpirationMonth.trim() == "" || txtgpExpirationYear.trim() == "" || txtgpCardCVC.trim() == "") {

        $('#alertaVacios').click();

    } else {

        var pInfoCompra = document.getElementById("infoConfirmacion");

        pInfoCompra.appendChild(document.createTextNode("Un ultimo Paso!"));
        pInfoCompra.appendChild(document.createElement("br"));
        pInfoCompra.appendChild(document.createTextNode("Antes de proceder con el pago necesitamos que confirmes los detalles de tu compra"));
        pInfoCompra.appendChild(document.createElement("br"));
        pInfoCompra.appendChild(document.createElement("br"));

        var strong = document.createElement("strong");
        strong.appendChild(document.createTextNode("Charla: "));
        pInfoCompra.appendChild(strong);
        pInfoCompra.appendChild(document.createTextNode(txtgpNombreCharla));
        pInfoCompra.appendChild(document.createElement("br"));

        var strong = document.createElement("strong");
        strong.appendChild(document.createTextNode("Precio: "));
        pInfoCompra.appendChild(strong);
        pInfoCompra.appendChild(document.createTextNode(cbTipoMonedaSimbolo + " " + txtgpPrecio));
        pInfoCompra.appendChild(document.createElement("br"));
        pInfoCompra.appendChild(document.createElement("br"));
        pInfoCompra.appendChild(document.createTextNode("Pago a realizarse con una tarjeta " + tipoTarjeta + " cuya terminación es: "));

        var strong = document.createElement("strong");
        strong.appendChild(document.createTextNode(tarjetaTermina));
        pInfoCompra.appendChild(strong);
        pInfoCompra.appendChild(document.createElement("br"));
        pInfoCompra.appendChild(document.createElement("br"));

        var strong = document.createElement("strong");
        strong.appendChild(document.createTextNode("Advertencia: "));
        pInfoCompra.appendChild(strong);
        pInfoCompra.appendChild(document.createTextNode("Revisa que el monto a cobrar concuerde con el tipo de moneda."));

        $('#modalConfirmarCompra').modal('show');

    }
}

function CargarPagCharlaDetalle(idCharla) {

    $.ajax({
        url: '/Charla/varSesionLlenarCharla',
        type: 'POST',
        data: { 'idLlenarCharla': idCharla }

    }).done(function (response) {

        $.ajax({
            url: '/Admin/varSesionRol',
            type: 'POST',

        }).done(function (response) {
            if (response == 1) {
                location.href = "/Charla/verCharlaDetalle";
            } else if (response != 1) {
                $.ajax({
                    url: '/Admin/varSesionIdUsuario',
                    type: 'POST',

                }).done(function (response) {
                    var idSession = response;

                    if (idSession == "") {
                        location.href = "/Charla/verCharlaDetalleGratis";
                    } else if (idSession != "") {
                        validaCompra(idCharla);
                    }
                });
            }
        });
    });
}

function validaCompra(ic) {

    $.ajax({
        url: '/Admin/varSesionIdUsuario',
        type: 'POST',

    }).done(function (vsU) {

        $.ajax({
            url: '/Charla/validaCharlaComprada',
            data: { 'idCharla': ic, 'idUsuario': vsU },
            type: 'POST',
        }).done(function (response) {

            if (response == 1) {
                location.href = "/Charla/verCharlaDetalle";
            } else {
                location.href = "/Charla/verCharlaDetalleGratis";
            }
        });
    });
}
