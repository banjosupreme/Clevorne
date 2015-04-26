var clevorne = function(pane, dataset, xcol, ycol){

    var palette = ["blue", "red", "orange", "green", "purple", "orange", "darkturquoise", "deeppink"];

    this.paneHeight = pane.getAttribute("height");
    this.paneWidth = pane.getAttribute("width");
    this.xcol = xcol;
    this.ycol = ycol;
    this.annotation = false;
   
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
    this.yrange = this.ymax - this.ymin;
    this.xrange = this.xmax - this.xmin;
    

    this.mapX = function(value){
        return 0.06*this.paneWidth + (value - this.xmin)*0.88*this.paneWidth/this.xrange;    
    }
    this.mapY = function(value){ 
        return 0.06*this.paneHeight + (this.ymax - value)*0.88*this.paneHeight/this.yrange;
    }
    

    
    this.drawPoint =  function(x,y,colour, infoString){
        var point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        if(infoString!=false)
        {
            var info = document.createElementNS("http://www.w3.org/2000/svg","title")
            info.textContent = infoString;
            point.appendChild(info);
        }
        
        point.setAttribute('cx', x);
        point.setAttribute('cy', y);
        point.setAttribute('r', 6);
        point.setAttribute('stroke-width',1);
        point.style.fill = colour;
        point.style.stroke="black";
        point.style.opacity = 1.0;
        
        
        
        
        pane.appendChild(point);
    }
    
    this.drawRectangle = function(x,y,width,height,colour,infoString){
        var rectangle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        
        if(infoString!=false)
        {
            var info = document.createElementNS("http://www.w3.org/2000/svg","title")
            info.textContent = infoString;
            rectangle.appendChild(info);
        }
       
        rectangle.setAttribute('x',x);
        rectangle.setAttribute('y',y);
        rectangle.setAttribute('width', width);
        rectangle.setAttribute('height', height);
        rectangle.style.fill = colour;
        rectangle.style.stroke = "black";
        rectangle.style.opacity = 1.0;
        pane.appendChild(rectangle);
        
    
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
        this.position = new Array(dataset.data.length);
        
        for(var j = 0; j < dataset.data.length; ++j){
            this.group[j] = this.colour[j] = 0;
        }
        this.groupLookup = [];
        this.colourLookup = []; 
        this.positionLookup = [];

    }

    this.initializeGroupsAndColours();


    this.groupBy = function(groupCol){
        
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
    
    this.positionBy = function(positionCol){
        //again same as the two above. Really should clean this up.
        var testVal;
        for(var j = 0; j < dataset.data.length; ++j){
            testVal = this.indexOf(dataset.data[j][positionCol], this.positionLookup);
            if (testVal == -1){
                this.position[j] = this.positionLookup.length;
                this.positionLookup.push(dataset.data[j][positionCol]);
            }
            else{
                this.position[j] = testVal;
            }
        }
    
    
    }
    
     this.drawScatter = function(){
        var x1, y1, colour;
        
        for(var j = 0; j < dataset.data.length; ++j){
            colour =  palette[this.colour[j]%palette.length];
            x1 = this.mapX(dataset.data[j][xcol]);
            y1 = this.mapY(dataset.data[j][ycol]);  
            
            if(this.annotation){
                var title = this.annotationFunction(dataset.data[j]);
                this.drawPoint(x1, y1, colour, title);
            }
            else
            {
                this.drawPoint(x1, y1, colour);
            }
        }
    }
    
    this.barYScale = function(value, max, range){
        return 0.06*this.paneHeight + (max - value)*0.88*this.paneHeight/range;
    }
    
    this.barXPos = function(xposition, relPosition, padding, barWidth, indent, numPositions){
            return indent + xposition*padding + xposition*numPositions*barWidth + relPosition*barWidth;
    }
    
    this.drawBars = function(){
    
        var values = [];
        var padding = 15;
        
        var indexOfX = [];
        var testVal;
        for(var j = 0; j < dataset.data.length; ++j){
            testVal = this.indexOf(dataset.data[j][xcol], indexOfX);
            if(testVal == -1){
                indexOfX.push(dataset.data[j][xcol]);
            }
            
        }
        
        var numPositions = this.positionLookup.length;
        var numX = indexOfX.length;
        var barMax = Math.max(0,this.ymax);
        var barMin = Math.min(0,this.ymin);
        var barRange = barMax - barMin;
        
        
        var numBars = numPositions*numX;
        var barWidth = (this.paneWidth*0.8 - (numX-1)*padding)/numBars;
        var indent = this.paneWidth*0.1;
        
        var zeroLoc = this.barYScale(0, barMax, barRange);
        this.drawLine(0.05*this.paneWidth,zeroLoc, 0.95*this.paneWidth, zeroLoc, "lightgray");
        
        
        
        
        var xposition, relPosition, xloc, yloc, height, yval, colour;
        
        for(var j =0; j < dataset.data.length; ++j){
            xposition = this.indexOf(dataset.data[j][xcol], indexOfX);
            relPosition = this.position[j];
            xloc = this.barXPos(xposition, relPosition, padding, barWidth, indent, numPositions);
            yval = dataset.data[j][ycol];
            colour =  palette[this.colour[j]%palette.length];
            if(yval >= 0)
            {
                yloc = this.barYScale(yval, barMax, barRange);
                height = zeroLoc - yloc;    
            }
            else{
                yloc = zeroLoc;
                height = this.barYScale(yval, barMax, barRange) - zeroLoc;
            }
            var title = this.annotationFunction(dataset.data[j]);
            this.drawRectangle(xloc,yloc,barWidth,height,colour,title);
        }
        
        
        
    
    
    }
    
    this.drawLines = function(){
        var x2, y2, colour;
        
        var prevx = [];
        var prevy = [];

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
    
    this.addAnnotation = function(infunc){
        this.annotation = true;
        this.annotationFunction = infunc;
    }
    
 
} 
