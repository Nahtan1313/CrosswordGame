class Linker{
    constructor(year, monthString, dayString){
        this.storage = firebase.storage();
        this.storageRef = firebase.storage().ref();
        if(year === 0 || monthString === 0 || dayString === 0){
            this.generateRandomDate();
        }
        else{
            this.createLinks(year, monthString, dayString);
        }
    }

    createLinks(year, month, day){
        let gameRef = this.storageRef.child("Years/"+year+"/"+month+"/"+day+".json");
        gameRef.getDownloadURL().then((url) => {
            let xhr = new XMLHttpRequest();
            xhr.responseType = 'json';
            xhr.onload = (event) => {
            let downloadedJSON = xhr.response;
            let model = new Crossword(downloadedJSON);
            let view = new CrosswordView(model);
            let controller = new CrosswordController(model, view);    
            let body = document.querySelector("body");
            body.append(view.div);
            };
            xhr.open('GET', url);
            xhr.send();
        })
        .catch((error) => {
            console.log("I pity the fool who gets a download error");
        });
    }

    generateRandomDate(){
        let gap_1978_start = new Date(1978,7,10).getTime();
        let gap_1978_end = new Date(1978,10,5).getTime();
        let gap_2015_start = new Date(2015,7,30).getTime();
        let gap_2016_end = new Date(2016,0).getTime();
        let leapYears = [1976, 1980, 1984,1988,1992,1996,2000,2004, 2008,2012]
        let randDate;
        let y;
        let m;
        let d;
        do{
            y = Math.floor((Math.random()*(2015-1978+1) + 1978));
            m = Math.floor((Math.random()*(12-1+1) + 1));
            if(m === 2){
                if(leapYears.includes(y)){
                    d = (Math.random()*(29-1+1) + 1);
                }
                else{
                d  = (Math.random()*(28-1+1) + 1);
                }
            }
            else if(m === 4 || m === 6 || m === 9 || m === 11){
                d = (Math.random()*(30-1+1) + 1);
            }
            else{
            d  = (Math.random()*(31-1+1) + 1);
            }
            d = Math.floor(d);
            randDate = new Date(y, m-1, d).getTime();
        }while((randDate >= gap_1978_start && randDate <= gap_1978_end) || (randDate >= gap_2015_start && randDate <= gap_2016_end));
        let dString = (""+d).padStart(2,"0");
        let mString = (""+m).padStart(2,"0");
        this.createLinks(y, mString, dString);
    }
}

