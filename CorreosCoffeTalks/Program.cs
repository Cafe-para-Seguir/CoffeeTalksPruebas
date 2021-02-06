using System;
using System.Data;
using MailKit.Net.Smtp;
using MimeKit;
using MimeKit.Text;
using UnCafeParaSeguir.Controllers;
using UnCafeParaSeguir.Models;
using Microsoft.Extensions.Logging;


namespace CorreosCoffeTalks
{
    class Program
    {

        static ConexionBD db = new ConexionBD();

        private static readonly ILogger<CorreosController> _Clogger;

        public static void ActividadForo()
        {
            try
            {
                DataTable ds = new DataTable();
                ds = db.SP_SELECTS(ds, "Call sp_ActividadForo();");

                if (ds.Rows.Count > 0)
                {
                    for (int i = 0; i < ds.Rows.Count; i++)
                    {
                        DataRow dataRow = ds.Rows[i];

                        Console.WriteLine(dataRow["nombreCharla"]);
                        Console.WriteLine(dataRow["correoUsuario"]);

                        Console.WriteLine("");

                        EnviarCorreoUsuarios((string)dataRow["correoUsuario"], "Asunto Prueba Automatica", "Texto Correo");
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("********************************* ERROR: " + e.ToString());
            }
        }

        public static int EnviarCorreoUsuarios(string CorreoDestino, string AsuntoCorreo, string CuerpoCorreo)
        {
            try
            {

                CorreosController correos = new CorreosController(_Clogger);

                // crear correo
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(correos.correoSalida));
                email.To.Add(MailboxAddress.Parse(CorreoDestino));
                email.Subject = AsuntoCorreo;
                email.Body = new TextPart(TextFormat.Plain) { Text = CuerpoCorreo };

                // Conectar con el servidor de correos
                using var smtp = new SmtpClient();
                smtp.Connect(correos.server, correos.puertoServer, true);
                smtp.Authenticate(correos.correoSalida, correos.ContraCorreoSalida);
                smtp.Send(email);
                smtp.Disconnect(true);

                Console.WriteLine("********************************* Correcto: Correo enviado");
                return 1;

            }
            catch (Exception e)
            {
                Console.WriteLine("********************************* ERROR: " + e.ToString());
                return 0;
            }
        }

        static void Main(string[] args)
        {
            ActividadForo();
        }
    }
}