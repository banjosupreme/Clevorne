var clevorne = function(pane, data, xcol, ycol){

    var palette = ["blue", "red", "orange", "green", "purple", "orange", "darkturquoise", "deeppink"];

    this.paneHeight = pane.getAttribute("height");
    this.paneWidth = pane.getAttribute("width");
    this.xcol = xcol;
    this.ycol = ycol;
   
    this.getDataBounds = function(){
        this.xmin = this.xmax = dataset.data[0][this.xcol];
        this.ymin = this.ymax = dataset.data[0][this.ycol];
        for(j = 1; j < dataset.data.length; ++j){
            if (dataset.data[j][this.xcol] < this.xmin){
                this.xmin = dataset.data[j][this.xcol];
            }
            else if (dataset.data[j][this.xcol] > this.xmax){
                this.xmax = dataset.data[j][this.xcol];
            }            
            if (dataset.data[j][this.ycol] < this.ymin){
                this.ymin = dataset.data[j][this.ycol];
            }
            else if (dataset.data[j][this.ycol] > this.ymax){
                this.ymax = dataset.data[j][this.ycol];
            }        
        }        
    }
   
    this.getDataBounds();
    /*console.log("**********");
    console.log(this.ymax);
    console.log(this.ymin);*/
    this.yrange = this.ymax - this.ymin;
    this.xrange = this.xmax - this.xmin;
    

    this.mapX = function(value){
        return 0.06*this.paneWidth + (value - this.xmin)*0.88*this.paneWidth/this.xrange;    
    }
    this.mapY = function(value){ 
        return 0.06*this.paneHeight + (this.ymax - value)*0.88*this.paneHeight/this.yrange;
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

   
    
    this.placeGrid = function(xgrid, ygrid){
        var gridMinX, gridMinY, gridMaxX, gridMaxY, x1, x2, y1, y2;
        //really should make these 0.01 and 0.99 functions of some padding variable
        gridLowX = this.paneWidth*0.01
        gridHighX = this.paneWidth*0.99
        
        
        gridLowY = this.paneHeight*0.99;
        gridHighY = this.paneHeight*0.01;
        
        for(var j = 0; j < xgrid.length; ++j)
        {
            x1 = this.mapX(xgrid[j]);
            this.drawLine(x1, gridLowY, x1, gridHighY, "lightgray");
        }
        for(var j = 0; j < ygrid.length; ++j)
        {
            y1 = this.mapY(ygrid[j]);
            this.drawLine(gridLowX, y1, gridHighX, y1, "lightgray");
        }
    }

    this.indexOf = function(value, array){
        for(var j = 0; j < array.length; ++j){
            if (array[j] == value){
                return j;
            }
        }
        return -1;
    }
    
    this.initializeGroupsAndColours = function(){
        
        this.group = new Array(dataset.data.length);
        this.colour = new Array(dataset.data.length);
        
        for(var j = 0; j < dataset.data.length; ++j){
            this.group[j] = this.colour[j] = 0;
        }
        this.groupLookup = [];
        this.colourLookup = []; 

    }

    this.initializeGroupsAndColours();


    this.groupBy = function(groupCol){
        //same as groupBy above. Copy pasted. Really should cut down on this code duplication.
        var testVal;
        for(var j = 0; j < dataset.data.length; ++j){
            testVal = this.indexOf(dataset.data[j][groupCol], this.groupLookup);
            if (testVal == -1){
                this.group[j] = this.groupLookup.length;
                this.groupLookup.push(dataset.data[j][groupCol]);
            }
            else{
                this.group[j] = testVal;
            }
        }
        
    }
    

    this.colourBy = function(colourCol){
        //same as groupBy above. Copy pasted. Really should cut down on this code duplication.
        var testVal;
        for(var j = 0; j < dataset.data.length; ++j){
            testVal = this.indexOf(dataset.data[j][colourCol], this.colourLookup);
            if (testVal == -1){
                this.colour[j] = this.colourLookup.length;
                this.colourLookup.push(dataset.data[j][colourCol]);
            }
            else{
                this.colour[j] = testVal;
            }
        }
        
    }
    
     this.drawScatter = function(){
        var x1, y1, colour;
        
        for(var j = 0; j < dataset.data.length; ++j){
            colour =  palette[this.colour[j]%palette.length];
            /*console.log(dataset.data[j][xcol]);
            console.log(dataset.data[j][ycol]);*/
            x1 = this.mapX(dataset.data[j][xcol]);
            y1 = this.mapY(dataset.data[j][ycol]);  
            /*console.log(dataset.data[j]);
            console.log(x1);
            console.log(y1);
            console.log(colour);*/
            this.drawPoint(x1, y1, colour);          
        }
    }
    
    this.drawLines = function(){
        var x2, y2, colour;
        
        var prevx = [];
        var prevy = [];

        
        console.log(this.groupLookup.length);
        console.log(this.groupLookup);
        console.log(this.group);
        for (var j = 0; j < this.groupLookup.length; ++j){
            prevx.push(false);
            prevy.push(false);
        }
        
        for(var j = 0; j < dataset.data.length; ++j){
            colour =  palette[this.colour[j]%palette.length];
            x2 = this.mapX(dataset.data[j][xcol]);
            y2 = this.mapY(dataset.data[j][ycol]);
            if(prevx[this.group[j]]!=false)
            {
                //first point in its group               
                this.drawLine(prevx[this.group[j]], prevy[this.group[j]] , x2, y2, colour);                 
            }   
            
            prevx[this.group[j]] = x2;
            prevy[this.group[j]] = y2;
        }

    }
    
 
} 
