-- Create StudentDB if it doesn't exist
IF NOT EXISTS (SELECT 1 FROM sys.databases WHERE name = N'StudentDB')
BEGIN
    CREATE DATABASE [StudentDB];
END
GO
