Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\apps\schedule"
WshShell.Run "cmd /c ""C:\apps\schedule\scripts\start-server.bat""", 0, False
