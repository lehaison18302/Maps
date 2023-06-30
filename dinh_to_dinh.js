const fs = require('fs');

// Đọc dữ liệu từ file JSON
const rawData = fs.readFileSync('giao_diem.json');
const graph = JSON.parse(rawData);

// Hàm tìm kiếm đường đi sử dụng BFS
function bfs(startVertex, endVertex) {
  // Kiểm tra đỉnh đầu và đỉnh cuối có tồn tại trong đồ thị không
  const startExists = graph.some(vertex => vertex.tenDinh === startVertex);
  const endExists = graph.some(vertex => vertex.tenDinh === endVertex);
  if (!startExists || !endExists) {
    console.log('Đỉnh đầu hoặc đỉnh cuối không tồn tại trong đồ thị');
    return [];
  }

  // Khởi tạo hàng đợi và mảng visited
  const queue = [];
  const visited = new Set();

  // Đưa đỉnh đầu vào hàng đợi và đánh dấu là đã visited
  queue.push(startVertex);
  visited.add(startVertex);

  // Lưu các đỉnh cha để truy vết đường đi
  const parent = {};
  parent[startVertex] = null;

  // Bắt đầu BFS
  while (queue.length > 0) {
    const currentVertex = queue.shift();

    // Kiểm tra nếu đã đến đỉnh cuối
    if (currentVertex === endVertex) {
      // Truy vết đường đi từ đỉnh cuối đến đỉnh đầu
      const path = [];
      let vertex = endVertex;
      while (vertex !== null) {
        path.unshift(vertex);
        vertex = parent[vertex];
      }
      return path;
    }

    // Lấy danh sách các đỉnh kề của đỉnh hiện tại
    const currentVertexData = graph.find(vertex => vertex.tenDinh === currentVertex);
    if (!currentVertexData) {
      console.log(`Không tìm thấy đỉnh ${currentVertex}`);
      continue; // Bỏ qua đỉnh hiện tại và chuyển sang đỉnh tiếp theo
    }
    const adjacentVertices = currentVertexData.listDinhKe;

    // Duyệt qua các đỉnh kề chưa visited
    for (const adjacentVertex of adjacentVertices) {
      if (!visited.has(adjacentVertex.tenDinh)) {
        queue.push(adjacentVertex.tenDinh);
        visited.add(adjacentVertex.tenDinh);
        parent[adjacentVertex.tenDinh] = currentVertex;
      }
    }
  }

  // Nếu không tìm thấy đường đi từ đỉnh đầu đến đỉnh cuối
  console.log('Không tìm thấy đường đi');
  return [];
}

// Thử tìm đường đi từ đỉnh 1 đến đỉnh 4
const path = bfs(1, 22);
console.log('Đường đi:', path);
