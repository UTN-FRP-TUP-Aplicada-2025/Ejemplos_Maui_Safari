# ReproBatch — repro mínimo de *"There was an error applying batch N"* (Blazor Interactive Server + Materialize/jQuery en WebKit/iOS)

App **Blazor Web App (Interactive Server)** mínima y autocontenida que reproduce de forma
**determinista** el error que mata el circuito en **WebKit** (Safari de escritorio / iOS / WKWebView)
y **no** en Chromium (Chrome / Edge / Android).

Sin login, sin base de datos, sin EF, sin MAUI, sin WebAssembly. Solo el mecanismo que aísla el bug.

## Causa raíz reproducida

JS de terceros (**Materialize + jQuery**) **muta/relocaliza** nodos del DOM que Blazor cree controlar,
**justo antes** de un re-render:

1. La Home renderiza con `isLoading = true`. Entre los nodos hay componentes Materialize
   **renderizados por Blazor** que existen desde el primer render: un `<ul class="sidenav">` y un `<select>`
   (más un `.modal`).
2. En `OnAfterRenderAsync(firstRender: true)` se importa `js/main.js` y se llama a `initTemplate()`, que
   corre `M.AutoInit()` + `M.Sidenav.init(...)` + `$('select').formSelect()` + `$('.modal').modal()`
   sobre **todo el documento**. Esto **mueve** el `<ul class="sidenav">` a ser hijo directo de `<body>`
   (e inyecta `.sidenav-overlay`) y **envuelve** el `<select>` en un `.select-wrapper`, sacándolo de `#reproRoot`.
3. Inmediatamente después: `isLoading = false; StateHasChanged();`.
4. Ese re-render edita `#reproRoot`, cuyos hijos (en el árbol interno de Blazor) incluían al `<ul>`/`<select>`
   que Materialize ya movió. Blazor emite `parent.insertBefore(...)` / `parent.removeChild(...)` usando esos
   nodos relocalizados como referencia → **WebKit lanza `NotFoundError`** ("The object can not be found here" /
   "node is not a child") y termina el circuito. Chromium lo tolera.

## Cómo correr

```bash
cd ReproBatch
dotnet run
```

La consola muestra la URL (p. ej. `http://localhost:5xxx`). Abrila en cada navegador.

> Requiere conexión a Internet: jQuery, Materialize y perfect-scrollbar se cargan por CDN (cdnjs).

## Resultado esperado por navegador

| Navegador | Motor | Resultado |
|---|---|---|
| **Chrome / Edge** (desktop), Chrome Android | Chromium | La Home carga, pasa de *placeholder* a **"Contenido real"**, el sidenav y el select funcionan. **Sin** errores de batch. |
| **Safari** (macOS), Safari iOS / iOS Simulator, WKWebView | WebKit | La consola muestra `Error: There was an error applying batch <N>.` (dentro de `processBatch` en `blazor.web.js`) + `There was an unhandled exception on the current circuit, so this circuit will be terminated...`. La UI queda **congelada en el placeholder**. |

## Prueba A/B (confirma la causa)

En [Components/Pages/Home.razor.cs](Components/Pages/Home.razor.cs) comentá la línea:

```csharp
await _module.InvokeVoidAsync("initTemplate");
```

Volvé a correr en Safari: **sin la mutación JS de Materialize, el batch ya no rompe**. Eso confirma que la
causa es la relocalización de nodos hecha por Materialize/jQuery sobre el árbol que Blazor gestiona.

## Cómo verificar en WebKit (más fácil primero)

- **Desktop Safari (macOS)** — es WebKit, reproduce el bug **sin** simulador. `Develop → Show Web Inspector → Console`.
  Activá *Break on All Exceptions* para pausar dentro de `processBatch` y leer `error.message`,
  `parent.outerHTML`, `referenceNode.outerHTML`.
- **iOS Simulator + Safari** — `Develop → Simulator → [página] → Console`, mismo procedimiento.

## Por qué esta estructura reproduce el bug

- El `<ul class="sidenav">` y el `<select>` se renderizan **fuera** del `@if (isLoading)`, así existen cuando
  corre `initTemplate()`.
- `M.AutoInit()` + `M.Sidenav.init` mueven el `<ul>` a `<body>`; `formSelect()` saca el `<select>` de `#reproRoot`.
- El toggle `isLoading = false` re-renderiza hijos de `#reproRoot` → Blazor usa los nodos ya movidos como
  referencia de posición → `insertBefore/removeChild` contra un padre que ya no los tiene → `NotFoundError` en WebKit.
- El `<select>` / `formSelect()` es el disparador más confiable; el `@foreach` sin `@key` agrava el reordenamiento.

## Una vez confirmado el repro

Sirve para validar los fixes del informe de diagnóstico:
- Mover el `StateHasChanged` (terminar el toggle de `isLoading`) **antes** de `initTemplate()`.
- Acotar `M.AutoInit` a nodos **no gestionados** por Blazor.
- Aislar sidenav / modal en regiones estáticas (fuera del render interactivo).
- Agregar `@key` a las listas que se reordenan.
