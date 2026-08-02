# Configuración Google — New Life

El sitio ya incluye SEO técnico, `robots.txt`, sitemap, canonicals, datos estructurados, páginas legales, Consent Mode v2, gestión de cookies y eventos preparados. No se incluyeron identificadores ficticios.

## Activación pendiente en cuentas del negocio

1. Crear o confirmar cuentas propiedad de New Life para Google Tag Manager, Google Analytics 4 y Google Search Console. Dar acceso delegado a quien administre el sitio.
2. En Netlify, agregar `VITE_GTM_ID` con el contenedor real (formato `GTM-XXXXXXX`). Publicar nuevamente.
3. En GTM, crear la etiqueta de configuración de GA4 y verificar en Preview que sólo se dispare según el consentimiento elegido.
4. Configurar los eventos disponibles: `click_instagram`, `click_whatsapp`, `view_catalog` y `click_creator`. Los clics son intención de contacto, no un lead confirmado.
5. En Netlify, agregar `VITE_GOOGLE_SITE_VERIFICATION` con el valor entregado por Search Console. Volver a publicar, verificar `https://newlifegrowshop.netlify.app/` y enviar `/sitemap.xml`.
6. Definir un dominio propio y redirigir el subdominio de Netlify al dominio canónico si el negocio lo incorpora. Actualizar canonicals, sitemap y variables antes de publicarlo.
7. Si se evalúa Google Ads, revisar primero las políticas vigentes para productos relacionados con cannabis y validar cada producto, texto, segmentación y país. La preparación técnica no garantiza aprobación.

## No aplicable actualmente

- AdSense: el sitio es comercial/informativo y no un medio editorial monetizado con anuncios.
- Merchant Center: no existe compra directa con carrito y checkout. No deben publicarse feeds o `ads.txt` ficticios.
