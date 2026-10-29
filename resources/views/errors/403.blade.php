<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Access denied</title>
    <style>
        body { font-family: system-ui, sans-serif; display: flex; min-height: 100vh;
               align-items: center; justify-content: center; margin: 0; background: #f5f7f6; color: #1f2933; }
        .box { text-align: center; padding: 2rem; max-width: 24rem; }
        h1 { font-size: 3rem; margin: 0 0 .5rem; }
        a { color: #0f766e; }
    </style>
</head>
<body>
    <div class="box">
        <h1>403</h1>
        <p>{{ $exception->getMessage() ?: 'You do not have permission to access this page.' }}</p>
        <p><a href="{{ route('home') }}">Back to home</a></p>
    </div>
</body>
</html>