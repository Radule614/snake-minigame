let Main = {
    init: function() {
        this.setUpdateEvent();
        snakeApp();
    },
    setUpdateEvent: function() {
        let btn = document.getElementById("btn-update");
        btn.addEventListener("click", this.updateEvent);
    },
    updateEvent: function(e) {
        e.preventDefault();
        let speed = document.getElementById("speed-input").value;
        let walls = document.getElementById("walls").checked;
        let size = document.getElementById("size").value;
        setSnakeFps(speed);
        wallsOn = walls;
        let x, y;
        switch (parseInt(size)) {
            case 1:
                x = 600;
                y = 450;
                break;
            case 2:
                x = 800;
                y = 600;
                break;
            case 3:
                x = 1000
                y = 750;
                break;
        }
        Main.setCanvasSize(x, y);

    },
    setCanvasSize(x, y) {
        let g = document.getElementById("game");
        g.style.width = x + "px";
        g.style.height = (y + 50) + "px";
        setWindowSize(x, y);
    }
}

window.onload = Main.init();