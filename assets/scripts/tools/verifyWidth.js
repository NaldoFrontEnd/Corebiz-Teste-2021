const verifyWidth = () => {
    if ($(window).width() <= 1170) {
        $('body').addClass('isMobile');
        $('body').removeClass('notMobile');
        return true
    } else {
        $('body').removeClass('isMobile');
        $('body').addClass('notMobile');
        return false
    }
}

export default verifyWidth;