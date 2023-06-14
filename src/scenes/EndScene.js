class EndScene extends Phaser.Scene{
    constructor(){
        super('endScene')
    }
    create(){
        this.add.image(0,0,'end').setOrigin(0,0);
        this.restart = this.time.delayedCall(5000, ()=> {
            this.scene.start('Title');
        });
    }
}