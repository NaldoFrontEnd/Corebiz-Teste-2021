import common from './Pages/common';

class Main {
    constructor() {
        this.init();
    }
    
    stableValidate() {
        window.location.hostname.indexOf("vtex") >= 0 &&
         $("body").addClass("inStable");
    }

    init() {
        this.stableValidate();
        new common();
        
        console.log('teste ok')
    }
}

new Main();