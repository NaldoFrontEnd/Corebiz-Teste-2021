import noScript from './../tools/noScript';
import verifyWidth from './../tools/verifyWidth';
import isMobile from "./../tools/isMobile";
export default class Common {
    constructor() {
        this.init();
    }

    DOMReady() {
        $(document).ready(() => {
            this.newsletter()
            this.sliderHome()
            this.produtosHome()
        });
    }

    onLoad() {
        $(window).on('load', () => {

        });
    }
    
    ajaxStop() {
        $(document).ajaxStop(() =>  {

        });
    }
        
    newsletter(){
        $(document).on('click', '.c-news button', function(event){
            event.preventDefault();

            const name = $('.c-news').find('.name');
            const email = $('.c-news').find('.email');
            
            function regexMail(email) {
                var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                return regex.test(email);
                }

            let validaName = name.val() == "";
            let validaEmail = email.val() == "" || !regexMail(email.val());

            if(validaName){
                name.addClass("erro");
                return;
                }

                if(validaEmail){
                name.removeClass("erro");
                email.addClass("erro");
                return;
                }          

            let data = {
                'name': name.val(),
                'email': email.val()
            }

            console.log(data)


            if(!validaName && !validaEmail){
                $('.c-news').find('.erro').removeClass("erro");
                $('.sucesso').show()
                $('form, h2').hide()

                var settings = {
                    "url": "https://corebiz-test.herokuapp.com/api/v1/newsletter",
                    "data": JSON.stringify(data),
                    "method": "POST",
                    "timeout": 0,
                  };
                  
                  $.ajax(settings).done(function (response) {
                    console.log(response);

                    //tentei varias vezes mais consegui fazer o POST =/
                  });
            }

        });

        $(document).on('click', '.sucesso button', function(){
            location.reload();
      });
    }                          
    
    sliderHome() {
        $('.c-sliderHome__sliders').owlCarousel({
            items: 1,
            margin: 0,
            lazyLoad: true,
            nav: false,
            loop: true,
            touchDrag: true,
            autoplayHoverPause: true,
            mouseDrag: true,
            rewind: true,
            autoplay: 3000
        });
    }

    produtosHome() {
        $('.listProdutos').owlCarousel({
            loop: true,
            touchDrag: true,
            mouseDrag: true,
            margin: 10,
            nav: true,
            autoplay: 3000,
            responsiveClass:true,
            responsive:{
                0:{
                    items: 2,
                    nav: false,
                },
                1366:{
                    items: 4,
                }
            }
        });
    }

    init() {
        this.DOMReady();
        this.onLoad();
        this.ajaxStop();
    }
}