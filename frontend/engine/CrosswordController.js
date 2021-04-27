class CrosswordController{
    constructor(model, view){
        this.model = model;
        this.view = view;

        view.addListener((e) => {
            switch(e.id){
                case 'checkGridButton':
                    this.model.checkGrid();
                    break;
                case 'checkWordButton':
                    this.model.checkWord();
                    break;
                case 'checkTileButton':
                    this.model.checkTile();
                    break;
                case 'revealGridButton':
                    this.model.revealGrid();
                    break;
                case 'revealWordButton':
                    this.model.revealWord();
                    break;
                case 'revealTileButton':
                    this.model.revealTile();
                    break;
                case "resetButton":
                    this.model.reset();
                    break;
                case "pauseButton":
                    this.model.pause();
                    break;
                case "startButton":
                    this.model.startTime();
                    break;
                case "unpauseButton":
                    this.model.unpause();
                    break;
            }
        });
    }
}
