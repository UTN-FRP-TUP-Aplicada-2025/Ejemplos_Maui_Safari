export function initTemplate() {
    console.log("initTemplate: inicializando Materialize sobre TODO el documento...");

    // Inicializa TODOS los componentes Materialize de la página (incluye Sidenav, Modal, FormSelect...)
    M.AutoInit();

    // Refuerzos explícitos (igual que el proyecto real): cada uno RELOCALIZA/ENVUELVE nodos de Blazor
    M.Sidenav.init(document.querySelectorAll('.sidenav'));   // mueve el <ul class="sidenav"> a <body> + overlay
    $("select").formSelect();                                // envuelve <select> en .select-wrapper
    if ($(".modal").length) { $(".modal").modal(); }         // mueve/wrappea el .modal

    console.log("initTemplate: listo (DOM ya mutado).");
}
