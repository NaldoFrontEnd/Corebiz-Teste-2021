import noScript from './../tools/noScript';
import verifyWidth from './../tools/verifyWidth';
import isMobile from "./../tools/isMobile";
export default class Common {
    constructor() {
        this.init();
    }

    DOMReady() {
        $(document).ready(() => {
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

    init() {
        this.DOMReady();
        this.onLoad();
        this.ajaxStop();
    }
}