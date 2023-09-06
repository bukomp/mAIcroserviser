Get-ChildItem -Path .\ -Recurse | Where-Object { $_.FullName -notmatch 'node_modules' } | ForEach-Object { "$($_.FullName)" }