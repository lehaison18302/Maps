const fs = require('fs');
const readline = require('readline');
const { Stream } = require('stream');
let Canh_receive = [];
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

function findSimilarStreetNames(input) {
  // Đọc dữ liệu từ file JSON
  const rawData = fs.readFileSync('duong_2.json');
  const data = JSON.parse(rawData);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Nhập tên đường: ', (input) => {
    var n = 0

    // Kiểm tra từng tên đường trong dữ liệu
    for (const street of data) {
      const streetName = street.tenDuong.toLowerCase();
      const inputName = input.toLowerCase();

      // Tìm xâu con lớn nhất giữa tên đường và dữ liệu nhập vào
      const commonSubstring = findLongestCommonSubstring(streetName, inputName);

      // Nếu xâu con lớn nhất có độ tương đồng đủ lớn, thêm tên đường vào danh sách
      if (commonSubstring.length >= Math.min(streetName.length, inputName.length) * 0.5) {
        similarStreets.push(street.id);
        similarStreets.push(street.tenDuong);
        similarStreets.push(street.listCanh);
      }
    }

    if (similarStreets.length > 0) {
      console.log('Các đường tương tự:');
      for (let i=0;i<similarStreets.length;i+=3) {
        console.log(similarStreets[i],".",similarStreets[i+1]);
        danhSachNha(i);
      }
    } else {
      console.log('Không tìm thấy tên đường gần đúng');
    }

    rl.close();
  });
}

function danhSachNha(Canh_receive){
  
  const rawData2 = fs.readFileSync('canh_2.json');
  const data2 = JSON.parse(rawData2);
  for (var j = 0; j < similarStreets[Canh_receive+2].length; j++) {
    const value = similarStreets[Canh_receive+2][j];
    for (const streetName of data2){
      if (streetName.canh == value) console.log(streetName.listSoNha);
    }
  }
}


findSimilarStreetNames();
