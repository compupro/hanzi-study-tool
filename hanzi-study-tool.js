/*Utility functions*/

//Use this so negative n doesn't return negative answer
function mod(n, m) {
    return ((n % m) + m) % m;
}

class WritingBox {
    
    /*Define a canvas as a WritingBox by instantiating a WritingBox with the id of the canvas
    
    elemId: The id of the <canvas> element*/
    constructor(elemId, hanzi){
        this.writingArea = document.getElementById(elemId);
        this.gfxCtx = writingArea.getContext("2d");

        this.clickX = [];
        this.clickY = [];
        this.clickDrag = [];
        this.writing;
        this.hanzi = hanzi;
        this.redraw();
        
        var self = this;
        
        writingArea.addEventListener("mousedown", function(e){
            var mouseX = e.pageX - this.offsetLeft;
            var mouseY = e.pageY - this.offsetTop;
            
            self.writing = true;
            self.addClick(mouseX, mouseY);
            self.redraw();
        });

        writingArea.addEventListener("mousemove", function(e){
            if (self.writing){
                var mouseX = e.pageX - this.offsetLeft;
                var mouseY = e.pageY - this.offsetTop;
                
                self.addClick(mouseX, mouseY, true);
                self.redraw();
            }
        });

        writingArea.addEventListener("mouseup", function(e){
            self.writing = false;
        });

        writingArea.addEventListener("mouseLeave", function(e){
            self.writing = false;
        });
    }

    addClick(x, y, dragging){
        this.clickX.push(x);
        this.clickY.push(y);
        this.clickDrag.push(dragging);
    }

    redraw(){
        this.gfxCtx.clearRect(0, 0, this.gfxCtx.canvas.width, this.gfxCtx.canvas.height); // Clears the canvas
        
        this.gfxCtx.strokeStyle = "#888888";
        this.gfxCtx.lineWidth = 1;
        this.gfxCtx.beginPath();
        this.gfxCtx.moveTo(0, this.gfxCtx.canvas.height/2);
        this.gfxCtx.lineTo(this.gfxCtx.canvas.width, this.gfxCtx.canvas.height/2);
        this.gfxCtx.moveTo(this.gfxCtx.canvas.width/2, 0);
        this.gfxCtx.lineTo(this.gfxCtx.canvas.width/2, this.gfxCtx.canvas.height);
        this.gfxCtx.stroke()
        
        this.gfxCtx.strokeStyle = "#000000";
        this.gfxCtx.lineJoin = "round";
        this.gfxCtx.lineWidth = 5;
                
        for(var i=0; i < this.clickX.length; i++) {		
            this.gfxCtx.beginPath();
            if (this.clickDrag[i] && i){
                this.gfxCtx.moveTo(this.clickX[i-1], this.clickY[i-1]);
            } else {
                this.gfxCtx.moveTo(this.clickX[i]-1, this.clickY[i]);
            }
            this.gfxCtx.lineTo(this.clickX[i], this.clickY[i]);
            this.gfxCtx.closePath();
            this.gfxCtx.stroke();
        }
    }

    clearWritingArea(){
        this.clickX = [];
        this.clickY = [];
        this.clickDrag = [];
        this.redraw();
    }
    
    showHanzi(){
        var fontSize = 200;
        this.gfxCtx.font = fontSize + "px serif";
        this.gfxCtx.textAlign="center";
        this.gfxCtx.fillStyle="rgba(0, 0, 255, 0.5)";
        this.gfxCtx.fillText(this.hanzi, this.gfxCtx.canvas.width/2, this.gfxCtx.canvas.height/2+fontSize/2.75)
    }
}

hanzi = ["水","不","可","思","議"];
notes = ["seui", "bat", "ho", "something", "something else"]
hanziIndex = 0;
w = new WritingBox("writingArea", hanzi[hanziIndex]);
var notesElem = document.getElementById("notes");
note = document.createTextNode(notes[hanziIndex]);
notesElem.appendChild(note);

function nextHanzi(){
    hanziIndex++;
    newHanziCanvas();
}

function prevHanzi(){
    hanziIndex--;
    newHanziCanvas();
}

function newHanziCanvas(){
    w = new WritingBox("writingArea", hanzi[mod(hanziIndex,hanzi.length)]);
    
    notesElem = document.getElementById("notes");
    notesElem.innerHTML = ""
    note = document.createTextNode(notes[mod(hanziIndex, notes.length)]);
    notesElem.appendChild(note);
}