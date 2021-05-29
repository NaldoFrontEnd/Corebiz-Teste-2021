const noScript = () => {
    if($(window).width() > 1170){
        $('.d-desk').find('noscript').replaceWith(function() {
            return this.textContent || this.innerText;
        });
    }else{
        $('.d-mob').find('noscript').replaceWith(function() {
            return this.textContent || this.innerText;
        });
    }
}

export default noScript;