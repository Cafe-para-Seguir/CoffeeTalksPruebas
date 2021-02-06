using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using UnCafeParaSeguir.Models;
using System;
using System.IO;

namespace UnCafeParaSeguir.Controllers
{
    public class ReportesController : Controller
    {

        private readonly ILogger<ReportesController> _logger;
        ConexionBD conDB = new ConexionBD();

        public ReportesController(ILogger<ReportesController> logger)
        {
            _logger = logger;
        }

        public IActionResult UsuariosRegistrados()
        {
            return View();
        }

        public IActionResult CharlasRegistradas()
        {
            return View();
        }

        public IActionResult TopCharlas()
        {
            return View();
        }

        public IActionResult TopCharlistas()
        {
            return View();
        }

        public IActionResult TopCharlasVendidas()
        {
            return View();
        }

        public IActionResult ReporteVentas()
        {
            return View();
        }

        public IActionResult GananciaCharlista()
        {
            return View();
        }

        /************************************************************** Llamar SP's **************************************************************/
        public ContentResult ReporteCantUsuarios(string pFechaInicio, string pFechaFin, int pIdRol)
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_ReporteCantUsuarios('" + pFechaInicio + "' , '" + pFechaFin + "', " + pIdRol + ");");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);
        }

        public ContentResult ReporteCantCharlas(string pFechaInicio, string pFechaFin)
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_ReporteCantCharlas('" + pFechaInicio + "' , '" + pFechaFin + "');");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);
        }

        public ContentResult ReporteTopCharlas()
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_ReporteTopCharlas();");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);
        }

        public ContentResult ReporteTopCharlistas()
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_ReporteTopCharlistas();");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);
        }

        public ContentResult ReporteTopCharlasVendidas()
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_TopCharlasVendidas();");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);
        }

        public ContentResult ReporteDeVentas(string pFechaInicio, string pFechaFin)
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_ReporteVentas('" + pFechaInicio + "' , '" + pFechaFin + "');");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);
        }

        public ContentResult ReporteGanancias(string pMes, string pAnno)
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_ReporteGananciaCharlista('" + pMes + "' , '" + pAnno + "');");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);
        }

        /************************************************************** TXT y CSV **************************************************************/

        public int txtCantUsuarios(string pFechaInicio, string pFechaFin, int pIdRol, int archivo)
        {
            try
            {
                DataTable ds = new DataTable();
                if (archivo == 1)
                {
                    ds = conDB.SP_SELECTS(ds, "Call sp_ReporteCantUsuarios('" + pFechaInicio + "' , '" + pFechaFin + "', " + pIdRol + ");");
                    string JsonResult = JsonConvert.SerializeObject(ds);
                    StreamWriter swExtLogFile = new StreamWriter("C:/Users/andre/Desktop/ReporteCantUsuarios.txt", true);
                    int i;

                    swExtLogFile.Write(Environment.NewLine);
                    swExtLogFile.Write("Cantidad de Usuarios | Fecha de Registro");
                    swExtLogFile.Write(Environment.NewLine);

                    foreach (DataRow row in ds.Rows)
                    {
                        object[] array = row.ItemArray;
                        for (i = 0; i < array.Length - 1; i++)
                        {
                            swExtLogFile.Write(array[i].ToString() + " | ");
                        }
                        swExtLogFile.WriteLine(array[i].ToString());
                    }
                    if (pIdRol == 2)
                    {
                        swExtLogFile.Write("***** Final de los datos de la cantidad de Charlistas registrados *****");
                        swExtLogFile.Write("***** Entre: " + pFechaInicio + " y " + pFechaFin + " *****");
                        swExtLogFile.Write("***** Estos datos fueron descargados en la fecha: " + DateTime.Now.ToString() + " *****");
                    }
                    else if (pIdRol == 3)
                    {
                        swExtLogFile.Write("***** Final de los datos de la cantidad de clientes registrados *****");
                        swExtLogFile.Write("***** Entre: " + pFechaInicio + " y " + pFechaFin + " *****");
                        swExtLogFile.Write("***** Estos datos fueron descargados en la fecha: " + DateTime.Now.ToString() + " *****");
                    }

                    swExtLogFile.Flush();
                    swExtLogFile.Close();
                }
                else if (archivo == 2)
                {
                    ds = conDB.SP_SELECTS(ds, "Call sp_ReporteCantUsuarios('" + pFechaInicio + "' , '" + pFechaFin + "', " + pIdRol + ");");
                    string JsonResult = JsonConvert.SerializeObject(ds);
                    StreamWriter swExtLogFile = new StreamWriter("C:/Users/andre/Desktop/ReporteCantUsuarios.csv", true);
                    int i;

                    swExtLogFile.Write(Environment.NewLine);
                    swExtLogFile.Write("Cantidad de Usuarios , Fecha de Registro");
                    swExtLogFile.Write(Environment.NewLine);

                    foreach (DataRow row in ds.Rows)
                    {
                        object[] array = row.ItemArray;
                        for (i = 0; i < array.Length - 1; i++)
                        {
                            swExtLogFile.Write(array[i].ToString() + " , ");
                        }
                        swExtLogFile.WriteLine(array[i].ToString());
                    }
                    if (pIdRol == 2)
                    {
                        swExtLogFile.Write("***** Final de los datos de la cantidad de Charlistas registrados *****");
                        swExtLogFile.Write("***** Entre: " + pFechaInicio + " y " + pFechaFin + " *****");
                        swExtLogFile.Write("***** Estos datos fueron descargados en la fecha: " + DateTime.Now.ToString() + " *****");
                    }
                    else if (pIdRol == 3)
                    {
                        swExtLogFile.Write("***** Final de los datos de la cantidad de clientes registrados *****");
                        swExtLogFile.Write("***** Entre: " + pFechaInicio + " y " + pFechaFin + " *****");
                        swExtLogFile.Write("***** Estos datos fueron descargados en la fecha: " + DateTime.Now.ToString() + " *****");
                    }

                    swExtLogFile.Flush();
                    swExtLogFile.Close();

                }
                return 1;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return 0;
            }
        }

        public int txtCantCharlas(string pFechaInicio, string pFechaFin, int archivo)
        {

            try
            {
                DataTable ds = new DataTable();
                if (archivo == 1)
                {
                    ds = conDB.SP_SELECTS(ds, "Call sp_ReporteCantCharlas('" + pFechaInicio + "' , '" + pFechaFin + "');");
                    string JsonResult = JsonConvert.SerializeObject(ds);
                    StreamWriter swExtLogFile = new StreamWriter("C:/Users/andre/Desktop/ReporteCantCharlas.txt", true);
                    int i;
                    swExtLogFile.Write(Environment.NewLine);
                    swExtLogFile.Write("Cantegoria | Cantidad de Charlas");
                    swExtLogFile.Write(Environment.NewLine);
                    foreach (DataRow row in ds.Rows)
                    {
                        object[] array = row.ItemArray;
                        for (i = 0; i < array.Length - 1; i++)
                        {
                            swExtLogFile.Write(array[i].ToString() + " | ");
                        }
                        swExtLogFile.WriteLine(array[i].ToString());
                    }
                    swExtLogFile.Write("***** Final de los datos de la cantidad de charlas registradas *****");
                    swExtLogFile.Write("***** Entre: " + pFechaInicio + " y " + pFechaFin + " *****");
                    swExtLogFile.Write("***** Estos datos fueron descargados en la fecha: " + DateTime.Now.ToString() + " *****"); swExtLogFile.Flush();
                    swExtLogFile.Close();
                }
                else if (archivo == 2)
                {
                    ds = conDB.SP_SELECTS(ds, "Call sp_ReporteCantCharlas('" + pFechaInicio + "' , '" + pFechaFin + "');");
                    string JsonResult = JsonConvert.SerializeObject(ds);
                    StreamWriter swExtLogFile = new StreamWriter("C:/Users/andre/Desktop/ReporteCantCharlas.csv", true);
                    int i;
                    swExtLogFile.Write(Environment.NewLine);
                    swExtLogFile.Write("Cantegoria , Cantidad de Charlas");
                    swExtLogFile.Write(Environment.NewLine);
                    foreach (DataRow row in ds.Rows)
                    {
                        object[] array = row.ItemArray;
                        for (i = 0; i < array.Length - 1; i++)
                        {
                            swExtLogFile.Write(array[i].ToString() + ",");
                        }
                        swExtLogFile.WriteLine(array[i].ToString());
                    }
                    swExtLogFile.Write("***** Final de los datos de la cantidad de charlas registradas *****");
                    swExtLogFile.Write("***** Entre: " + pFechaInicio + " y " + pFechaFin + " *****");
                    swExtLogFile.Write("***** Estos datos fueron descargados en la fecha: " + DateTime.Now.ToString() + " *****");
                    swExtLogFile.Flush();
                    swExtLogFile.Close();
                }
                return 1;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return 0;
            }
        }

        public int txtToCharlas(int archivo)
        {

            try
            {
                DataTable ds = new DataTable();

                ds = conDB.SP_SELECTS(ds, "Call sp_ReporteTopCharlas();");
                if (archivo == 1)
                {
                    StreamWriter swExtLogFile = new StreamWriter("C:/Users/andre/Desktop/ReporteTopCharlas.txt", true);
                    swExtLogFile.Write(Environment.NewLine);
                    swExtLogFile.Write("Charla | Valoracion (0-5)");
                    swExtLogFile.Write(Environment.NewLine);
                    int i;
                    foreach (DataRow row in ds.Rows)
                    {
                        object[] array = row.ItemArray;
                        for (i = 0; i < array.Length - 1; i++)
                        {
                            swExtLogFile.Write(array[i].ToString() + " | ");
                        }
                        swExtLogFile.WriteLine(array[i].ToString());
                    }
                    swExtLogFile.Write("***** Final de los datos del top de charlas, esta informacion fue descargada en la fecha: " + DateTime.Now.ToString() + " *****");
                    swExtLogFile.Flush();
                    swExtLogFile.Close();
                }
                else if (archivo == 2)
                {
                    StreamWriter swExtLogFile = new StreamWriter("C:/Users/andre/Desktop/ReporteTopCharlas.csv", true);
                    swExtLogFile.Write(Environment.NewLine);
                    swExtLogFile.Write("Charla , Valoracion (0-5)");
                    swExtLogFile.Write(Environment.NewLine);

                    int i;
                    foreach (DataRow row in ds.Rows)
                    {
                        object[] array = row.ItemArray;
                        for (i = 0; i < array.Length - 1; i++)
                        {
                            swExtLogFile.Write(array[i].ToString() + " , ");
                        }
                        swExtLogFile.WriteLine(array[i].ToString());
                    }
                    swExtLogFile.Write("***** Final de los datos del top de charlas, esta informacion fue descargada en la fecha: " + DateTime.Now.ToString() + " *****");
                    swExtLogFile.Flush();
                    swExtLogFile.Close();
                }
                return 1;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return 0;
            }

        }

        public int txtTopCharlistas(int archivo)
        {
            try
            {
                DataTable ds = new DataTable();
                if (archivo == 1)
                {
                    ds = conDB.SP_SELECTS(ds, "Call sp_ReporteTopCharlistas();");

                    StreamWriter swExtLogFile = new StreamWriter("C:/Users/andre/Desktop/ReporteTopCharlistas.txt", true);
                    int i;

                    swExtLogFile.Write(Environment.NewLine);
                    swExtLogFile.Write("Nombre | Apellidos | Valoracion (0 - 5)");
                    swExtLogFile.Write(Environment.NewLine);

                    foreach (DataRow row in ds.Rows)
                    {
                        object[] array = row.ItemArray;
                        for (i = 0; i < array.Length - 1; i++)
                        {
                            swExtLogFile.Write(array[i].ToString() + " | ");
                        }
                        swExtLogFile.WriteLine(array[i].ToString());
                    }
                    swExtLogFile.Write("***** Final de los datos del top de charlistas, esta informacion fue descargada en la fecha: " + DateTime.Now.ToString() + " *****");
                    swExtLogFile.Flush();
                    swExtLogFile.Close();
                }
                else if (archivo == 2)
                {
                    ds = conDB.SP_SELECTS(ds, "Call sp_ReporteTopCharlistas();");

                    StreamWriter swExtLogFile = new StreamWriter("C:/Users/andre/Desktop/ReporteTopCharlistas.csv", true);
                    int i;

                    swExtLogFile.Write(Environment.NewLine);
                    swExtLogFile.Write("Nombre , Apellidos , Valoracion (0 - 5)");
                    swExtLogFile.Write(Environment.NewLine);

                    foreach (DataRow row in ds.Rows)
                    {
                        object[] array = row.ItemArray;
                        for (i = 0; i < array.Length - 1; i++)
                        {
                            swExtLogFile.Write(array[i].ToString() + " , ");
                        }
                        swExtLogFile.WriteLine(array[i].ToString());
                    }
                    swExtLogFile.Write("***** Final de los datos del top de charlistas, esta informacion fue descargada en la fecha: " + DateTime.Now.ToString() + " *****");
                    swExtLogFile.Flush();
                    swExtLogFile.Close();
                }
                return 1;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return 0;
            }
        }

        public int txtTopCharlasVendidas(int archivo)
        {
            try
            {
                DataTable ds = new DataTable();
                if (archivo == 1)
                {
                    ds = conDB.SP_SELECTS(ds, "Call sp_TopCharlasVendidas();");

                    StreamWriter swExtLogFile = new StreamWriter("C:/Users/andre/Desktop/TopCharlasVendidas.txt", true);
                    int i;
                    swExtLogFile.Write(Environment.NewLine);
                    swExtLogFile.Write("Cantidad de Ventas | Charla");
                    swExtLogFile.Write(Environment.NewLine);

                    foreach (DataRow row in ds.Rows)
                    {
                        object[] array = row.ItemArray;
                        for (i = 0; i < array.Length - 1; i++)
                        {
                            swExtLogFile.Write(array[i].ToString() + " | ");
                        }
                        swExtLogFile.WriteLine(array[i].ToString());
                    }
                    swExtLogFile.Write("***** Final de los datos del top charlas mas vendidas, esta informacion fue descargada en la fecha: " + DateTime.Now.ToString() + " *****");
                    swExtLogFile.Flush();
                    swExtLogFile.Close();
                }
                else if (archivo == 2)
                {
                    ds = conDB.SP_SELECTS(ds, "Call sp_TopCharlasVendidas();");

                    StreamWriter swExtLogFile = new StreamWriter("C:/Users/andre/Desktop/TopCharlasVendidas.csv", true);
                    int i;
                    swExtLogFile.Write(Environment.NewLine);
                    swExtLogFile.Write("Cantidad de Ventas , Charla");
                    swExtLogFile.Write(Environment.NewLine);

                    foreach (DataRow row in ds.Rows)
                    {
                        object[] array = row.ItemArray;
                        for (i = 0; i < array.Length - 1; i++)
                        {
                            swExtLogFile.Write(array[i].ToString() + " , ");
                        }
                        swExtLogFile.WriteLine(array[i].ToString());
                    }

                    swExtLogFile.Write("***** Final de los datos del top charlas mas vendidas, esta informacion fue descargada en la fecha: " + DateTime.Now.ToString() + " *****");
                    swExtLogFile.Flush();
                    swExtLogFile.Close();
                }
                return 1;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return 0;
            }
        }

        public int txtVentas(int archivo, string pFechaInicio, string pFechaFin)
        {
            try
            {
                DataTable ds = new DataTable();
                if (archivo == 1)
                {
                    ds = conDB.SP_SELECTS(ds, "Call sp_ReporteVentas('" + pFechaInicio + "' , '" + pFechaFin + "');");

                    StreamWriter swExtLogFile = new StreamWriter("C:/Users/andre/Desktop/Ventas.txt", true);
                    int i;
                    swExtLogFile.Write(Environment.NewLine);
                    swExtLogFile.Write("Total (colones) | Fecha");
                    swExtLogFile.Write(Environment.NewLine);

                    foreach (DataRow row in ds.Rows)
                    {
                        object[] array = row.ItemArray;
                        for (i = 0; i < array.Length - 1; i++)
                        {
                            swExtLogFile.Write(array[i].ToString() + " | ");
                        }
                        swExtLogFile.WriteLine(array[i].ToString());
                    }
                    swExtLogFile.Write("*****Final de los datos de ventas, esta informacion fue descargada en la fecha: " + DateTime.Now.ToString() + " *****");
                    swExtLogFile.Flush();
                    swExtLogFile.Close();
                }
                else if (archivo == 2)
                {
                    ds = conDB.SP_SELECTS(ds, "Call sp_ReporteVentas('" + pFechaInicio + "' , '" + pFechaFin + "');");

                    StreamWriter swExtLogFile = new StreamWriter("C:/Users/andre/Desktop/Ventas.csv", true);
                    int i;

                    swExtLogFile.Write(Environment.NewLine);
                    swExtLogFile.Write("Total(colones) , Fecha");
                    swExtLogFile.Write(Environment.NewLine);

                    foreach (DataRow row in ds.Rows)
                    {

                        object[] array = row.ItemArray;
                        for (i = 0; i < array.Length - 1; i++)
                        {
                            swExtLogFile.Write(array[i].ToString() + " , ");
                        }
                        swExtLogFile.WriteLine(array[i].ToString());
                    }
                    swExtLogFile.Write("***** Final de los datos de ventas, esta informacion fue descargada en la fecha: " + DateTime.Now.ToString() + " *****");
                    swExtLogFile.Flush();
                    swExtLogFile.Close();
                }
                return 1;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return 0;
            }
        }

        public int txtGananciasCharlista(int archivo, string pMes, string pAnno)
        {
            try
            {
                DataTable ds = new DataTable();
                if (archivo == 1)
                {
                    ds = conDB.SP_SELECTS(ds, "Call sp_ReporteGananciaCharlista(" + pMes + " , " + pAnno + ");");

                    StreamWriter swExtLogFile = new StreamWriter("C:/Users/andre/Desktop/GananciasCharlista.txt", true);
                    int i;
                    swExtLogFile.Write(Environment.NewLine);
                    swExtLogFile.Write("Ganancias (colones) | Charlista");
                    swExtLogFile.Write(Environment.NewLine);

                    foreach (DataRow row in ds.Rows)
                    {
                        object[] array = row.ItemArray;
                        for (i = 0; i < array.Length - 1; i++)
                        {
                            swExtLogFile.Write(array[i].ToString() + " | ");
                        }
                        swExtLogFile.WriteLine(array[i].ToString());
                    }
                    swExtLogFile.Write("***** Final de los datos de ganancias por charlista, esta informacion fue descargada en la fecha: " + DateTime.Now.ToString() + " *****");
                    swExtLogFile.Flush();
                    swExtLogFile.Close();
                }
                else if (archivo == 2)
                {
                    ds = conDB.SP_SELECTS(ds, "Call sp_ReporteGananciaCharlista('" + pMes + "' , '" + pAnno + "');");

                    StreamWriter swExtLogFile = new StreamWriter("C:/Users/andre/Desktop/GananciasCharlista.csv", true);
                    int i;

                    swExtLogFile.Write(Environment.NewLine);
                    swExtLogFile.Write("Ganancias (colones) , Charlista");
                    swExtLogFile.Write(Environment.NewLine);

                    foreach (DataRow row in ds.Rows)
                    {

                        object[] array = row.ItemArray;
                        for (i = 0; i < array.Length - 1; i++)
                        {
                            swExtLogFile.Write(array[i].ToString() + " , ");
                        }
                        swExtLogFile.WriteLine(array[i].ToString());
                    }
                    swExtLogFile.Write("***** Final de los datos de ganancias por charlista, esta informacion fue descargada en la fecha: " + DateTime.Now.ToString() + " *****");
                    swExtLogFile.Flush();
                    swExtLogFile.Close();
                }
                return 1;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return 0;
            }
        }
    }
}