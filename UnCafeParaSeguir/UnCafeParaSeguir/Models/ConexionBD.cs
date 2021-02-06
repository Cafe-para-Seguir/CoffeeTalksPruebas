using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using MySql.Data.MySqlClient;

namespace UnCafeParaSeguir.Models
{
    public class ConexionBD
    {
        string connectionString = "Server=localhost;Port=3306;Database=uncafeparaseguir;Uid=root;password=1234;";

        public DataTable SP_SELECTS(DataTable dt, string query)
        {
            MySqlConnection conn = new MySqlConnection(connectionString);
            MySqlDataAdapter adapter = new MySqlDataAdapter();
            adapter.SelectCommand = new MySqlCommand(query, conn);
            adapter.Fill(dt);
            return dt;
        }

        public async Task<int> SP_EXECUTE(string NombreSP, Dictionary<string, object> parametros)
        {
            int result = -1;
            if (string.IsNullOrEmpty(NombreSP)) return result;
            MySqlConnection MyConn2 = new MySqlConnection(connectionString);
            {
                var command = MyConn2.CreateCommand();
                command.CommandText = NombreSP;
                command.CommandType = System.Data.CommandType.StoredProcedure;
                command.CommandTimeout = 100000;
                try
                {
                    foreach (var item in parametros)
                    {
                        var name = new MySqlParameter(item.Key, item.Value);
                        command.Parameters.Add(name);
                    }
                    MyConn2.Open();
                    var bar = await command.ExecuteScalarAsync();
                    result = Int32.Parse(bar.ToString());
                    MyConn2.Close();
                }
                catch (Exception ex)
                {
                    string e = ex.Message;
                    result = -10;
                    MyConn2.Close();

                }
            }
            return result;
        }

        public List<string> SP_SELECTSIS(List<string> Users, string query)
        {
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                conn.Open();

                MySqlCommand command = new MySqlCommand();
                command.Connection = conn;
                command.CommandText = query;

                using (var rd = command.ExecuteReader())
                {
                    while (rd.Read())
                    {
                        Users.Add(rd[0].ToString());
                        Users.Add(rd[1].ToString());
                        Users.Add(rd[2].ToString());
                        Users.Add(rd[3].ToString());

                    }
                }
            }
            return Users;
        }

    }
}
