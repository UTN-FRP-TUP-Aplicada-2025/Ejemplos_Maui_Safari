using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Ejemplo_WebBlazor_ReproBatch.Components.Pages;

public partial class Home : ComponentBase
{
    [Inject] IJSRuntime JS { get; set; } = default!;

    private bool isLoading = true;
    private readonly string[] servicios = { "Multas", "Turnos", "Trámites", "Farmacias" };
    private IJSObjectReference? _module;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (!firstRender) return;

        // (a) Importar main.js y MUTAR el DOM (Materialize/jQuery) sobre nodos que Blazor controla
        _module ??= await JS.InvokeAsync<IJSObjectReference>("import", "./js/main.js");

        // === A/B TOGGLE para "arreglar" el repro ===
        // Comentá la línea de abajo: sin la mutación JS de Materialize, el batch ya NO rompe en WebKit.
        await _module.InvokeVoidAsync("initTemplate");

        // (b) ...y JUSTO DESPUÉS re-renderizar -> este es el batch que rompe en WebKit
        isLoading = false;
        StateHasChanged();
    }
}
