using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Threading.Tasks;
using gpayments;
using gpayments.Model;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using UnCafeParaSeguir.Models;

namespace UnCafeParaSeguir.Controllers
{
    public class PagosController : Controller
    {
        ConexionBD conDB = new ConexionBD();

        private readonly ILogger<PagosController> _logger;
        private readonly ILogger<CorreosController> _Clogger;

        private const string colones = "crc";
        private const string UnCafeParaSeguir = "UN CAFÉ PARA SEGUIR";
        private const string CompraDeCharla = "COMPRA DE CHARLA";
        // Ruta de la imagen
        string imageURL = @"C:\Users\andre\Source\Repos\UnCafeParaSeguir\UnCafeParaSeguir\wwwroot\images\recursos\logo.png";
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult CompraCharla()
        {
            return View();
        }

        public PagosController(ILogger<PagosController> logger)
        {
            _logger = logger;
        }

        public ContentResult validaCreedenciales(int iccs, string txtgpCardNumero, int txtgpExpirationMonth, int txtgpExpirationYear, string txtgpCardCVC)
        {
            FourGeeksPayments api = new FourGeeksPayments();
            DataTable ds = new DataTable();
            ds = conDB.SP_SELECTS(ds, "Call sp_CargarPrecioCharla(" + iccs + ") ");

            if (ds.Rows.Count > 0)
            {
                DataRow info_Precio = ds.Rows[0];
                int precioCharla = Convert.ToInt32(info_Precio["precioCharla"]);
                Me me = api.GetMyDevInfo();
                Me newMe = api.UpdateMyDevInfo(me);

                SimpleCharge sp = new SimpleCharge();

                sp.Amount = precioCharla;
                sp.Description = CompraDeCharla;
                sp.EntityDescription = UnCafeParaSeguir;
                sp.Currency = colones;
                sp.CreditCardNumber = txtgpCardNumero;
                sp.CVC = txtgpCardCVC;
                sp.ExpirationMonth = txtgpExpirationMonth;
                sp.ExpirationYear = txtgpExpirationYear;

                var resPago = api.CreateSimpleCharge(sp);

                return Content("" + resPago);
            }
            else
            {
                return Content("SinPrecio");
            }
        }

        public async Task<int> RealizarCompra(int pvsU, int pvsCh, int ptT, string txtgpNombre, string txtgpApellido, int iccs)
        {
            int precioCharla = 0;
            string tipoTarjeta = "";

            int query = await conDB.SP_EXECUTE("sp_RealizarCompra",
                new Dictionary<string, object>()
                {
                    { "@pIdUsuario", pvsU },
                    { "@pIdCharla", pvsCh },
                }
            );

            DataTable dsP = new DataTable();
            dsP = conDB.SP_SELECTS(dsP, "Call sp_CargarPrecioCharla(" + iccs + ") ");

            if (dsP.Rows.Count > 0)
            {
                DataRow info_Precio = dsP.Rows[0];
                precioCharla = Convert.ToInt32(info_Precio["precioCharla"]);
            }
            if (ptT == 1)
            {
                tipoTarjeta = "Visa";
            }
            else if (ptT == 2)
            {
                tipoTarjeta = "Master Card";
            }
            else
            {
                tipoTarjeta = "Indefinida";
            }

            ObtenerDatos(precioCharla.ToString(), tipoTarjeta, pvsCh, pvsU, txtgpNombre, txtgpApellido);

            return query;
        }

        public void ObtenerDatos(string precioCharla, string tipoTarjeta, int idCharla, int idUsu, string nomUsuario, string apeUsuario)
        {

            string correo = "", nombreCharla = "", descripCharla = "", idFactura = "";

            try
            {
                DataTable ds = new DataTable();
                ds = conDB.SP_SELECTS(ds, "Call sp_MostrarUsuarioFiltrado(" + idUsu + ")");

                if (ds.Rows.Count > 0)
                {
                    DataRow info_Usuario = ds.Rows[0];
                    correo = (string)info_Usuario["correoUsuario"];
                }

                DataTable dsCharla = new DataTable();
                dsCharla = conDB.SP_SELECTS(dsCharla, "Call sp_MostrarCharlaFiltrada(" + idCharla + ")");

                if (dsCharla.Rows.Count > 0)
                {
                    DataRow info_Charla = dsCharla.Rows[0];
                    nombreCharla = (string)info_Charla["nombreCharla"];
                    descripCharla = (string)info_Charla["descripcionCharla"];
                }

                DataTable dsFactura = new DataTable();
                dsFactura = conDB.SP_SELECTS(dsFactura, "Call sp_CargarIdCompra(" + idUsu + "," + idCharla + ");");
                if (dsFactura.Rows.Count > 0)
                {
                    DataRow info_Factura = dsFactura.Rows[0];
                    idFactura = info_Factura["idCharlaUsuario"].ToString();
                }

                GeneraraFactura(nomUsuario, apeUsuario, correo, nombreCharla, descripCharla, precioCharla, tipoTarjeta, idFactura);
            }
            catch (Exception e)
            {
                Console.WriteLine("--------------------------------------------------------------------------- " + e);
            }
        }

        public void GeneraraFactura(string nombre, string apellido, string correo, string nombreCharla, string descripCharla, string precioCharla, string tipoTarjeta, string idFactura)
        {
            try
            {
                // Se crea el documento
                Document doc = new Document(PageSize.LETTER);

                string file = @"C:\Users\andre\Desktop\Comprobante_" + idFactura + ".pdf";

                // Ruta donde se va a guardar el documento
                PdfWriter writer = PdfWriter.GetInstance(doc, new FileStream(file, FileMode.Create));

                

                // Se crea objeto de tipo imagen
                iTextSharp.text.Image jpg = iTextSharp.text.Image.GetInstance(imageURL);

                jpg.Alignment = Image.TEXTWRAP | Image.ALIGN_RIGHT;

                // Resize image
                jpg.ScaleToFit(100f, 120f);

                // Posicion de la imagen
                jpg.SetAbsolutePosition(doc.PageSize.Width - 50f - 72f, doc.PageSize.Height - -90f - 216.6f);

                // Título y autor
                // **Nota: Esto no será visible en el documento
                doc.AddTitle("Comprobante de Compra");
                doc.AddCreator("Coffee Talks");

                // Abrir el archivo
                doc.Open();

                // Se configura el texto
                iTextSharp.text.Font _standardFont = new iTextSharp.text.Font(iTextSharp.text.Font.FontFamily.HELVETICA,
                                                                              10, iTextSharp.text.Font.NORMAL, BaseColor.BLACK);
                // Encabezado del documento
                #region
                doc.Add(new Paragraph("Comprobante de Compra"));
                doc.Add(Chunk.NEWLINE);

                doc.Add(jpg);

                doc.Add(new Phrase("www.coffeetalks.com", _standardFont));
                doc.Add(Chunk.NEWLINE);

                doc.Add(new Phrase("Email: coffeetalks@uncafeparaseguir.com", _standardFont));
                doc.Add(Chunk.NEWLINE);

                doc.Add(new Phrase("Fecha: " + DateTime.Today.ToString("D"), _standardFont));
                doc.Add(Chunk.NEWLINE);

                doc.Add(new Phrase("Comprobante No. " + idFactura, _standardFont));
                doc.Add(Chunk.NEWLINE);
                #endregion

                doc.Add(Chunk.NEWLINE);
                doc.Add(Chunk.NEWLINE);

                // TABLA CLIENTE
                #region
                doc.Add(new Phrase("Información del cliente"));

                // Creamos una tabla que contendrá el nombre, apellido y país
                // de nuestros visitante.
                PdfPTable tblCliente = new PdfPTable(3);
                tblCliente.WidthPercentage = 100;

                // Configuramos el título de las columnas de la tabla
                PdfPCell clNombre = new PdfPCell(new Phrase("Nombre", _standardFont));
                clNombre.BorderWidth = 0;
                clNombre.BorderWidthBottom = 0.75f;

                PdfPCell clApellido = new PdfPCell(new Phrase("Apellido", _standardFont));
                clApellido.BorderWidth = 0;
                clApellido.BorderWidthBottom = 0.75f;

                PdfPCell clCorreo = new PdfPCell(new Phrase("Correo", _standardFont));
                clCorreo.BorderWidth = 0;
                clCorreo.BorderWidthBottom = 0.75f;

                // Añadimos las celdas a la tabla
                tblCliente.AddCell(clNombre);
                tblCliente.AddCell(clApellido);
                tblCliente.AddCell(clCorreo);

                // Llenamos la tabla con información
                clNombre = new PdfPCell(new Phrase(nombre, _standardFont));
                clNombre.BorderWidth = 0;

                clApellido = new PdfPCell(new Phrase(apellido, _standardFont));
                clApellido.BorderWidth = 0;

                clCorreo = new PdfPCell(new Phrase(correo, _standardFont));
                clCorreo.BorderWidth = 0;

                // Añadimos las celdas a la tabla
                tblCliente.AddCell(clNombre);
                tblCliente.AddCell(clApellido);
                tblCliente.AddCell(clCorreo);

                doc.Add(tblCliente);

                #endregion

                doc.Add(Chunk.NEWLINE);
                doc.Add(Chunk.NEWLINE);

                // TABLA CHARLA
                #region
                doc.Add(new Phrase("Información de la compra"));

                // Creamos una tabla que contendrá el nombre, apellido y país
                // de nuestros visitante.
                PdfPTable tblCharla = new PdfPTable(3);
                tblCharla.WidthPercentage = 100;

                // Configuramos el título de las columnas de la tabla
                PdfPCell clCharla = new PdfPCell(new Phrase("Charla", _standardFont));
                clCharla.BorderWidth = 0;
                clCharla.BorderWidthBottom = 0.75f;

                PdfPCell clDescrip = new PdfPCell(new Phrase("Descripción", _standardFont));
                clDescrip.BorderWidth = 0;
                clDescrip.BorderWidthBottom = 0.75f;

                PdfPCell clPrecio = new PdfPCell(new Phrase("Precio (colones)", _standardFont));
                clPrecio.BorderWidth = 0;
                clPrecio.BorderWidthBottom = 0.75f;

                // Añadimos las celdas a la tabla
                tblCharla.AddCell(clCharla);
                tblCharla.AddCell(clDescrip);
                tblCharla.AddCell(clPrecio);

                // Llenamos la tabla con información
                clCharla = new PdfPCell(new Phrase(nombreCharla, _standardFont));
                clCharla.BorderWidth = 0;

                clDescrip = new PdfPCell(new Phrase(descripCharla, _standardFont));
                clDescrip.BorderWidth = 0;

                clPrecio = new PdfPCell(new Phrase(precioCharla, _standardFont));
                clPrecio.BorderWidth = 0;

                // Añadimos las celdas a la tabla
                tblCharla.AddCell(clCharla);
                tblCharla.AddCell(clDescrip);
                tblCharla.AddCell(clPrecio);

                doc.Add(tblCharla);

                #endregion

                doc.Add(Chunk.NEWLINE);
                doc.Add(Chunk.NEWLINE);

                // TABLA TARJETA
                #region

                // Creamos una tabla que contendrá el nombre, apellido y país
                // de nuestros visitante.
                PdfPTable tblTarjeta = new PdfPTable(2);
                tblTarjeta.WidthPercentage = 100;

                // Configuramos el título de las columnas de la tabla
                PdfPCell clTarjeta = new PdfPCell(new Phrase("Tarjeta", _standardFont));
                clTarjeta.BorderWidth = 0;
                clTarjeta.BorderWidthBottom = 0.75f;

                PdfPCell clTipo = new PdfPCell(new Phrase(tipoTarjeta, _standardFont));
                clTipo.BorderWidth = 0;
                clTipo.BorderWidthBottom = 0.75f;

                // Añadimos las celdas a la tabla
                tblTarjeta.AddCell(clTarjeta);
                tblTarjeta.AddCell(clTipo);

                // Llenamos la tabla con información
                clTarjeta = new PdfPCell(new Phrase(" ", _standardFont));
                clTarjeta.BorderWidth = 0;

                clTipo = new PdfPCell(new Phrase(" ", _standardFont));
                clTipo.BorderWidth = 0;

                // Añadimos las celdas a la tabla
                tblTarjeta.AddCell(clTarjeta);
                tblTarjeta.AddCell(clTipo);

                doc.Add(tblTarjeta);

                #endregion

                doc.Add(Chunk.NEWLINE);
                doc.Add(Chunk.NEWLINE);

                Paragraph p = new Paragraph("***** ULTIMA LINEA *****");
                p.Alignment = Element.ALIGN_CENTER;
                doc.Add(p);
                doc.Add(Chunk.NEWLINE);

                doc.Close();
                writer.Close();

                CorreosController email = new CorreosController(_Clogger);
                email.EnviarFactura(correo, file);
            }
            catch (Exception ex)
            {
                Console.WriteLine("-------------------------------------------------------------------------------------- " + ex);
            }
        }
    }
}