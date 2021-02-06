var myChart;

function validaAdminRepo(opc) {
    $.ajax({
        url: '/Admin/varSesionRol',/* aca llamo el metodo que contiene la variable*/
        type: 'POST',

    }).done(function (response) {
        var rol = response;

        if (rol == 1) {

            PrepararReporte(opc);
        } else {
            location.href = "/Home/Index";
        }
    });
}

function validaAdminRepoTop(opc) {
    $.ajax({
        url: '/Admin/varSesionRol',/* aca llamo el metodo que contiene la variable*/
        type: 'POST',

    }).done(function (response) {
        var rol = response;

        if (rol == 1) {
            PrepararReporteTop(opc)
        } else {
            location.href = "/Home/Index";
        }
    });
}

function llenarAnnos() {

    var nowY = 2020;

    var maxYear = new Date().getFullYear(),
        options = "";

    for (var Y = nowY; Y <= maxYear; Y++) {
        options += "<option>" + Y + "</option>";
    }

    $("#txtAnno").append(options);

}

/********************* Preparaciones Previas *********************/

function PrepararReporte(opc) {

    if (opc != 7) {
        fechaFin = moment().format('YYYY-MM-DD');
        fechaInicio = moment().subtract(1, 'months').format('YYYY-MM-DD');

        var txtFechaFin = document.getElementById("fechaFin");
        txtFechaFin.setAttribute("max", fechaFin);

        var txtFechaInicio = document.getElementById("fechaInicio");
        txtFechaInicio.setAttribute("max", fechaFin);

        $("#fechaInicio").val(fechaInicio);
        $("#fechaFin").val(fechaFin);
    }

    if (opc == 1) {
        var IdRol = $("#OpcionUsuario").val();
        UsuariosRegistrados(fechaInicio, fechaFin, IdRol);
    } else if (opc == 2) {
        CharlasRegistradas(fechaInicio, fechaFin);
    } else if (opc == 6) {
        Ventas(fechaInicio, fechaFin);
    } else if (opc == 7) {
        llenarAnnos();
        var mes = $("#txtMes").val();
        var anno = $("#txtAnno").val();
        GananciasCharlista(mes, anno);
    }
}

function PrepararReporteTop(opc) {

    if (opc == 3) {
        TopCharlas();
    } else if (opc == 4) {
        TopCharlistas();
    } else if (opc == 5) {
        TopCharlasVendidas();
    }
}

function ActualizarReporte(opc) {

    var pFechaInicio = $("#fechaInicio").val();
    var pFechaFin = $("#fechaFin").val();

    myChart.destroy();

    if (opc == 1) {
        var pIdRol = $("#OpcionUsuario").val();
        UsuariosRegistrados(pFechaInicio, pFechaFin, pIdRol);
    } else if (opc == 2) {
        CharlasRegistradas(pFechaInicio, pFechaFin);
    } else if (opc == 3) {
        TopCharlas();
    } else if (opc == 4) {
        TopCharlistas();
    } else if (opc == 6) {
        Ventas(pFechaInicio, pFechaFin);
    } else if (opc == 7) {
        var mes = $("#txtMes").val();
        var anno = $("#txtAnno").val();
        GananciasCharlista(mes, anno);
    }
}

function PrepararPDF(opc) {

    if (opc != 7) {
        var pFechaInicio = $("#fechaInicio").val();
        var pFechaFin = $("#fechaFin").val();
    }

    if (opc == 1) {
        var pIdRol = $("#OpcionUsuario").val();
        UsuariosPDF(pFechaInicio, pFechaFin, pIdRol);
    } else if (opc == 2) {
        CharlasPDF(pFechaInicio, pFechaFin)
    } else if (opc == 3) {
        TopCharlasPDF();
    } else if (opc == 4) {
        TopCharlistasPDF();
    } else if (opc == 5) {
        TopCharlasVendidasPDF(5);
    } else if (opc == 6) {
        VentasPDF(pFechaInicio, pFechaFin);
    } else if (opc == 7) {
        var mes = $("#txtMes").val();
        var anno = $("#txtAnno").val();
        GananciasCharlistaPDF(mes, anno);
    }
}

function TXT(opcion) {

    if (opcion != 7) {
        var pFechaInicio = $("#fechaInicio").val();
        var pFechaFin = $("#fechaFin").val();
    }

    if (opcion == 1) {
        var pIdRol = $("#OpcionUsuario").val();
        txtUsuariosRegistrados(pFechaInicio, pFechaFin, pIdRol);
    } else if (opcion == 2) {
        txtCharlasRegistradas(pFechaInicio, pFechaFin);
    } else if (opcion == 3) {
        txtTopCharlas();
    } else if (opcion == 4) {
        txtTopCharlista();
    } else if (opcion == 5) {
        txtTopCharlasVendidas();
    } else if (opcion == 6) {
        txtVentas(pFechaInicio, pFechaFin);
    } else if (opcion == 7) {
        var mes = $("#txtMes").val();
        var anno = $("#txtAnno").val();
        txtGananciasCharlista(mes, anno);
    }
}

function CSV(opcion) {

    if (opcion != 7) {
        var pFechaInicio = $("#fechaInicio").val();
        var pFechaFin = $("#fechaFin").val();
    }

    if (opcion == 1) {
        var pIdRol = $("#OpcionUsuario").val();
        csvUsuariosRegistrados(pFechaInicio, pFechaFin, pIdRol);
    } else if (opcion == 2) {
        csvCharlasRegistradas(pFechaInicio, pFechaFin);
    } else if (opcion == 3) {
        csvTopCharlas();
    } else if (opcion == 4) {
        csvTopCharlista();
    } else if (opcion == 5) {
        csvTopCharlasVendidas();
    } else if (opcion == 6) {
        csvVentas(pFechaInicio, pFechaFin);
    } else if (opcion == 7) {
        var mes = $("#txtMes").val();
        var anno = $("#txtAnno").val();
        csvGananciasCharlista(mes, anno);
    }
}

/********************* Generar Gráfico  *********************/

function UsuariosRegistrados(pFechaInicio, pFechaFin, pIdRol) {

    var consulta = {
        pFechaInicio: pFechaInicio, pFechaFin: pFechaFin, pIdRol: pIdRol
    };

    if (pIdRol == 3) {
        var Rol = "Clientes";
    } else {
        var Rol = "Charlistas";
    }

    $.ajax({
        url: '/Reportes/ReporteCantUsuarios',
        type: 'POST',
        data: consulta,

    }).done(function (response) {

        var data = JSON.parse(response);

        var labels = [], datos = [];

        for (x = 0; x < data.length; x++) {
            labels[x] = moment(data[x].fecha).format(moment.HTML5_FMT.DATE);
            datos[x] = data[x].cantUsuario;
        }

        var ctx = document.getElementById('ChartUsuarios').getContext('2d');

        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Cantidad de ' + Rol + ' registrados',
                    data: datos,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                title: {
                    display: true,
                    fontSize: 25,
                    text: Rol + ' registrados entre ' + pFechaInicio + ' y ' + pFechaFin
                },
                animation: {
                    duration: 1000,
                    easing: 'linear',
                },
                legend: {
                    display: false,
                },
                responsive: true
            }
        });
    });
}

function CharlasRegistradas(pFechaInicio, pFechaFin) {

    var consulta = {
        pFechaInicio: pFechaInicio, pFechaFin: pFechaFin
    };

    $.ajax({
        url: '/Reportes/ReporteCantCharlas',
        type: 'POST',
        data: consulta,

    }).done(function (response) {

        var data = JSON.parse(response);

        var labels = [], datos = [];

        for (x = 0; x < data.length; x++) {
            labels[x] = data[x].nombreCategoria;
            datos[x] = data[x].cantCharlas;
        }

        var ctx = document.getElementById('ChartCharlas').getContext('2d');

        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Cantidad de charlas creadas',
                    data: datos,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                title: {
                    display: true,
                    fontSize: 25,
                    text: 'Charlas registradas entre ' + pFechaInicio + ' y ' + pFechaFin
                },
                animation: {
                    duration: 1000,
                    easing: 'linear',
                },
                legend: {
                    display: false,
                },
                responsive: true
            }
        });
    });
}

function TopCharlas() {

    $.ajax({
        url: '/Reportes/ReporteTopCharlas',
        type: 'POST',

    }).done(function (response) {

        var data = JSON.parse(response);

        var labels = [], datos = [];

        for (x = 0; x < data.length; x++) {
            labels[x] = data[x].nombreCharla;
            datos[x] = data[x].valoracionCharla;
        }

        var ctx = document.getElementById('ChartTopCharlas').getContext('2d');

        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Valoración promedio',
                    data: datos,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                title: {
                    display: true,
                    fontSize: 25,
                    text: 'Top 10 Charlas mejor valoradas'
                },
                animation: {
                    duration: 1000,
                    easing: 'linear',
                },
                legend: {
                    display: false,
                },
                responsive: true
            }
        });
    });
}

function TopCharlistas() {

    $.ajax({
        url: '/Reportes/ReporteTopCharlistas',
        type: 'POST',

    }).done(function (response) {

        var data = JSON.parse(response);

        var labels = [], datos = [];
        var nomUsuario;

        for (x = 0; x < data.length; x++) {
            nomUsuario = data[x].nombreUsuario + " " + data[x].apellidosUsuario;
            labels[x] = nomUsuario;
            datos[x] = data[x].valoracionCharlista;
        }

        var ctx = document.getElementById('ChartTopCharlistas').getContext('2d');

        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Valoración promedio',
                    data: datos,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                title: {
                    display: true,
                    fontSize: 25,
                    text: 'Top 10 Charlistas mejor valorados'
                },
                animation: {
                    duration: 1000,
                    easing: 'linear',
                },
                legend: {
                    display: false,
                },
                responsive: true
            }
        });
    });
}

function TopCharlasVendidas() {

    $.ajax({
        url: '/Reportes/ReporteTopCharlasVendidas',
        type: 'POST',

    }).done(function (response) {

        var data = JSON.parse(response);

        var labels = [], datos = [];
        var nomUsuario;

        for (x = 0; x < data.length; x++) {
            labels[x] = data[x].nombreCharla;
            datos[x] = data[x].cantidad;
        }

        var ctx = document.getElementById('ChartTopCharlasVendidas').getContext('2d');

        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Cantidad de charlas Vendidas',
                    data: datos,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                title: {
                    display: true,
                    fontSize: 25,
                    text: 'Top 10 Charlas más vendidas'
                },
                animation: {
                    duration: 1000,
                    easing: 'linear',
                },
                legend: {
                    display: false,
                },
                responsive: true
            }
        });
    });

}

function Ventas(pFechaInicio, pFechaFin) {

    var consulta = {
        pFechaInicio: pFechaInicio, pFechaFin: pFechaFin
    };

    $.ajax({
        url: '/Reportes/ReporteDeVentas',
        type: 'POST',
        data: consulta,

    }).done(function (response) {

        var data = JSON.parse(response);

        var labels = [], datos = [];

        for (x = 0; x < data.length; x++) {
            labels[x] = data[x].fechaMatricula;
            datos[x] = data[x].Total;
        }

        var ctx = document.getElementById('ChartVentas').getContext('2d');

        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Ganancias ₡',
                    data: datos,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                title: {
                    display: true,
                    fontSize: 25,
                    text: 'Ganacias entre ' + pFechaInicio + ' y ' + pFechaFin
                },
                animation: {
                    duration: 1000,
                    easing: 'linear',
                },
                legend: {
                    display: false,
                },
                responsive: true
            }
        });
    });
}

function GananciasCharlista(pMes, pAnno) {

    var consulta = {
        pMes: pMes, pAnno: pAnno
    };

    $.ajax({
        url: '/Reportes/ReporteGanancias',
        type: 'POST',
        data: consulta,

    }).done(function (response) {

        var data = JSON.parse(response);

        var labels = [], datos = [];

        for (x = 0; x < data.length; x++) {
            labels[x] = data[x].Charlista;
            datos[x] = data[x].Ganancia;
        }

        var ctx = document.getElementById('ChartGanancias').getContext('2d');

        var mes = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"];

        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Ganancias ₡',
                    data: datos,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                title: {
                    display: true,
                    fontSize: 25,
                    text: 'Ganacias de ' + mes[pMes - 1] + ' del año ' + pAnno
                },
                animation: {
                    duration: 1000,
                    easing: 'linear',
                },
                legend: {
                    display: false,
                },
                responsive: true
            }
        });
    });
}

/********************* Generar PDF  *********************/

function UsuariosPDF(pFechaInicio, pFechaFin, pIdRol) {

    var consulta = {
        pFechaInicio: pFechaInicio, pFechaFin: pFechaFin, pIdRol: pIdRol
    };

    if (pIdRol == 3) {
        var Rol = "Clientes";
    } else {
        var Rol = "Charlistas";
    }

    $.ajax({
        url: '/Reportes/ReporteCantUsuarios',
        type: 'POST',
        data: consulta,

    }).done(function (response) {

        try {
            var fecha = new Date();
            var FechaActual = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate();

            var data = JSON.parse(response);
            var rows = [];

            //Nombre de las columnas de la tabla del PDF
            var columns = ["Cantidad de " + Rol, "Fecha de Registro"];

            for (x = 0; x < data.length; x++) {
                rows.push([data[x].cantUsuario, moment(data[x].fecha).format(moment.HTML5_FMT.DATE)]);
            }

            //crea el documento PDF
            var doc = new jsPDF('landscape');

            doc.autoTable(columns, rows);

            //agrega una página nueva al documento
            doc.addPage()

            var newCanvas = document.querySelector('#ChartUsuarios');
            var CanvasImg = newCanvas.toDataURL("image/png", 1.0);

            doc.addImage(CanvasImg, 'PNG', 10, 10, 280, 150);
            doc.save(Rol + 'Registrados_' + FechaActual);

            $('#confirmacionExporte').click();

        } catch (error) {
            $('#errorExporte').click();
        }
    });
}

function CharlasPDF(pFechaInicio, pFechaFin) {

    var consulta = {
        pFechaInicio: pFechaInicio, pFechaFin: pFechaFin
    };

    $.ajax({
        url: '/Reportes/ReporteCantCharlas',
        type: 'POST',
        data: consulta,

    }).done(function (response) {

        try {

            var fecha = new Date();
            var FechaActual = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate();

            var data = JSON.parse(response);
            var rows = [];

            //Nombre de las columnas de la tabla del PDF
            var columns = ["Categoria ", "Cantidad de Charlas"];

            for (x = 0; x < data.length; x++) {
                rows.push([data[x].nombreCategoria, data[x].cantCharlas]);
            }

            //crea el documento PDF
            var doc = new jsPDF('landscape');

            doc.autoTable(columns, rows);

            //agrega una página nueva al documento
            doc.addPage()

            var newCanvas = document.querySelector('#ChartCharlas');
            var CanvasImg = newCanvas.toDataURL("image/png", 1.0);

            doc.addImage(CanvasImg, 'PNG', 10, 10, 280, 150);
            doc.save('CharlasRegistradas_' + FechaActual);
            $('#confirmacionExporte').click();

        } catch (error) {
            $('#errorExporte').click();
        }
    });
}

function TopCharlasPDF() {

    $.ajax({
        url: '/Reportes/ReporteTopCharlas',
        type: 'POST',

    }).done(function (response) {

        try {
            var fecha = new Date();
            var FechaActual = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate();

            var data = JSON.parse(response);
            var rows = [];

            //Nombre de las columnas de la tabla del PDF
            var columns = ["Charla", "Valoración Promedio (0-5)"];

            for (x = 0; x < data.length; x++) {
                rows.push([data[x].nombreCharla, data[x].valoracionCharla]);
            }

            //crea el documento PDF
            var doc = new jsPDF('landscape');

            doc.autoTable(columns, rows);

            //agrega una página nueva al documento
            doc.addPage()

            var newCanvas = document.querySelector('#ChartTopCharlas');
            var CanvasImg = newCanvas.toDataURL("image/png", 1.0);

            doc.addImage(CanvasImg, 'PNG', 10, 10, 280, 150);
            doc.save('TopCharlas_' + FechaActual);
            $('#confirmacionExporte').click();

        } catch (error) {
            $('#errorExporte').click();
        }

    });
}

function TopCharlistasPDF() {

    $.ajax({
        url: '/Reportes/ReporteTopCharlistas',
        type: 'POST',

    }).done(function (response) {

        try {
            var fecha = new Date();
            var FechaActual = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate();

            var data = JSON.parse(response);
            var rows = [];
            var nomUsuario;

            //Nombre de las columnas de la tabla del PDF
            var columns = ["Charlista", "Valoración Promedio (0-5)"];

            for (x = 0; x < data.length; x++) {
                nomUsuario = data[x].nombreUsuario + " " + data[x].apellidosUsuario;
                rows.push([nomUsuario, data[x].valoracionCharlista]);
            }

            //crea el documento PDF
            var doc = new jsPDF('landscape');

            doc.autoTable(columns, rows);

            //agrega una página nueva al documento
            doc.addPage()

            var newCanvas = document.querySelector('#ChartTopCharlistas');
            var CanvasImg = newCanvas.toDataURL("image/png", 1.0);

            doc.addImage(CanvasImg, 'PNG', 10, 10, 280, 150);
            doc.save('TopCharlistas_' + FechaActual);
            $('#confirmacionExporte').click();

        } catch (error) {
            $('#errorExporte').click();
        }
    });
}

function TopCharlasVendidasPDF() {

    $.ajax({
        url: '/Reportes/ReporteTopCharlasVendidas',
        type: 'POST',

    }).done(function (response) {

        try {
            var fecha = new Date();
            var FechaActual = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate();

            var data = JSON.parse(response);
            var rows = [];

            //Nombre de las columnas de la tabla del PDF
            var columns = ["Charla", "Cantidad de ventas"];

            for (x = 0; x < data.length; x++) {
                rows.push([data[x].nombreCharla, data[x].cantidad]);
            }

            //crea el documento PDF
            var doc = new jsPDF('landscape');

            doc.autoTable(columns, rows);

            //agrega una página nueva al documento
            doc.addPage()

            var newCanvas = document.querySelector('#ChartTopCharlasVendidas');
            var CanvasImg = newCanvas.toDataURL("image/png", 1.0);

            doc.addImage(CanvasImg, 'PNG', 10, 10, 280, 150);
            doc.save('TopCharlasVendidas_' + FechaActual);
            $('#confirmacionExporte').click();

        } catch (error) {
            $('#errorExporte').click();
        }
    });
}

function VentasPDF(pFechaInicio, pFechaFin) {

    var consulta = {
        pFechaInicio: pFechaInicio, pFechaFin: pFechaFin
    };

    $.ajax({
        url: '/Reportes/ReporteDeVentas',
        type: 'POST',
        data: consulta,

    }).done(function (response) {

        try {
            var fecha = new Date();
            var FechaActual = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate();

            var data = JSON.parse(response);
            var rows = [];

            //Nombre de las columnas de la tabla del PDF
            var columns = ["Total (colones)", "Fecha"];

            for (x = 0; x < data.length; x++) {
                rows.push([data[x].Total, data[x].fechaMatricula]);
            }

            //crea el documento PDF
            var doc = new jsPDF('landscape');

            doc.autoTable(columns, rows);

            //agrega una página nueva al documento
            doc.addPage()

            var newCanvas = document.querySelector('#ChartVentas');
            var CanvasImg = newCanvas.toDataURL("image/png", 1.0);

            doc.addImage(CanvasImg, 'PNG', 10, 10, 280, 150);
            doc.save('Ventas_' + FechaActual);
            $('#confirmacionExporte').click();

        } catch (error) {
            $('#errorExporte').click();
        }
    });
}

function GananciasCharlistaPDF(pMes, pAnno) {

    var consulta = {
        pMes: pMes, pAnno: pAnno
    };

    $.ajax({
        url: '/Reportes/ReporteGanancias',
        type: 'POST',
        data: consulta,

    }).done(function (response) {

        try {
            var fecha = new Date();
            var FechaActual = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate();

            var data = JSON.parse(response);
            var rows = [];

            //Nombre de las columnas de la tabla del PDF
            var columns = ["Ganancia (colones)", "Charlista"];

            for (x = 0; x < data.length; x++) {
                rows.push([data[x].Ganancia, data[x].Charlista]);
            }

            //crea el documento PDF
            var doc = new jsPDF('landscape');

            doc.autoTable(columns, rows);

            //agrega una página nueva al documento
            doc.addPage()

            var newCanvas = document.querySelector('#ChartGanancias');
            var CanvasImg = newCanvas.toDataURL("image/png", 1.0);

            doc.addImage(CanvasImg, 'PNG', 10, 10, 280, 150);
            doc.save('GananciasCharlista_' + FechaActual);
            $('#confirmacionExporte').click();

        } catch (error) {
            $('#errorExporte').click();
        }
    });
}

/********************* Generar TXT  *********************/

function txtTopCharlas() {
    archivo = 1;
    var consulta = {
        archivo: archivo
    };
    $.ajax({
        url: '/Reportes/txtToCharlas',
        type: 'POST',
        data: consulta,

    }).done(function (response) {
        if (response == 1) {
            $('#confirmacionExporte').click();
        } else {
            $('#errorExporte').click();
        }
    });
}

function txtTopCharlista() {
    archivo = 1;
    var consulta = {
        archivo: archivo
    };
    $.ajax({
        url: '/Reportes/txtTopCharlistas',
        type: 'POST',
        data: consulta,

    }).done(function (response) {
        if (response == 1) {
            $('#confirmacionExporte').click();
        } else {
            $('#errorExporte').click();
        }
    });
}

function txtTopCharlasVendidas() {
    archivo = 1;
    var consulta = {
        archivo: archivo
    };
    $.ajax({
        url: '/Reportes/txtTopCharlasVendidas',
        type: 'POST',
        data: consulta,

    }).done(function (response) {
        if (response == 1) {
            $('#confirmacionExporte').click();
        } else {
            $('#errorExporte').click();
        }
    });
}

function txtUsuariosRegistrados(pFechaInicio, pFechaFin, pIdRol) {
    archivo = 1;
    var consulta = {
        pFechaInicio: pFechaInicio, pFechaFin: pFechaFin, pIdRol: pIdRol, archivo: archivo
    };
    $.ajax({
        url: '/Reportes/txtCantUsuarios',
        type: 'POST',
        data: consulta,

    }).done(function (response) {
        if (response == 1) {
            $('#confirmacionExporte').click();
        } else {
            $('#errorExporte').click();
        }
    });
}

function txtCharlasRegistradas(pFechaInicio, pFechaFin) {
    archivo = 1;
    var consulta = {
        pFechaInicio: pFechaInicio, pFechaFin: pFechaFin, archivo: archivo
    };
    $.ajax({
        url: '/Reportes/txtCantCharlas',
        type: 'POST',
        data: consulta,

    }).done(function (response) {
        if (response == 1) {
            $('#confirmacionExporte').click();
        } else {
            $('#errorExporte').click();
        }
    });
}

function txtVentas(pFechaInicio, pFechaFin) {

    archivo = 1;
    var consulta = {
        pFechaInicio: pFechaInicio, pFechaFin: pFechaFin, archivo: archivo
    };
    $.ajax({
        url: '/Reportes/txtVentas',
        type: 'POST',
        data: consulta,

    }).done(function (response) {
        if (response == 1) {
            $('#confirmacionExporte').click();
        } else {
            $('#errorExporte').click();
        }
    });

}

function txtGananciasCharlista(pMes, pAnno) {

    archivo = 1;
    var consulta = {
        pMes: pMes, pAnno: pAnno, archivo: archivo
    };

    $.ajax({
        url: '/Reportes/txtGananciasCharlista',
        type: 'POST',
        data: consulta,

    }).done(function (response) {
        if (response == 1) {
            $('#confirmacionExporte').click();
        } else {
            $('#errorExporte').click();
        }
    });
}

/********************* Generar CSV *********************/

function csvTopCharlas(archivo) {
    archivo = 2;
    var consulta = {
        archivo: archivo
    };
    $.ajax({
        url: '/Reportes/txtToCharlas',
        type: 'POST',
        data: consulta,

    }).done(function (response) {
        if (response == 1) {
            $('#confirmacionExporte').click();
        } else {
            $('#errorExporte').click();
        }
    });
}

function csvTopCharlista(archivo) {
    archivo = 2;
    var consulta = {
        archivo: archivo
    };
    $.ajax({
        url: '/Reportes/txtTopCharlistas',
        type: 'POST',
        data: consulta,

    }).done(function (response) {
        if (response == 1) {
            $('#confirmacionExporte').click();
        } else {
            $('#errorExporte').click();
        }
    });
}

function csvTopCharlasVendidas() {
    archivo = 2;
    var consulta = {
        archivo: archivo
    };
    $.ajax({
        url: '/Reportes/txtTopCharlasVendidas',
        type: 'POST',
        data: consulta,

    }).done(function (response) {
        if (response == 1) {
            $('#confirmacionExporte').click();
        } else {
            $('#errorExporte').click();
        }
    });
}

function csvVentas(pFechaInicio, pFechaFin,) {
    archivo = 2;
    var consulta = {
        pFechaInicio: pFechaInicio, pFechaFin: pFechaFin, archivo: archivo
    };
    $.ajax({
        url: '/Reportes/txtVentas',
        type: 'POST',
        data: consulta,

    }).done(function (response) {
        if (response == 1) {
            $('#confirmacionExporte').click();
        } else {
            $('#errorExporte').click();
        }
    });
}

function csvUsuariosRegistrados(pFechaInicio, pFechaFin, pIdRol, archivo) {
    archivo = 2;
    var consulta = {
        pFechaInicio: pFechaInicio, pFechaFin: pFechaFin, pIdRol: pIdRol, archivo: archivo
    };
    $.ajax({
        url: '/Reportes/txtCantUsuarios',
        type: 'POST',
        data: consulta,

    }).done(function (response) {
        if (response == 1) {
            $('#confirmacionExporte').click();
        } else {
            $('#errorExporte').click();
        }
    });
}

function csvCharlasRegistradas(pFechaInicio, pFechaFin, archivo) {
    archivo = 2;
    var consulta = {
        pFechaInicio: pFechaInicio, pFechaFin: pFechaFin, archivo: archivo
    };
    $.ajax({
        url: '/Reportes/txtCantCharlas',
        type: 'POST',
        data: consulta,

    }).done(function (response) {
        if (response == 1) {
            $('#confirmacionExporte').click();
        } else {
            $('#errorExporte').click();
        }
    });
}

function csvGananciasCharlista(pMes, pAnno) {

    archivo = 2;
    var consulta = {
        pMes: pMes, pAnno: pAnno, archivo: archivo
    };

    $.ajax({
        url: '/Reportes/txtGananciasCharlista',
        type: 'POST',
        data: consulta,

    }).done(function (response) {
        if (response == 1) {
            $('#confirmacionExporte').click();
        } else {
            $('#errorExporte').click();
        }
    });
}