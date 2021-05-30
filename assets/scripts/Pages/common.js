import noScript from './../tools/noScript';
import verifyWidth from './../tools/verifyWidth';
import isMobile from "./../tools/isMobile";
export default class Common {
    constructor() {
        this.init();
    }

    DOMReady() {
        $(document).ready(() => {
            this.sliderHome()
            this.newsletter()
            this.prateleiraDinamica()
            this.byButton()
        });
    }
    
    onLoad() {
        $(window).on('load', () => {
            setTimeout(()=> {
                this.carousellHome()
            }, 1000)
        });
    }
    
    ajaxStop() {
        $(document).ajaxStop(() =>  {

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

    carousellHome() {
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
        
    newsletter() {
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

    prateleiraDinamica() {
        let settings = {
        "url": "https://corebiz-test.herokuapp.com/api/v1/products",
        "method": "GET",
        "timeout": 0,
        };

        $.ajax(settings).done(function (response) {
            console.log(response);

            response.forEach((element,index) => {

                let produto = `
                
                <li class="listProdutos__item">
                <a href="#" class="listProdutos__item--link">
                  <div class="listProdutos__item--flag">
                    <span class="off">Off</span>
                  </div>
                  <img class="listProdutos__item--image" src="${element.imageUrl}" alt="produto">
                  
                  <div class="listProdutos__item--wrapper">
                    <span class="listProdutos__item--name">${element.productName}</span>
    
                    <ul class="listProdutos__item--avaliacoes">
                      <li></li>
                      <li></li>
                      <li></li>
                      <li></li>
                      <li></li>
                    </ul>
    
                    <span class="listProdutos__item--precoDe">de R$ 299,00</span>
                    <span class="listProdutos__item--precoPor">por R$ 199,00</span>  
                    <span class="listProdutos__item--parcelado">ou em 4x de R$ 49,75</span>   
                    <span class="listProdutos__item--btnComprar" title="Comprar">Comprar</span> 
                  </div>
                </a>
              </li>
                
                `
            
                $('.listProdutos').append(produto);

            });
        });

    } 
    
    byButton() {
        $(document).on('click', '.listProdutos__item--btnComprar', () => {
            let num = Number($('.circle span').text())
            num += 1;
            
            localStorage.setItem('miniCart', num)
            $('.circle span').text(localStorage.getItem('miniCart'))
        })

        $('.circle span').text(localStorage.getItem('miniCart'))
    }

    init() {
        this.DOMReady();
        this.onLoad();
        this.ajaxStop();
    }
}