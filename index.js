var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
function drawRoad(listPoints) {
  ctx.clearRect(0, 0, 10000, 100000); // Xóa đường vẽ cũ
  ctx.beginPath();
  ctx.shadowBlur = 10;
  ctx.shadowColor = "red";
  ctx.lineWidth = 5; // độ rộng nét
  ctx.strokeStyle = "red"; // màu nét
  ctx.moveTo(listPoints[0].x, listPoints[0].y); // Di chuyển đến điểm xp
  for (var i = 1; i < listPoints.length; i++) {
    ctx.lineTo(listPoints[i].x, listPoints[i].y); // Vẽ lần lượt 
  }
  ctx.stroke();

  // điểm đầu
  ctx.beginPath();
  ctx.arc(listPoints[0].x, listPoints[0].y, 5, 0, 2 * Math.PI);
  ctx.lineWidth = 6;
  ctx.shadowBlur = 10;
  ctx.shadowColor = "blue";
  ctx.strokeStyle = "white";
  ctx.stroke();
  ctx.fillStyle = "blue";
  ctx.fill();

  // điểm cuối
  ctx.beginPath();
  ctx.arc(
    listPoints[listPoints.length - 1].x,
    listPoints[listPoints.length - 1].y,
    2,
    0,
    2 * Math.PI
  );

  ctx.lineWidth = 12;
  ctx.shadowBlur = 10;
  ctx.shadowColor = "black";
  ctx.strokeStyle = "white";
  ctx.stroke();
  ctx.fillStyle = "black";
  ctx.fill();
}

class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  getLeftChildIndex(parentIndex) {
    return 2 * parentIndex + 1;
  }

  getRightChildIndex(parentIndex) {
    return 2 * parentIndex + 2;
  }

  getParentIndex(childIndex) {
    return Math.floor((childIndex - 1) / 2);
  }

  hasLeftChild(index) {
    return this.getLeftChildIndex(index) < this.heap.length;
  }

  hasRightChild(index) {
    return this.getRightChildIndex(index) < this.heap.length;
  }

  hasParent(index) {
    return this.getParentIndex(index) >= 0;
  }

  leftChild(index) {
    return this.heap[this.getLeftChildIndex(index)];
  }

  rightChild(index) {
    return this.heap[this.getRightChildIndex(index)];
  }

  parent(index) {
    return this.heap[this.getParentIndex(index)];
  }

  swap(indexOne, indexTwo) {
    const temp = this.heap[indexOne];
    this.heap[indexOne] = this.heap[indexTwo];
    this.heap[indexTwo] = temp;
  }

  peek() {
    if (this.heap.length === 0) {
      return null;
    }
    return this.heap[0];
  }

  remove() {
    if (this.heap.length === 0) {
      return null;
    }
    const item = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.pop();
    this.heapifyDown();
    return item;
  }

  add(item) {
    this.heap.push(item);
    this.heapifyUp();
  }

  heapifyUp() {
    let index = this.heap.length - 1;
    while (this.hasParent(index) && this.parent(index).f > this.heap[index].f) {
      this.swap(this.getParentIndex(index), index);
      index = this.getParentIndex(index);
    }
  }

  heapifyDown() {
    let index = 0;
    while (this.hasLeftChild(index)) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      if (
        this.hasRightChild(index) &&
        this.rightChild(index).f < this.leftChild(index).f
      ) {
        smallerChildIndex = this.getRightChildIndex(index);
      }
      if (this.heap[index].f < this.heap[smallerChildIndex].f) {
        break;
      } else {
        this.swap(index, smallerChildIndex);
      }
      index = smallerChildIndex;
    }
  }
}

function findRoad(startName, endName, jsonData) {
  var dinhs = jsonData;
  var start = dinhs[startName - 1];
  var goal = dinhs[endName - 1];
  console.log(start);
  console.log(goal);

  function reconstruct_path(cameFrom, current) {
    var dinh = current.tenDinh;
    var total_path = [dinh];
    while (dinh != cameFrom[dinh]) {
      dinh = cameFrom[dinh];
      total_path.unshift(dinh);
    }

    return total_path;
  }

  //A*
  function A_Star(start, goal, h) {
    var openSet = new PriorityQueue();
    var cameFrom = [];
    var gScore = []; 
    var fScore = []; 

    dinhs.forEach((dinh) => {
      fScore[dinh.tenDinh] = 1000000;
      gScore[dinh.tenDinh] = 1000000;
    });
    gScore[start.tenDinh] = 0; 
    fScore[start.tenDinh] = h(start); 
    cameFrom[start.tenDinh] = start.tenDinh;
    openSet.add({ dinh: start, f: fScore[start.tenDinh] }); 
    var isInOpenSet = [];
    isInOpenSet[start.tenDinh] = true;

    while (openSet.peek() != null) {
      var current = openSet.peek(); 
      current = current.dinh;
      if (current === goal) {
        return [reconstruct_path(cameFrom, current), fScore[goal.tenDinh]]; 
      }
      openSet.remove(); 
      isInOpenSet[current.tenDinh] = false;
      current.listDinhKe.forEach(({ tenDinh, doDai }) => {
        var neighbor = dinhs[tenDinh - 1];
        var tentative_gScore = gScore[current.tenDinh] + doDai; 
        if (tentative_gScore < gScore[neighbor.tenDinh]) {
          cameFrom[neighbor.tenDinh] = current.tenDinh;
          gScore[neighbor.tenDinh] = tentative_gScore;
          fScore[neighbor.tenDinh] = tentative_gScore + h(neighbor); 
          if (!isInOpenSet[neighbor.tenDinh]) {
            openSet.add({ dinh: neighbor, f: fScore[neighbor.tenDinh] });
            isInOpenSet[neighbor.tenDinh] = true;
          }
        }
        return null;
      });
    }
  }

  function h(dinh) {
    var dx = dinh.toaDo[0] - goal.toaDo[0];
    var dy = dinh.toaDo[1] - goal.toaDo[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  var result = A_Star(start, goal, h);
  var roadLength = result[1]; 
  var roadPoints = result[0];
  var listPoints = [];
  roadPoints.forEach((e) => {
    listPoints.push({ x: dinhs[e - 1].toaDo[0], y: dinhs[e - 1].toaDo[1] });
  });
  return {'listPoints': listPoints, 'roadLength': roadLength};
}

async function getJSONData() {
  const response = await fetch(
    "https://raw.githubusercontent.com/lehaison18302/Maps/main/giao_diem.json"
  );
  var jsonData = await response.json();
  var btn = document.getElementById("search");
  btn.addEventListener("click", (e) => {
    var startName = Number(document.getElementById("startName").value);
    var endName = Number(document.getElementById("endName").value);
    var result = findRoad(startName, endName, jsonData);
    drawRoad(result.listPoints);
  });
}
getJSONData();
