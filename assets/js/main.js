/* Main Js Start */

(function ($) {
  "use strict";

  $(window).on("load", function () {
    $(
      ".thumb--one, .thumb--two, .thumb--three, .thumb--four, .thumb--five"
    ).removeClass(
      "deactive--one deactive--two deactive--three deactive--four deactive--five"
    );
  });

  $(document).ready(function () {
    const thumbClasses = [
      { thumb: ".browse-thumb--one", add: "deactive--one" },
      { thumb: ".browse-thumb--two", add: "deactive--two" },
      { thumb: ".browse-thumb--three", add: "deactive--three" },
      { thumb: ".browse-thumb--four", add: "deactive--four" },
      { thumb: ".browse-thumb--five", add: "deactive--five" },
      { thumb: ".browse-thumb--six", add: "deactive--six" },
    ];

    function isElementInViewport(el) {
      const elementTop = $(el).offset().top;
      const elementBottom = elementTop + $(el).outerHeight();
      const viewportTop = $(window).scrollTop();
      const viewportBottom = viewportTop + $(window).height();

      return elementBottom > viewportTop && elementTop < viewportBottom;
    }

    $(window).on("scroll", function () {
      thumbClasses.forEach((item) => {
        if (isElementInViewport(item.thumb)) {
          setTimeout(() => {
            $(item.thumb).addClass(item.add);
          }, 900);
        }
      });
    });

    $(window).on("scroll", function () {
      // Get the current scroll position
      var scrollPos = $(this).scrollTop();

      var newTopOne = 50 + scrollPos * 0.01;
      var newLeftOne = 50 + scrollPos * 0.01;

      var newTopTwo = 55 + scrollPos * 0.03;
      var newLeftTwo = 75 + scrollPos * 0.01;

      var newTopThree = 82 + scrollPos * 0.02;
      var newLeftThree = 63 + scrollPos * 0.04;

      var newTopFour = 43 + scrollPos * 0.01;
      var newLeftFour = 46 + scrollPos * 0.04;

      var newTopFive = 62 + scrollPos * 0.02;
      var newLeftFive = 30 + scrollPos * 0.04;

      // Change the CSS for each thumb element when scrolling
      $(".thumb--one").css({ top: newTopOne + "%", left: newLeftOne + "%" });
      $(".thumb--two").css({ top: newTopTwo + "%", left: newLeftTwo + "%" });
      $(".thumb--three").css({
        top: newTopThree + "%",
        left: newLeftThree + "%",
      });
      $(".thumb--four").css({
        top: newTopFour + "%",
        right: newLeftFour + "%",
        left: "auto",
      });
      $(".thumb--five").css({
        top: newTopFive + "%",
        right: newLeftFive + "%",
        left: "auto",
      });
    });

    // parallax image
    document.addEventListener("mousemove", parallax);
    function parallax(e) {
      document.querySelectorAll(".animation-img").forEach(function (move) {
        var movingValue = move.getAttribute("data-value");
        var x = (e.clientX * movingValue) / 250;
        var y = (e.clientY * movingValue) / 250;
        move.style.transform =
          "translateX(" + x + "px) translateY(" + y + "px)";
      });
    }

    // slick
    $(".testimonial-slider").slick({
      dots: false,
      infinite: false,
      autoplay: false,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      prevArrow:
        '<button type="button" class="slick-prev"><i class="fas fa-chevron-left"></i></button>',
      nextArrow:
        '<button type="button" class="slick-next"><i class="fas fa-chevron-right"></i></button>',
      responsive: [
        {
          breakpoint: 1100,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },

        {
          breakpoint: 780,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
          },
        },
      ],
    });
  });

  // preloader
  $(window).on("load", function () {
    $("#loading").fadeOut();
  });

  // sticky header
  $(window).on("scroll", function () {
    if ($(window).scrollTop() >= 60) {
      $(".header").addClass("fixed-header");
    } else {
      $(".header").removeClass("fixed-header");
    }
  });

  // tap to top with progress
  if ($(".scroll-top").length > 0) {
    var $scrollTopBtn = $(".scroll-top");
    var $progressPath = $(".scroll-top path");
    var pathLength = $progressPath[0].getTotalLength();

    $progressPath.css({
      transition: "none",
      strokeDasharray: pathLength + " " + pathLength,
      strokeDashoffset: pathLength,
    });

    $progressPath[0].getBoundingClientRect();
    $progressPath.css({
      transition: "stroke-dashoffset 10ms linear",
    });

    var updateProgress = function () {
      var scroll = $(window).scrollTop();
      var height = $(document).height() - $(window).height();
      var progress = pathLength - (scroll * pathLength) / height;
      $progressPath.css("strokeDashoffset", progress);
    };

    updateProgress();

    $(window).on("scroll", updateProgress);

    $(window).on("scroll", function () {
      if ($(this).scrollTop() > 50) {
        $scrollTopBtn.addClass("show");
      } else {
        $scrollTopBtn.removeClass("show");
      }
    });

    $scrollTopBtn.on("click", function (event) {
      event.preventDefault();
      $("html, body").animate({ scrollTop: 0 }, 800);
      return false;
    });
  }

  // wow init
  new WOW().init();

  Splitting();

  $(".popup_video").magnificPopup({
    type: "iframe",
  });

  // // Function to set the 'slick-current' to the second slide
  // function setSlickCurrentToSecondSlide(slick) {
  //   var slides = $(slick.$slides);
  //   slides.removeClass('slick-current');

  //   var secondVisibleIndex;
  //   if (slick.options.slidesToShow > 1) {
  //       secondVisibleIndex = slick.currentSlide + 1;
  //   } else {
  //       secondVisibleIndex = slick.currentSlide;
  //   }

  //   slides.eq(secondVisibleIndex).addClass('slick-current');
  // }

  // // Function to adjust the transform based on the current slide
  // function adjustTransform(currentSlide) {
  //   var screenWidth = $(window).width();
  //   var translateValue = currentSlide * -555;

  //   if (screenWidth > 575) {
  //       $('.expertise-slider--wrap .slick-track').each(function () {
  //           var newTransformValue = 'translate3d(' + translateValue + 'px, 0px, 0px)';
  //           $(this).css('transform', newTransformValue);
  //       });
  //   } else {
  //       // $('.slick-track').each(function () {
  //       //     $(this).css('transform', '');
  //       // });
  //   }
  // }

  // // Function to add custom classes to the first four items
  // function addCustomClasses(slick) {
  //   var slides = $(slick.$slides);
  //   var visibleSlides = slides.filter(function() {
  //       return $(this).offset().left >= 0 && $(this).offset().left < $(window).width();
  //   });

  //   slides.removeClass('first--img second--img third--img forth--img');

  //   visibleSlides.each(function(index) {
  //       if (index === 0) {
  //           $(this).addClass('first--img');
  //       } else if (index === 1) {
  //           $(this).addClass('second--img');
  //       } else if (index === 2) {
  //           $(this).addClass('third--img');
  //       } else if (index === 3) {
  //           $(this).addClass('forth--img');
  //       }
  //   });
  // }

  // // Initialize the slider and combine the functions
  // $('.expertise-slider--wrap').on('init', function (event, slick) {
  //   setTimeout(function () {
  //       adjustTransform(0);
  //       setSlickCurrentToSecondSlide(slick);
  //       addCustomClasses(slick); // Add custom classes
  //   }, 10);
  // }).on('afterChange', function (event, slick, currentSlide) {
  //   setTimeout(function () {
  //       adjustTransform(currentSlide);
  //       setSlickCurrentToSecondSlide(slick);
  //       addCustomClasses(slick); // Re-apply custom classes after slide change
  //   }, 10);
  // }).slick({
  //   dots: false,
  //   infinite: true,
  //   autoplay: true,
  //   autoplaySpeed: 3000,
  //   speed: 5000,
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   arrows: false,
  //   prevArrow: '<button type="button" class="slick-prev"><i class="fa-solid fa-arrow-left-long"></i></button>',
  //   nextArrow: '<button type="button" class="slick-next"><i class="fa-solid fa-arrow-right-long"></i></button>',
  //   responsive: [
  //       {
  //           breakpoint: 1100,
  //           settings: {
  //               slidesToShow: 2,
  //               slidesToScroll: 1
  //           }
  //       },
  //       {
  //           breakpoint: 992,
  //           settings: {
  //               slidesToShow: 2,
  //               slidesToScroll: 1
  //           }
  //       },
  //       {
  //           breakpoint: 780,
  //           settings: {
  //               slidesToShow: 2,
  //               slidesToScroll: 1
  //           }
  //       },
  //       {
  //           breakpoint: 768,
  //           settings: {
  //               slidesToShow: 1,
  //               slidesToScroll: 1
  //           }
  //       },
  //       {
  //           breakpoint: 480,
  //           settings: {
  //               slidesToShow: 1,
  //               slidesToScroll: 1
  //           }
  //       }
  //   ]
  // });
})(jQuery);

// Elements
const $bigBall = document.querySelector(".cursor__ball--big");
const $smallBall = document.querySelector(".cursor__ball--small");
const $hoverables = document.querySelectorAll(".hoverable");

// Listeners
document.body.addEventListener("mousemove", onMouseMove);
$hoverables.forEach((el) => {
  el.addEventListener("mouseenter", onMouseHover);
  el.addEventListener("mouseleave", onMouseHoverOut);
});

// Move the cursor
function onMouseMove(e) {
  gsap.to($bigBall, {
    duration: 0.4,
    x: e.clientX - 15,
    y: e.clientY - 15,
  });
  gsap.to($smallBall, {
    duration: 0.1,
    x: e.clientX - 5,
    y: e.clientY - 7,
  });
}

// Hover an element
function onMouseHover() {
  gsap.to($bigBall, {
    duration: 0.3,
    scale: 4,
  });
}

function onMouseHoverOut() {
  gsap.to($bigBall, {
    duration: 0.3,
    scale: 1,
  });
}

const pinedList = document.querySelector(".image-list");
const pinedInner = document.querySelector(".expertise-slider--inner");

gsap.to(pinedList, {
  x: -pinedList.clientWidth + pinedInner.clientWidth,
  scrollTrigger: {
    trigger: ".expertise-slider--wrap",
    start: "top top",
    end: `+=${pinedList.clientWidth}`,
    pin: true,
    scrub: 1,
  },
});

gsap.registerPlugin(ScrollTrigger);

gsap.defaults({ ease: "none" });

const tl = gsap.timeline();
tl.from(".two", { yPercent: 100 })
  .from(".three", { yPercent: 100 })
  .from(".four", { yPercent: 100 });

ScrollTrigger.create({
  animation: tl,
  trigger: ".case-study",
  start: "top top",
  end: "bottom -100%",
  scrub: 1,
  pin: true,
  anticipatePin: 1,
  ease: "none",
});
