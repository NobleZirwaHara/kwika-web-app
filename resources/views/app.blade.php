<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- Primary Meta Tags --}}
        <title inertia>{{ config('app.name', 'Kwika Events') }}</title>
        <meta name="title" content="Kwika Events - Find Perfect Event Service Providers in Malawi">
        <meta name="description" content="Discover and book top-rated event service providers in Malawi. From photographers and caterers to venues and decorators - find everything you need for your perfect event.">
        <meta name="keywords" content="events Malawi, wedding services, event planning, photographers Malawi, caterers Lilongwe, venues Blantyre, decorators, DJ services, event rentals, wedding planner Malawi">
        <meta name="author" content="Kwika Events">
        <meta name="robots" content="index, follow">
        <meta name="language" content="English">
        <meta name="revisit-after" content="7 days">

        {{-- Canonical URL --}}
        <link rel="canonical" href="{{ url()->current() }}">

        {{-- Open Graph / Facebook --}}
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" content="Kwika Events - Find Perfect Event Service Providers in Malawi">
        <meta property="og:description" content="Discover and book top-rated event service providers in Malawi. From photographers and caterers to venues and decorators - find everything you need for your perfect event.">
        <meta property="og:image" content="{{ asset('images/og-image.jpg') }}">
        <meta property="og:locale" content="en_MW">
        <meta property="og:site_name" content="Kwika Events">

        {{-- Twitter --}}
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="{{ url()->current() }}">
        <meta property="twitter:title" content="Kwika Events - Find Perfect Event Service Providers in Malawi">
        <meta property="twitter:description" content="Discover and book top-rated event service providers in Malawi. From photographers and caterers to venues and decorators - find everything you need for your perfect event.">
        <meta property="twitter:image" content="{{ asset('images/og-image.jpg') }}">

        {{-- Geo Tags for Malawi --}}
        <meta name="geo.region" content="MW">
        <meta name="geo.placename" content="Malawi">
        <meta name="geo.position" content="-13.9626;33.7741">
        <meta name="ICBM" content="-13.9626, 33.7741">

        {{-- Theme Color --}}
        <meta name="theme-color" content="#7c3aed">
        <meta name="msapplication-TileColor" content="#7c3aed">

        {{-- Favicon --}}
        <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
        <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('apple-touch-icon.png') }}">

        {{-- Fonts --}}
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700|plus-jakarta-sans:500,600,700,800&display=swap" rel="stylesheet" />

        {{-- Structured Data - Organization --}}
        <script type="application/ld+json">
        {
            "@@context": "https://schema.org",
            "@@type": "Organization",
            "name": "Kwika Events",
            "url": "{{ config('app.url') }}",
            "logo": "{{ asset('images/logo.png') }}",
            "description": "Kwika Events is Malawi's premier event service marketplace connecting customers with top-rated photographers, caterers, venues, decorators, and more.",
            "address": {
                "@@type": "PostalAddress",
                "addressLocality": "Lilongwe",
                "addressCountry": "MW"
            },
            "areaServed": {
                "@@type": "Country",
                "name": "Malawi"
            },
            "sameAs": []
        }
        </script>

        {{-- Structured Data - WebSite with SearchAction --}}
        <script type="application/ld+json">
        {
            "@@context": "https://schema.org",
            "@@type": "WebSite",
            "name": "Kwika Events",
            "url": "{{ config('app.url') }}",
            "potentialAction": {
                "@@type": "SearchAction",
                "target": "{{ config('app.url') }}/search?query={search_term_string}",
                "query-input": "required name=search_term_string"
            }
        }
        </script>

        {{-- Scripts --}}
        @routes
        @viteReactRefresh
        @vite(['resources/css/app.css','resources/css/globals.css', 'resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
