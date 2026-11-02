Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\apps\actions-runner-schedule"
WshShell.Run "cmd /c ""C:\apps\schedule\scripts\start-runner.bat""", 0, False
