/*Utility functions*/

//jQuery-like alias for the stupidly long function name
function $(elemId){
    return document.getElementById(elemId);
}

//Use this so negative n doesn't return negative answer
function mod(n, m) {
    return ((n % m) + m) % m;
}

//Generates a unique ID number that hasn't been used this session
var idCounter = 0;
function newId(){
    idCounter++;
    return idCounter;
}

class WritingBox {
    
    /*Define a canvas as a WritingBox by instantiating a WritingBox with the id of the canvas
    
    elemId: The id of the <canvas> element*/
    constructor(elemId, hanzi){
        this.writingArea = $(elemId);
        this.gfxCtx = this.writingArea.getContext("2d");

        this.clickX = [];
        this.clickY = [];
        this.clickDrag = [];
        this.writing;
        this.hanzi = hanzi;
        this.showingHanzi = false;
        this.redraw();
        
        var self = this;
        
        this.writingArea.addEventListener("mousedown", function(e){
            var mouseX = e.pageX - this.offsetLeft;
            var mouseY = e.pageY - this.offsetTop;
            
            self.writing = true;
            self.addClick(mouseX, mouseY);
            self.redraw();
        });

        this.writingArea.addEventListener("mousemove", function(e){
            if (self.writing){
                var mouseX = e.pageX - this.offsetLeft;
                var mouseY = e.pageY - this.offsetTop;
                
                self.addClick(mouseX, mouseY, true);
                self.redraw();
            }
        });

        this.writingArea.addEventListener("mouseup", function(e){
            self.writing = false;
        });

        this.writingArea.addEventListener("mouseLeave", function(e){
            self.writing = false;
        });
    }

    addClick(x, y, dragging){
        this.clickX.push(x);
        this.clickY.push(y);
        this.clickDrag.push(dragging);
    }

    redraw(){
        $("hanziToggle").innerHTML = "Show hanzi";
        this.showingHanzi = false;
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
        this.showingHanzi = true;
        var fontSize = 200;
        this.gfxCtx.font = fontSize + "px serif";
        this.gfxCtx.textAlign="center";
        this.gfxCtx.fillStyle="rgba(0, 0, 255, 0.5)";
        this.gfxCtx.fillText(this.hanzi, this.gfxCtx.canvas.width/2, this.gfxCtx.canvas.height/2+fontSize/2.75)
    }
    
    hideHanzi(){
        this.redraw()
    }
}

function hideModal(){
    $("modal").style.display = "none";
}

function showModal(){
    $("modal").style.display = "block";
}

var hanzi = ["佔位符"];
var notes = ["You haven't submitted any words to study yet!"]
var hanziIndex = 0;
var writingAreas = [];
processHanzi()

function newInput(){
    hanzi = [];
    notes = [];
    hanziIndex = 0;
    writingAreas = []
    var input = $("input").value;
    for (const line of input.split("\n")){
        delimiterPos = line.indexOf(":");
        hanzi.push(line.slice(0, delimiterPos));
        notes.push(line.slice(delimiterPos+1))
    }
    hideModal();
    processHanzi();
}

function nextHanzi(){
    hanziIndex++;
    processHanzi();
}

function prevHanzi(){
    hanziIndex--;
    processHanzi();
}

function processHanzi(){
    $("writingAreaContainer").innerHTML = "";
    for (const character of hanzi[mod(hanziIndex,hanzi.length)]){
        var canvas = document.createElement("canvas");
        canvas.id = newId();
        canvas.width = 200;
        canvas.height = 200;
        canvas.style.border = "1px solid black";
        
        $("writingAreaContainer").appendChild(canvas);
        writingAreas.push(new WritingBox(canvas.id, character));
    }
    
    notesElem = $("notes");
    notesElem.innerHTML = ""
    note = document.createTextNode(notes[mod(hanziIndex, notes.length)]);
    notesElem.appendChild(note);
}

function toggleHanzi(){
    for (const writingArea of writingAreas){
        if (writingArea.showingHanzi){
            $("hanziToggle").innerHTML = "Show hanzi";
            writingArea.hideHanzi();
        } else {
            $("hanziToggle").innerHTML = "Hide hanzi";
            writingArea.showHanzi();
        }
    }
}