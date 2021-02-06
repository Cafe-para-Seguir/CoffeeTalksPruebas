var tablaConsulta;

String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
}
String.prototype.ltrim = function () {
    return this.replace(/^\s+/, "");
}
String.prototype.rtrim = function () {
    return this.replace(/\s+$/, "");
}

function CallCategorias() {

    $.ajax({
        url: '/Categoria/Cargar_Tabla_Categoria',
        type: 'POST',

    }).done(function (response) {
        var datos = JSON.parse(response);
        CargarTablaCategorias(datos);

    });
}

function CargarTablaCategorias(Data) {

    $('#tbl_Categorias').dataTable().fnDestroy();
    tablaConsulta = $('#tbl_Categorias').DataTable({
        autofill: false,
        data: Data,

        language: {
            "decimal": "",
            "emptyTable": "No hay información",
            "info": "Mostrando _END_ de _TOTAL_ datos ",
            "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
            "infoFiltered": "(Filtrado de MAX total entradas)",
            "infoPostFix": "",
            "thousands": ",",
            "lengthMenu": "Mostrar _MENU_ datos",
            "loadingRecords": "Cargando...",
            "processing": "Procesando...",
            "search": "Buscar:",
            "zeroRecords": "Sin resultados encontrados",
            "paginate": {
                "first": "Primero",
                "last": "Ultimo",
                "next": "Siguiente",
                "previous": "Anterior"
            }
        },

        pageLength: 10,
        lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, 'Todos']],
        "columns": [
            { data: "idCategoria", visible: false },
            { data: "nombreCategoria" },
            { data: "fechaCreacion" },
            { data: "usuarioCreacion" },
            { data: "fechaModificacion" },
            { data: "usuarioModificacion" },

            {
                render: function (data, type, row, meta) {
                    return '<button class ="btn btn-primary" onclick="ModificarModalCategoria(2, \'' + row.idCategoria + '\')" >Modificar</button>';
                }
            },
            {
                render: function (data, type, row, meta) {
                    return '<button class ="btn btn-primary" onclick="ConfirmarEliminarCategoria(\'' + row.idCategoria + '\' ) " >Eliminar</button>';
                }
            }
        ]
    });
}

function ConfirmarEliminarCategoria(idCategoria) {
    $('#modalEliminar').modal('show');
    $("#txtIdCategoria").val(idCategoria);

}

function jsMantCategoria(pModo, pIdCategoria) {

    if (pModo == "MODIFICAR" || pModo == "ELIMINAR") {
        var pIdCategoria = $("#txtIdCategoria").val();
    }

    var txtNombreCategoria = $("#txtNombreCategoria").val();
    var txtDescripcionCategoria = $("#txtDescripcionCategoria").val();
    var txtImagenCategoria = "Sin Imagen"; //$("#txtImagenCategoria").val();

    var pUsuarioCreacion = "";
    var pUsuarioModificacion = "";

    $.ajax({
        url: '/Admin/varSesionCorreo',
        type: 'POST',

    }).done(function (response) {

        pUsuarioCreacion = response;
        pUsuarioModificacion = response;

        if (pModo != "ELIMINAR" && txtNombreCategoria.trim() == "") {
            $('#txtNombreUsuario').focus();
            $('#alertaVacios').click();

        } else if (pModo != "ELIMINAR" && txtDescripcionCategoria.trim() == "") {
            $('#txtDescripcionCategoria').focus();
            $('#alertaVacios').click();

        } else {

            var consulta = { pModo: pModo, pIdCategoria: pIdCategoria, pNombreCategoria: txtNombreCategoria, pDescripcionCategoria: txtDescripcionCategoria, pImagenCategoria: txtImagenCategoria, pUsuarioCreacion: pUsuarioCreacion, pUsuarioModificacion: pUsuarioModificacion };
            $.ajax({
                url: '/Categoria/MantCategoria',
                type: 'POST',
                data: consulta,

            }).done(function (response) {
                if (response == 39) {
                    $('#errorEliminar').click();
                } else if (response == 1) {
                    $('#confirmarCreacion').click();
                    CallCategorias();
                    $('#ModalCategoria').modal('toggle');
                } else if (response == 3) {
                    $('#confirmarEliminar').click();
                    CallCategorias();
                    $('#modalEliminar').modal('toggle');
                } else {
                    $('#errorGeneral').click();
                }
            });
        }
    });
}

function ModificarModalCategoria(pModo, idCategoria) {

    $("#btn_agregar").css("display", "none");
    $("#btn_modificar").css("display", "block");
    $("#NoMostar").css("display", "block");

    $("#imagenid").val('');

    if (pModo == "2") {
        pModo = "MODIFICAR";
    }

    $('#ModalCategoria').modal('show');

    $.ajax({
        url: '/Categoria/Cargar_Tabla_Categoria_Filtrada',
        data: { 'pIdCategoria': idCategoria },      //envia por parametro el ID del usuario para recibir los datos de ese usuario
        type: 'POST',

    }).done(function (response) {
        var datos = JSON.parse(response);         //trae los datos del usuario del id especifico

        $("#txtIdCategoria").val(idCategoria);
        $("#txtNombreCategoria").val(datos[0].nombreCategoria);
        $("#txtDescripcionCategoria").val(datos[0].descripcionCategoria);
        $("#txtImagenCategoria").val(datos[0].imagenCategoria);

    });
}

function MostrarCampoCategoria() {
    $("#NoMostar").css("display", "none");
    $("#btn_agregar").css("display", "block");
    $("#btn_modificar").css("display", "none");

    $('#ModalCategoria').modal('show');

    $("#txtNombreCategoria").val("");
    $("#txtDescripcionCategoria").val("");

    $("#txtImagenCategoria").val("");
}

function CargarCategorias() {

    $.ajax({

        url: '/Categoria/Cargar_Tabla_Categoria',
        type: 'POST',

    }).done(function (response) {
        var datos = JSON.parse(response);

        var ulCategorias = document.getElementById("ulCategorias");

        //Crea los elementos necesarios para mostrar los filtros de categorias
        for (x = 0; x < datos.length; x++) {

            var NombreCategoria = document.createTextNode(datos[x].nombreCategoria);

            var ElementoLista = document.createElement('li');
            ElementoLista.className = 'sidebar-menu-item';
            ElementoLista.id = 'liFiltro' + datos[x].idCategoria;
            ElementoLista.setAttribute('style', 'cursor:pointer;');

            var ElementoA = document.createElement('a');
            ElementoA.className = 'sidebar-menu-button';

            var ElementoSpan = document.createElement('span');
            ElementoSpan.className = 'sidebar-menu-text';
            ElementoSpan.id = "filtro" + datos[x].idCategoria;
            ElementoSpan.setAttribute("onclick", "CargarCharlasFiltradas(" + datos[x].idCategoria + ")");

            ulCategorias.appendChild(ElementoLista);
            ElementoLista.appendChild(ElementoA);
            ElementoA.appendChild(ElementoSpan);
            ElementoSpan.appendChild(NombreCategoria);
        }
    });
}

function validaAdminCategoria() {

    $.ajax({
        url: '/Admin/varSesionRol',/* aca llamo el metodo que contiene la variable*/
        type: 'POST',

    }).done(function (response) {
        var rol = response;

        if (rol == 1) {
            CallCategorias();
        } else {
            location.href = "/Home/Index";
        }
    });

}

function ModificarCategoria() {

    var pIdCategoria = $("#txtIdCategoria").val();
    var txtNombreCategoria = $("#txtNombreCategoria").val();
    var txtDescripcionCategoria = $("#txtDescripcionCategoria").val();
    var txtImagenCategoria = $("#txtImagenCategoria").val();

    var pUsuarioCreacion = "";
    var pUsuarioModificacion = "";

    $.ajax({
        url: '/Admin/varSesionCorreo',
        type: 'POST',

    }).done(function (response) {

        pUsuarioCreacion = response;
        pUsuarioModificacion = response;

        if (txtNombreCategoria.trim() == "") {
            $('#txtNombreUsuario').focus();
            $('#alertaVacios').click();

        } else if (txtDescripcionCategoria.trim() == "") {
            $('#txtDescripcionCategoria').focus();
            $('#alertaVacios').click();

        } else {
            var datos = new FormData($("#form_categoria")[0]);

            datos.append("pModo", "MODIFICAR");
            datos.append("pIdCategoria", pIdCategoria);
            datos.append("txtImagenCategoria", txtImagenCategoria);
            datos.append("pUsuarioCreacion", pUsuarioCreacion);
            datos.append("pUsuarioModificacion", pUsuarioModificacion);

            $.ajax({
                url: '/Categoria/ModificarCategoria',
                type: 'POST',
                data: datos,
                contentType: false,
                processData: false,

            }).done(function (response) {
                if (response != 2) {// cambio para arreglar "Categoria no se modifica"
                    $('#errorGeneral').click();//esta respondiendo esto
                } else {
                    $('#confirmarModificar').click();
                    $('#ModalCategoria').modal('toggle');
                }
                CallCategorias();
            });
        }
    });
}