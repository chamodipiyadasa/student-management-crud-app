USE [StudentDB];
GO

-- Create Student table if it doesn't exist
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Student]') AND type in (N'U'))
BEGIN
CREATE TABLE dbo.Student
(
    Id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(255) NULL,
    -- Use DateOfBirth (nullable) for the student's birth date
    DateOfBirth DATETIME2 NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
END
GO
