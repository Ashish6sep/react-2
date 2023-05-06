/* ========================================== 
 scrollTop() >= 300
 Should be equal the the height of the header
 ========================================== */

$(window).scroll(function () {
    if ($(window).scrollTop() >= 300) {
        $('.site_menu').addClass('fixed-header');
    } else {
        $('.site_menu').removeClass('fixed-header');
    }
});



/*===Back to Top===*/
$(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
        $('.scrollup').show();
    } else {
        $('.scrollup').hide();
    }
});

$('.scrollup').click(function () {
    $("html, body").animate({
        scrollTop: 0
    }, 600);
    return false;

});


/*=== Mobile menu ===*/
$(function () {
    $(".mob_site_menu").on("click", function () {
        $("body").toggleClass("current", 1000);
    });
});


/*=== flexslider ===*/
$(window).ready(function () {
    $('#productQucikView').on('shown.bs.modal', function (e) {
        // console.log('your message');
        $('.flexslider').flexslider({
            animation: "slide",
            controlNav: "thumbnails"
        });
    });
});

$(window).ready(function () {
    $('#rterererer').flexslider({
        animation: "slide",
        controlNav: "thumbnails"
    });
});

/*=== SHIP TO A DIFFERENT ADDRESS ===*/


$(function () {
    $("#ship_different_address").change(function () {
        if (this.checked) {
            $(".ship-to-different-address-container").show();
        } else {
            $(".ship-to-different-address-container").hide();
        }
    });
});


jQuery(document).ready(function () {
    var list = jQuery(".top-product-list .product-item");
    var numToShow = 4;
    var button = jQuery("#showmore");
    var numInList = list.length;
    //list.hide();
    list.css('display', 'none');
    list.css('visibility', 'hidden');
    if (numInList > numToShow) {
        button.show();
    }
    list.slice(0, numToShow).css('visibility', 'visible');
    list.slice(0, numToShow).css('display', '');


    button.click(function () {
        var showing = list.filter(':visible').length;
        list.slice(showing - 1, (showing + numToShow)).css('visibility', 'visible');
        list.slice(showing - 1, (showing + numToShow)).css('display', '');
        var nowShowing = list.filter(':visible').length;
        if (nowShowing >= numInList) {
            button.text("No more product");
            button.addClass("disabled");
            button.attr("disabled", "disabled");
        }
    });
});

jQuery(document).ready(function () {
    var list = jQuery(".top_bundle_product .product-bundle-item");
    var numToShow = 3;
    var button = jQuery("#showmorebundleproduc");
    var numInList = list.length;
    //list.hide();
    list.css('display', 'none');
    list.css('visibility', 'hidden');
    if (numInList > numToShow) {
        button.show();
    }
    list.slice(0, numToShow).css('visibility', 'visible');
    list.slice(0, numToShow).css('display', '');


    button.click(function () {
        var showing = list.filter(':visible').length;
        list.slice(showing - 1, (showing + numToShow)).css('visibility', 'visible');
        list.slice(showing - 1, (showing + numToShow)).css('display', '');
        var nowShowing = list.filter(':visible').length;
        if (nowShowing >= numInList) {
            button.text("No more product");
            button.addClass("disabled");
            button.attr("disabled", "disabled");
        }
    });



});




jQuery(function () {
    jQuery('.lazy').Lazy();
});





