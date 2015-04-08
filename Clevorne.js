var clevorne = function(pane, data){

    var palette = ["blue", "red", "orange", "green", "purple", "orange", "darkturquoise", "deeppink"];

    this.paneHeight = pane.getAttribute("height");
    this.paneWidth = pane.getAttribute("width");
    
   
    this.getDataBounds = function(){
        var first = true;
        for(j = 0; j < dataset.length; ++j){
            for(k = 0; k < dataset[j].data.length; ++k){            
                if(first){
                    this.xmin = this.xmax = dataset[j].data[k][0];
                    this.ymin = this.ymax = dataset[j].data[k][1];
                    first = false;
                }
                else{
                    if (dataset[j].data[k][0] < this.xmin){
                        this.xmin = dataset[j].data[k][0];
                    }
                    else if (dataset[j].data[k][0] > this.xmax){
                        this.xmax = dataset[j].data[k][0];
                    }            
                    if (dataset[j].data[k][1] < this.ymin){
                        this.ymin = dataset[j].data[k][1];
                    }
                    else if (dataset[j].data[k][1] > this.ymax){
                        this.ymax = dataset[j].data[k][1];
                    }
            
                }
        
        
            }
    
        }
    }
   
    this.getDataBounds();
    this.yrange = this.ymax - this.ymin;
    this.xrange = this.xmax - this.xmin;
    

    this.mapX = function(value){
        return 0.05*this.paneWidth + (value - this.xmin)*0.9*this.paneWidth/this.xrange;    
    }
    this.mapY = function(value){ 
        return 0.05*this.paneHeight + (this.ymax - value)*0.9*this.paneHeight/this.yrange;
    }
    

    
    this.drawPoint =  function(x,y,colour){
        var point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        point.setAttribute('cx', x);
        point.setAttribute('cy', y);
        point.setAttribute('r', 6);
        point.setAttribute('stroke-width',1);
        point.style.fill = colour;
        point.style.stroke="black";
        point.style.opacity = 1.0;
        pane.appendChild(point);
    }
    
    this.drawLine = function(x1,y1, x2, y2, colour){
        var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1",x1);
        line.setAttribute("y1",y1);
        line.setAttribute("x2",x2);
        line.setAttribute("y2",y2);
        line.style.stroke=colour; 
        pane.appendChild(line);
    }

    this.drawScatter = function(){
        var x1, y1, colour;
        
        for(var j = 0; j < dataset.length; ++j){
            colour =  palette[j%palette.length];
        
            for(var k = 0; k < dataset[j].data.length; ++k){ 
                x1 = this.mapX(dataset[j].data[k][0]);
                y1 = this.mapY(dataset[j].data[k][1]);   
                this.drawPoint(x1, y1, colour);
            }
        }
    }
    
    this.drawLines = function(){
        var x1, x2, y1, y2, colour;
        
        for(var j = 0; j < dataset.length; ++j){
            colour =  palette[j%palette.length];
            x1 = this.mapX(dataset[j].data[0][0]);
            y1 = this.mapY(dataset[j].data[0][1]);                
            for(var k = 1; k < dataset[j].data.length; ++k){ 
                x2 = this.mapX(dataset[j].data[k][0]);
                y2 = this.mapY(dataset[j].data[k][1]);
                this.drawLine(x1, y1, x2, y2, colour); 
                x1 = x2;
                y1 = y2;
            }
        }
    }
    
} 
