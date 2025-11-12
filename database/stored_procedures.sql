USE [StudentDB];
GO

CREATE OR ALTER PROCEDURE dbo.usp_CreateStudent
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @Email NVARCHAR(255) = NULL,
    @DateOfBirth DATETIME2 = NULL
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO dbo.Student (FirstName, LastName, Email, DateOfBirth)
    VALUES (@FirstName, @LastName, @Email, @DateOfBirth);
    SELECT SCOPE_IDENTITY() AS Id;
END
GO

CREATE OR ALTER PROCEDURE dbo.usp_GetStudents
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, FirstName, LastName, Email, DateOfBirth, CreatedAt FROM dbo.Student ORDER BY Id;
END
GO

CREATE OR ALTER PROCEDURE dbo.usp_GetStudentById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, FirstName, LastName, Email, DateOfBirth, CreatedAt FROM dbo.Student WHERE Id = @Id;
END
GO

CREATE OR ALTER PROCEDURE dbo.usp_UpdateStudent
    @Id INT,
    @FirstName NVARCHAR(100),
    @LastName NVARCHAR(100),
    @Email NVARCHAR(255) = NULL,
    @DateOfBirth DATETIME2 = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE dbo.Student
    SET FirstName = @FirstName,
        LastName = @LastName,
        Email = @Email,
        DateOfBirth = @DateOfBirth
    WHERE Id = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO

CREATE OR ALTER PROCEDURE dbo.usp_DeleteStudent
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM dbo.Student WHERE Id = @Id;
    SELECT @@ROWCOUNT AS RowsAffected;
END
GO
