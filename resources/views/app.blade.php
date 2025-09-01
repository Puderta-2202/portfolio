<!doctype html>
<html lang="id">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{{ env('APP_NAME', 'Portfolio') }}</title>
    @vite(['resources/css/app.css','resources/js/main.tsx'])
</head>

<body class="min-h-dvh bg-gray-50 text-gray-900">
    <div id="root"></div>
</body>

</html>