USE [StudentDB];
GO

-- Add DateOfBirth column if it does not exist (safe to run multiple times)
IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'dbo.Student') AND name = 'DateOfBirth'
)
BEGIN
    ALTER TABLE dbo.Student ADD DateOfBirth DATETIME2 NULL;
END
GO

-- Optionally remove Age column if present (commented out by default)
-- IF EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID(N'dbo.Student') AND name = 'Age')
-- BEGIN
--     ALTER TABLE dbo.Student DROP COLUMN Age;
-- END
-- GO
