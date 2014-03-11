function BinaryHeapNode(value)
{
	this.left = this.right = this.parent = null;
	this.value = value;
}

function BinaryHeap()
{
	this.root = this.lastNode = null;
	this.count = 0;
	
	this.isEmpty = function isEmpty()
	{
		return this.root == null;
	}
	
	this.peekNext = function peekNext()
	{
		if (this.root == null) 
			return null;
		return this.root.value;
	}

	this.removeMin = function removeMin()
	{
		if (this.isEmpty())
		{
			return null;
		}
		var minValue = this.root.value;
		if (this.count == 1)
		{
			this.root = null;
			this.lastNode = null;
		}
		else
		{
			var next_last = this.getNewLastNode();
			if (this.lastNode.parent.left == this.lastNode)
			{
				this.lastNode.parent.left = null;
			}
			else
			{
				this.lastNode.parent.right = null;
			}
			this.root.value = this.lastNode.value;
			this.lastNode = next_last;
			this.heapifyRemove();
		}
		--this.count;
		return minValue;
	}
	
	this.getNewLastNode = function getNewLastNode()
	{
		var result = this.lastNode;
		
		while(result != this.root &&
				result.parent.left == result)
		{	
			result = result.parent;
		}
			
		if (result != this.root)
		{
			result = result.parent.left;
		}
		while (result.right != null)
		{
			result = result.right;
		}
		return result;
	}
	
	this.heapifyRemove = function heapifyRemove()
	{
		if (this.root == null)
		{
			return;
		}
		var node = null;
		var next = this.root;
		do
		{
			if (node != null)
			{
				var temp = node.value;
				node.value = next.value;
				next.value = temp;
			}
			node = next;
			
			var left = node.left;
			var right = node.right;
			
			if (left == null && right == null)
			{
				next = null;
			}
			else if (left == null)
			{
				next = right;
			}
			else if (right == null)
			{
				next = left;
			}
			else if (left.value < right.value)
			{
				next = left;
			}
			else
			{
				next = right;
			}
		} while (next != null &&
					next.value < node.value);
	}
	
	this.insert = function insert(node)
	{
		if (this.root == null)
		{
			this.root = node;
		}
		else
		{
			var parentOfNextAdd = this.findParentOfNextAdd()
			if (parentOfNextAdd.left == null)
			{
				parentOfNextAdd.left = node;
			}
			else
			{
				parentOfNextAdd.right = node;
			}
			node.parent = parentOfNextAdd;
		}
		this.lastNode = node;
		++this.count;
		
		if (this.count > 1)
		{
			this.heapifyAdd();
		}
	}
	
	this.heapifyAdd = function heapifyAdd()
	{
		var next = this.lastNode;
		
		while (next != this.root &&
				next.value < next.parent.value)
		{
			var temp = next.value;
			next.value = next.parent.value;
			next.parent.value = temp;
			next = next.parent;
		}
	}
	
	this.findParentOfNextAdd = function findParentOfNextAdd()
	{
		var result = this.lastNode;
		
		while (result != this.root && 
			result.parent.left != result)
		{
			result = result.parent;
		}
		if (result == this.root)
		{
			while (result.left != null)
			{
				result = result.left;
			}
		}
		else
		{
			if (result.parent.right == null)
			{
				result = result.parent;
			}
			else
			{
				result = result.parent.right;
				while (result.left != null)
				{
					result = result.left;
				}
			}
		}
		return result;	
	}
}