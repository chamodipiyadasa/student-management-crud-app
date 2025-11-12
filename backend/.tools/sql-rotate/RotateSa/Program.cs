using System;
using Microsoft.Data.SqlClient;

class Program
{
    static int Main(string[] args)
    {
        if (args.Length < 1)
        {
            Console.Error.WriteLine("Usage: RotateSa <newPassword>");
            return 2;
        }

        var newPassword = args[0];
        var connStr = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");
        if (string.IsNullOrEmpty(connStr))
        {
            Console.Error.WriteLine("Please set ConnectionStrings__DefaultConnection env var (example: Server=127.0.0.1,1433;Database=master;User Id=sa;Password=OLD;TrustServerCertificate=True;)");
            return 2;
        }

        try
        {
            Console.WriteLine("Connecting with existing connection string to run ALTER LOGIN...");
            using (var conn = new SqlConnection(connStr))
            {
                conn.Open();
                using var cmd = conn.CreateCommand();
                // ALTER LOGIN does not accept parameters for the password value in all versions, so build the SQL string carefully
                cmd.CommandText = $"ALTER LOGIN sa WITH PASSWORD = '{newPassword}'";
                cmd.ExecuteNonQuery();
            }

            Console.WriteLine("Password changed. Now verifying by connecting with the new password...");
            var builder = new SqlConnectionStringBuilder(connStr) { Password = newPassword, InitialCatalog = "master" };
            using (var conn2 = new SqlConnection(builder.ConnectionString))
            {
                conn2.Open();
                using var cmd2 = conn2.CreateCommand();
                cmd2.CommandText = "SELECT @@VERSION;";
                var ver = cmd2.ExecuteScalar();
                Console.WriteLine("Verification query result: \n" + ver);
            }

            Console.WriteLine("Rotation and verification succeeded.");
            return 0;
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine("Error during rotation: " + ex);
            return 1;
        }
    }
}
