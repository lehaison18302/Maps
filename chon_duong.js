document.addEventListener("DOMContentLoaded", function() {
  const similarStreets = [];

  function findLongestCommonSubstring(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array.from(Array(m + 1), () => Array(n + 1).fill(0));
    let maxLength = 0;
    let endIndex = 0;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
          if (dp[i][j] > maxLength) {
            maxLength = dp[i][j];
            endIndex = i - 1;
          }
        }
      }
    }

    return str1.substr(endIndex - maxLength + 1, maxLength);
  }

  function findSimilarStreetNames() {
    const inputvl = document.getElementById("tenDuong");
    const submitButton = document.getElementById("submitButton");

    submitButton.addEventListener("click", function() {
      const inputValue = inputvl.value;
      similarStreets.length = 0; // Xóa các phần tử trong mảng similarStreets

      // Đoạn mã JavaScript để tìm kiếm các tên đường tương tự
      const rawData = fs.readFileSync('duong_2.json');
      const data = JSON.parse(rawData);

      for (const street of data) {
        const streetName = street.tenDuong.toLowerCase();
        const inputName = inputValue.toLowerCase();

        const commonSubstring = findLongestCommonSubstring(streetName, inputName);

        if (commonSubstring.length >= Math.min(streetName.length, inputName.length) * 0.5) {
          similarStreets.push(street);
        }
      }

      if (similarStreets.length > 0) {
        const table = document.getElementById('table-striped');
        const tbody = table.querySelector('tbody');
       // tbody.innerHTML = ""; 

        similarStreets.forEach(street => {
          const row = document.createElement('tr');

          const ID = document.createElement('td');
          ID.textContent = street.id;
          row.appendChild(ID);

          const tenDuong = document.createElement('td');
          tenDuong.textContent = street.tenDuong;
          row.appendChild(tenDuong);

          const listCanh = document.createElement('td');
          listCanh.textContent = street.listCanh;
          row.appendChild(listCanh);

          tbody.appendChild(row);
        });

        //danhSachNha();
      } else {
        const table = document.getElementById('table-striped');
        const paragraph = document.createElement('p');
        paragraph.textContent = 'Không tìm thấy tên đường gần đúng';

        // Xóa các phần tử con của table-striped (nếu có)
        while (table.firstChild) {
          table.firstChild.remove();
        }

        table.appendChild(paragraph);
      }
    });
  }

  function danhSachNha() {
    const rawData = fs.readFileSync('canh_2.json');
    const data = JSON.parse(rawData);
    const resultContainer = document.getElementById('results');
    resultContainer.innerHTML = ""; // Xóa nội dung hiện tại của resultContainer

    similarStreets.forEach(street => {
      street.listCanh.forEach(canh => {
        const matchedCanh = data.find(item => item.canh === canh);

        if (matchedCanh) {
          const listSoNha = document.createElement('p');
          listSoNha.textContent = matchedCanh.listSoNha;
          resultContainer.appendChild(listSoNha);
        }
      });
    });
  }

  findSimilarStreetNames();
});
