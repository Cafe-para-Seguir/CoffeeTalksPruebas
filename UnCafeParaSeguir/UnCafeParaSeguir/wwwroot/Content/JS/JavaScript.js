/*function CallLlamada() {

    $.ajax({
        url: '/Home/Cargar_Tabla',
        type: 'POST',

    }).done(function (response) {
        var datos = JSON.parse(response);
        Cargar_tabla(datos);
    });
   
}
var tablaConsulta;
function Cargar_tabla(Data) {

    tablaConsulta = $('#tbl_new').DataTable({
        autofill: false,
        data: Data,

        "colums": [
            { data: "idUsuario" }
        ]
    });
}*/