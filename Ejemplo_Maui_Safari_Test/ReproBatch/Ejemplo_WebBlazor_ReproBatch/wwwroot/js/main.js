export function initTemplate() {
    console.log("Inicializando template...");
    /* $('.preloader-background').delay(10).fadeOut('slow');*/
    function loadScripts(scripts, callback) {
        let loadedScripts = 0;

        scripts.forEach(src => {
            let script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => {
                loadedScripts++;
                if (loadedScripts === scripts.length) {
                    callback();
                }
            };
            script.onerror = () => {
                console.error(`Error al cargar el script: ${src}`);
            };
            document.head.appendChild(script);
        });
    }
    /*
    Lo comento porque ya está en App.Razor
    loadScripts([
        'modules/jquery/jquery-2.2.4.min.js',
        'modules/materialize/materialize.js',
        'modules/perfect-scrollbar/perfect-scrollbar.min.js',
        'assets/js/variables.js?v=0.0.0.1.202603131313.3',
        //'assets/js/common.js',
        //'/modules/app/init.js',
        //'/modules/app/settings.js'
    ], function () {
        // Inicializa Materialize una vez que todos los scripts estén cargados
        */
    M.AutoInit();
    console.log('Todos los scripts fueron cargados exitosamente.');
    /*
});
    */

    /* $('.preloader-background').delay(10).fadeOut('slow');*/

    /*----------------------------------
       Carousels & Sliders
       ----------------------------------*/
    if ($.fn.carousel) {
        $(".carousel-fullscreen.carousel-slider").carousel({
            fullWidth: true,
            indicators: true,
        }).css("height", $(window).height());
    }
    setTimeout(autoplay, 3500);

    function autoplay() {

        if ($(".carousel-fullscreen.carousel-slider").length) {
            $(".carousel-fullscreen.carousel-slider").carousel("next");
        } else if ($(".carousel").length && $(".carousel.tabs-content").length == false) {
            $(".carousel").carousel("next");
        }
        setTimeout(autoplay, 3500);
    }

    $(".carousel-basic").carousel({
        indicators: true
    });
    $(".carousel-basic1").carousel({
        indicators: true,
        numVisible: 1
    });
    $(".carousel-basic3").carousel({
        indicators: true,
        numVisible: 3,
    });
    $(".carousel-basic4").carousel({
        indicators: true,
        numVisible: 3,
        dist: 50
    });
    $(".carousel-basic5").carousel({
        indicators: true,
        numVisible: 3,
        dist: 100
    });

    $(".carousel-content.carousel-slider").carousel({
        fullWidth: true,
        indicators: true
    });

    $(".carousel-basic71").carousel({
        dist: 50,
        numVisible: 3,
        indicators: true
    });
    $(".carousel-basic21").carousel({
        dist: 0,
        numVisible: 3,
        indicators: true
    });

    $(".carousel-basic51").carousel({
        indicators: true,
        numVisible: 3,
        dist: 10
    });

    $(".carousel-basic399").carousel({
        indicators: true,
        numVisible: 3,
    });
    $(".carousel-basic499").carousel({
        indicators: true,
        numVisible: 3,
        dist: 100
    });
    $(".carousel-basic599").carousel({
        indicators: true,
        numVisible: 3,
        dist: 50
    });

    $(".carousel-fullwidth.carousel-slider").carousel({
        fullWidth: true,
        indicators: true
    });

    $(".slider3").slider({
        indicators: false,
        height: 350,
    });

    $(".slider8").slider({
        indicators: false,
        height: 210,
    });

    $(".slider4").slider({
        height: "100%",
    });

    $(".slider19").slider({
        height: 500,
    });
    $(".slider29").slider({
        indicators: false,
        height: 500,
    });
    $(".slider39").slider({
        height: 500,
    });

    /*----------------------------------
        Accordion
    ----------------------------------*/
    if ($.fn.collapsible) {

        if ($(".collapsible").length) {
            $(".collapsible").collapsible();
        }

        if ($(".collapsible.expandable").length) {
            $(".collapsible.expandable").collapsible({
                accordion: false
            });
        }
    }
    /*----------------------------------
        Modal
    --------
    --------------------------*/

    //// Inicializa los modales
    //if ($(".modal").length) {
    //    console.log("entrando a .modal...");
    //    $(".modal").each(function () {
    //        var $modal = $(this);

    //        console.log("entrando a .modal each...");

    //        // Abre el modal
    //        function abrirModal() {
    //            console.log("Abriendo modal...");
    //            $modal.fadeIn(300);
    //            $("body").addClass("modal-open");
    //        }

    //        // Cierra el modal
    //        function cerrarModal() {
    //            console.log("Cerrando modal...");
    //            $modal.fadeOut(300);
    //            $("body").removeClass("modal-open");
    //        }

    //        // Asigna eventos de apertura y cierre
    //        $modal.on("click", function (e) {
    //            // Cierra al hacer clic fuera del contenido
    //            if ($(e.target).hasClass("modal")) {
    //                cerrarModal();
    //            }
    //        });

    //        // Botón para cerrar el modal
    //        $modal.find(".modal-close").on("click", function () {
    //            cerrarModal();
    //        });

    //        // Almacena las funciones para abrir y cerrar en el modal
    //        $modal.data("abrir", abrirModal);
    //        $modal.data("cerrar", cerrarModal);
    //    });
    //}

    //// Abre el modal si tiene la clase .default-open
    //if ($(".modal").length && $(".default-open").length) {
    //    function showModal1() {
    //        var $modal = $(".modal.default-open");
    //        $modal.data("abrir")();  // Utiliza la función almacenada para abrir
    //    }
    //    showModal1();
    //}

    //var elems = document.querySelectorAll('.modal');
    //M.Modal.init(elems);

    if ($(".modal").length) {
        $(".modal").modal({
            onOpenStart() {
                // console.log("Open Start");
                $("body").addClass("modal-open");
            },
            onOpenEnd() {
                // console.log("Open End");
            },
            onCloseStart() {
                // console.log("Close Start");
                $("body").removeClass("modal-open");
            },
            onCloseEnd() {
                // console.log("Close End");
            },
        });
    }

    if ($(".modal").length && $(".default-open").length) {
        //$(".modal").modal();
        //document.addEventListener("DOMContentLoaded", function () {
        function showModal1() {
            var Modalelem = document.querySelector(".modal");
            var instance = M.Modal.init(Modalelem);
            instance.open();
        }
        /* });*/
        showModal1();
    }


    /*----------------------------------
        Tabs
       ----------------------------------*/
    $(".tabs").tabs();
    $("#tabs-swipe-demo").tabs({ swipeable: true });

    /*----------------------------------
        Tooltip
    ----------------------------------*/
    $(".tooltipped").tooltip();
    $(".tooltipped-html1").tooltip({
        html: "<div style=\'width:150px;\'><h6 class=\'tooltip-title\'>Tooltip Heading</h6><img src=\'assets/images/masonry-71.jpg\' class=\'responsive-img\' alt=\'image\'><p>Some text content added in the tootltip area.</p></div>",
    });
    $(".tooltipped-html2").tooltip({
        html: "<div style=\'width:150px;\'><h6 class=\'tooltip-title\'>Tooltip Heading</h6><img src=\'assets/images/masonry-72.jpg\' class=\'responsive-img\' alt=\'image\'><p>Some text content added in the tootltip area.</p></div>",
    });
    $(".tooltipped-html3").tooltip({
        html: "<div style=\'width:150px;\'><h6 class=\'tooltip-title\'>Tooltip Heading</h6><img src=\'assets/images/masonry-73.jpg\' class=\'responsive-img\' alt=\'image\'><p>Some text content added in the tootltip area.</p></div>",
    });
    $(".tooltipped-html4").tooltip({
        html: "<div style=\'width:150px;\'><h6 class=\'tooltip-title\'>Tooltip Heading</h6><img src=\'assets/images/masonry-74.jpg\' class=\'responsive-img\' alt=\'image\'><p>Some text content added in the tootltip area.</p></div>",
    });

    /*----------------------------------
        Select
        ----------------------------------*/
    $("select").formSelect();

    /*----------------------------------
        Parallax
        ----------------------------------*/
    $(".parallax").parallax();

    /*----------------------------------
        Error code page
    ----------------------------------*/
    if ($(".error-page").length && $(".error-code").length) {
        $(".error-page").append("<div class=\'glitch-window\'></div>");
        $(".error-code").clone().appendTo(".glitch-window");
    }
}



/*----
Para el timer de 2FA

------------------------------*/
window.startCodigoTimer = (seconds) => {

    clearInterval(window.codigoTimerInterval);

    const label = document.getElementById("lblTimerCodigo");
    const btn = document.getElementById("btnGenerarCodigo");

    if (!label || !btn)
        return;

    btn.disabled = true;

    const endTime = Date.now() + (seconds * 1000);

    const update = () => {

        const remainingMs = endTime - Date.now();

        if (remainingMs <= 0) {

            clearInterval(window.codigoTimerInterval);

            label.innerText = "";

            btn.disabled = false;

            return;
        }

        const totalSeconds = Math.floor(remainingMs / 1000);

        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const secondsLeft = String(totalSeconds % 60).padStart(2, '0');

        label.innerText =
            `Podrás generar un nuevo código en ${minutes}:${secondsLeft}`;
    };

    update();

    window.codigoTimerInterval = setInterval(update, 1000);
};

/*----------------------------------
    Scroll a la parte superior
----------------------------------*/
export function scrollToTop(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollTop = 0;
    } else {
        window.scrollTo(0, 0);
    }
}