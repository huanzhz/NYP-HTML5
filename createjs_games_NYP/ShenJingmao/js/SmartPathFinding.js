function SmartPathFinding() {

	//six directions are lt, rt, l, r, lb, rb
	this.catOriginalTile = 0;
		this.DIRECTION = {
			
			TOP_LEFT: 1,
			TOP_RIGHT:2,
			LEFT: 3,
			RIGHT:4,
			BOTTOM_LEFT: 5,
			BOTTOM_RIGHT:6,
			NO_DIRECTION: 7
		}
	
		this.smallestValue = 0;
		this.shortestPathIndex = 0;
		
		this.pathList = [];
		
		this.NumberOfStepOfEachDirection = [];
		
		for(var i = 0 ; i < 6;i++ ){
			this.NumberOfStepOfEachDirection.push(-1);
		}
}



SmartPathFinding.prototype.findPathStep = function(map, seed , index , start , end) {
    var seed = (seed != undefined) ? seed : map.catTile;
	this.NumberOfStepOfEachDirection[index] += 1;
    if(map.isCellClicked(seed)) {
        return false;
    } else if(UtilCheck.outOfBound(seed)) {
		this.pathList.push(new Path(this.NumberOfStepOfEachDirection[index] , index ) );
		this.NumberOfStepOfEachDirection[index] -= 1;
        return true;
    }
    else {
        map.markCellColored(seed);
        var surrounding = map.getSurroundingTiles(seed);
		var temp = start;
		while(temp != end ){
            var tile = surrounding[temp];
            if(!map.isCellClicked(tile) && tile != map.catTile){
                this.findPathStep(map, tile , index , start , end)
            }
			temp++;
			if (temp > surrounding.length - 1 && end != surrounding.length ){
				temp = 0;
			}
        }
    }
	this.NumberOfStepOfEachDirection[index] -= 1;
	return false;
};

SmartPathFinding.prototype.getSmallerStep = function(value , index) {
	if(this.smallestValue == 0 &&  value > 0){
		this.smallestValue = value;
		this.shortestPathIndex = index;
	}
	
	if(value < this.smallestValue && value > 0){
		this.smallestValue = value;
		this.shortestPathIndex = index;
	}
 };

SmartPathFinding.prototype.findPathLy = function(map) {
    function Node(tile) {
        this.tile = tile;
        this.branches = [];
        this.wayOutBranch = null;
        this.record = [];
        this.updateWayOut = function(branch){
            if(!this.wayOutBranch || this.wayOutBranch.nodes.length > branch.nodes.length){
                this.wayOutBranch = branch;
                this.record = [branch];
            } else if(this.wayOutBranch && this.wayOutBranch.nodes.length == branch.nodes.length) {
                this.record.push(branch);
            }
        };

        this.addBranch = function(branch){
            this.branches.push(branch);
        };
    }

    function Branch() {
        this.nodes = [];
        this.isWayOut = false;
        this.endNode = null;
        this.addNode = function(node){
            node.addBranch(this);
            this.nodes.push(node);
            this.endNode = node;
        };
        this.clone = function(){
            var b = new Branch();
            b.nodes = this.nodes.concat();
            b.isWayOut = this.isWayOut;
            for(var i=0; i<b.nodes.length; ++i){
                b.nodes[i].addBranch(b);
            }
            return b;
        };
        this.markWayOut = function(){
            this.isWayOut = true;
            for(var i=0; i<this.nodes.length; ++i){
                this.nodes[i].updateWayOut(this);
            }
        }
    }
    function pf(map, node, root){
        if(UtilCheck.checkWeiZhu(map.clone(), node.tile))
            return;

        root || (root = node);

        map.markCellColored(node.tile);
        var surrounding = map.getSurroundingTiles(node.tile);
        for(var i=0; i<  surrounding.length; ++i){
            var tile = surrounding[i];
            if(!map.isCellClicked(tile)) {
                var subNode = new Node(tile);
                var branch = node.branches[0].clone();
                branch.addNode(subNode);
                if(root.wayOutBranch && branch.nodes.length >= root.wayOutBranch.nodes.length)
                    break;
                else if(UtilCheck.outOfBound(tile)){
                    branch.markWayOut();
                } else {
                    pf(map.clone(), subNode, root);
                }
            }
        }
    }

    var root = new Node(map.catTile);
    var route = new Branch();
    route.addNode(root);

    if(UtilCheck.checkWeiZhu(map.clone())) {
        console.log('trapped');
    }else {
        pf(map, root);
        var direct = 0;
        var sur = map.getSurroundingTiles(root.tile);
        var branch = BOK.randArrayItem(root.record);
        BOK.each(sur, function(tile, index){
            if(tile == branch.nodes[1].tile){
                direct = index + 1;
                return BOK.BREAK;
            }
        });
        console.log((root.wayOutBranch.nodes.length-1)+'@'+direct);
    }
};

SmartPathFinding.prototype.findPath = function(map) {
    var t = new Date().getTime();
    this.findPathLy(map.clone());
    console.log('algorithm elapse: '+(new Date().getTime() - t));

    t = new Date().getTime();
  if( ! UtilCheck.outOfBound(map.catTile)){
		
		this.smallestValue = 0;
		this.shortestPathIndex = 0;
		
		this.pathList = [];
	  
		var surrounding = map.getSurroundingTiles(map.catTile);
	
		for(var i=0; i<  surrounding.length; ++i){
			for(var start=0; start<  surrounding.length; ++start){
				this.NumberOfStepOfEachDirection[i] = 0;
				var tile = surrounding[i];
				if(!map.isCellClicked(tile)){
					this.findPathStep(map.clone(),tile, i, start, surrounding.length - start );
				}
			  }
		  }
		  
		  for(var i = 0; i < this.pathList.length; i++ ){
			this.getSmallerStep(this.pathList[i].step_ , this.pathList[i].directionID_ + 1);
		  }
      console.log('Choose: '+this.smallestValue + '@'+this.shortestPathIndex);
      console.log('algorithm elapse: '+(new Date().getTime() - t));

		 if(this.shortestPathIndex  == this.DIRECTION.LEFT){
			return this.DIRECTION.LEFT;
		}else if( this.shortestPathIndex  == this.DIRECTION.TOP_LEFT){
			return this.DIRECTION.TOP_LEFT;
		}else if( this.shortestPathIndex  == this.DIRECTION.TOP_RIGHT){
			return this.DIRECTION.TOP_RIGHT;
		}else if(this.shortestPathIndex  == this.DIRECTION.RIGHT){
			return this.DIRECTION.RIGHT;
		}else if(this.shortestPathIndex  == this.DIRECTION.BOTTOM_RIGHT){
			return this.DIRECTION.BOTTOM_RIGHT;
		}else if(this.shortestPathIndex  == this.DIRECTION.BOTTOM_LEFT){
			return this.DIRECTION.BOTTOM_LEFT;
		}
	}

	return this.DIRECTION.NO_DIRECTION;
	  
};





