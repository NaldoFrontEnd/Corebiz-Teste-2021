const isMobile = () => {
    let userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.search(/(android|avantgo|blackberry|iemobile|nokia|lumia|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i) != -1) {
        return true;
    };
};

export default isMobile;
  