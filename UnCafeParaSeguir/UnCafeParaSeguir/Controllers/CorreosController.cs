using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MimeKit;
using MimeKit.Text;
using UnCafeParaSeguir.Models;

namespace UnCafeParaSeguir.Controllers
{
    public class CorreosController : Controller
    {

        public readonly ILogger<CorreosController> _logger;

        ConexionBD conDB = new ConexionBD();

        private const string salto = "\n";
        public string server = "mail.uncafeparaseguir.com";
        public int puertoServer = 465;
        public string correoSalida = "charlas@uncafeparaseguir.com";
        public string ContraCorreoSalida = ".KBDP;.8)3-+";

        public CorreosController(ILogger<CorreosController> logger)
        {
            _logger = logger;
        }
        public IActionResult Index()
        {
            return View();
        }

        public async Task<int> CrearCorreo(string correo, int tipoCodigo, string pModo, string sujeto, string contenido, string cierre)
        {
            String codigo = CrearCodigo();

            try
            {
                // create email message
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(correoSalida));
                email.To.Add(MailboxAddress.Parse(correo));
                email.Subject = sujeto;
                email.Body = new TextPart(TextFormat.Plain) { Text = contenido + " " + codigo + " " + cierre };

                // send email
                using var smtp = new SmtpClient();
                smtp.Connect(server, 465, true);
                smtp.Authenticate(correoSalida, ContraCorreoSalida);
                smtp.Send(email);
                smtp.Disconnect(true);

                await MantCodigoUsuario(correo, codigo, tipoCodigo, pModo);

                return 1;
            }
            catch (Exception e)
            {
                Console.WriteLine("** ERROR: " + e.ToString());
                return 2;
            }
        }

        public int EnviarCorreoUsuarios(string CorreoDestino, string AsuntoCorreo, string CuerpoCorreo)
        {
            try
            {
                // crear correo
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(correoSalida));
                email.To.Add(MailboxAddress.Parse(CorreoDestino));
                email.Subject = AsuntoCorreo;
                email.Body = new TextPart(TextFormat.Plain) { Text = CuerpoCorreo };

                // Conectar con el servidor de correos
                using var smtp = new SmtpClient();
                smtp.Connect(server, puertoServer, true);
                smtp.Authenticate(correoSalida, ContraCorreoSalida);
                smtp.Send(email);
                smtp.Disconnect(true);
                Console.WriteLine("********************************* Correcto: ");
                return 1;

            }
            catch (Exception e)
            {
                Console.WriteLine("********************************* ERROR: " + e.ToString());
                return 0;
            }
        }

        public int CorreoContacto(string NomUsuario, string CorreoUsuario, string AsuntoCorreo, string MensajeCorreo)
        {
            try
            {
                // crear correo
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(correoSalida));
                email.To.Add(MailboxAddress.Parse(correoSalida));
                email.Subject = "Coffe Talks | " + AsuntoCorreo;
                email.Body = new TextPart(TextFormat.Plain) { Text = NomUsuario + salto + CorreoUsuario + salto + MensajeCorreo };

                // Conectar con el servidor de correos
                using var smtp = new SmtpClient();
                smtp.Connect(server, puertoServer, true);
                smtp.Authenticate(correoSalida, ContraCorreoSalida);
                smtp.Send(email);
                smtp.Disconnect(true);
                return 1;

            }
            catch (Exception e)
            {
                Console.WriteLine("********************************* ERROR: " + e.ToString());
                return 0;
            }
        }

        public async Task<int> MantCodigoUsuario(string correo, string codigo, int tipoCodigo, string pModo)
        {

            int query = await conDB.SP_EXECUTE("sp_MantCodigoUsuario",
                new Dictionary<string, object>()
                {
                    { "@pCorreoUsuario", correo },
                    { "@pCodigo", codigo },
                    { "@pTipoCodigo", tipoCodigo },
                    { "@pModo", pModo }
                }
            );
            return query;
        }

        public async Task<int> VerificaCodigoCorreo(string correoVerificacion, string codigoVerificacion, int tipoCodigo)
        {

            int query = await conDB.SP_EXECUTE("sp_VerificaCodigoCorreo",
                new Dictionary<string, object>()
                {
                    { "@pCorreoUsuario", correoVerificacion },
                    { "@pCodigo", codigoVerificacion },
                    { "@pTipoCodigo", tipoCodigo }
                }
            );
            return query;
        }

        public async Task<int> VerificaCodigoContra(string correoVerificacion, string codigoVerificacion, int tipoCodigo)
        {

            int query = await conDB.SP_EXECUTE("sp_VerificaCodigoContra",
                new Dictionary<string, object>()
                {
                    { "@pCorreoUsuario", correoVerificacion },
                    { "@pCodigo", codigoVerificacion },
                    { "@pTipoCodigo", tipoCodigo }
                }
            );
            return query;
        }

        public async Task<int> VerificaCorreo_CodigoUsuario(string correoVerificacion)
        {

            int query = await conDB.SP_EXECUTE("sp_VerificaCorreo_CodigoUsuario",
                new Dictionary<string, object>()
                {
                    { "@pCorreoUsuario", correoVerificacion }
                }
            );
            return query;
        }

        public string CrearCodigo()
        {
            Random ran = new Random();

            String b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            int length = 8;

            String random = "";

            for (int i = 0; i < length; i++)
            {
                int a = ran.Next(b.Length); //string.Lenght gets the size of string
                random = random + b.ElementAt(a);
            }

            return (random);

        }

        public async Task<int> VerificaCorreo_Usuario(string correoVerificacion)
        {

            int query = await conDB.SP_EXECUTE("sp_VerificaCorreo_tbUsuario",
                new Dictionary<string, object>()
                {
                    { "@pCorreoUsuario", correoVerificacion }
                }
            );
            return query;
        }

        public async Task<int> CrearCorreoNotificacion(string correo, string sujeto, string contenido)
        {
            try
            {
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(correoSalida));
                email.To.Add(MailboxAddress.Parse(correo));
                email.Subject = sujeto;
                email.Body = new TextPart(TextFormat.Plain) { Text = contenido };

                using var smtp = new SmtpClient();
                smtp.Connect(server, 465, true);
                smtp.Authenticate(correoSalida, ContraCorreoSalida);
                smtp.Send(email);
                smtp.Disconnect(true);

                await Task.Delay(10);

                return 1;
            }
            catch (Exception e)
            {
                Console.WriteLine("** ERROR: " + e.ToString());
                return 2;
            }
        }

        public async Task<int> NotifCharlasNuevas()
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_CorreosNotificacionActivado();");
            try
            {
                for (int x = 0; x < ds.Rows.Count; x++)
                {
                    string CorreoDestino;
                    DataRow correo_Usuario = ds.Rows[x];
                    CorreoDestino = correo_Usuario["correoUsuario"].ToString();

                    await CrearCorreoNotificacion(CorreoDestino, "Coffee Talks", "charla nueva registrada");
                }
                return 1;

            }
            catch (Exception ex)
            {
                return 2;
            }

        }

        public int EnviarFactura(string CorreoDestino, string archivo)
        {
            try
            {
                // crear correo
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(correoSalida));
                email.To.Add(MailboxAddress.Parse(CorreoDestino));
                email.Subject = "Comprobante de compra";
                var Body = new TextPart(TextFormat.Plain) { Text = "Gracias por su compra" };

                var builder = new BodyBuilder();

                // We may also want to attach a calendar event for Monica's party...
                //builder.Attachments.Add(archivo);

                var multipart = new Multipart("mixed");
                multipart.Add(Body);
                multipart.Add(builder.Attachments.Add(archivo));

                //email.Body = builder.ToMessageBody();
                email.Body = multipart;

                // Conectar con el servidor de correos
                using var smtp = new SmtpClient();
                smtp.Connect(server, puertoServer, true);
                smtp.Authenticate(correoSalida, ContraCorreoSalida);
                smtp.Send(email);
                smtp.Disconnect(true);
                Console.WriteLine("********************************* Correcto: ");
                return 1;

            }
            catch (Exception e)
            {
                Console.WriteLine("********************************* ERROR: " + e.ToString());
                return 0;
            }
        }
    }
}