var http = require('http'); //http내장 서버 모듈
var hostname = '127.0.0.1'; //localhost ip 주소
var port = 8080; // 서버 포트번호


const server = http.createServer(function(req,res){ /* 서버를 만들어 주는 명령어 req는 요청 request*/
    const path = req.url;
    const method = req.method;
    if(path === "/products"){
        if(method == "GET"){//GET 방식 호출시
            res.writeHead(200, {"Content-Type": "application/json"});//해더에 코드를 200 전송될 데이터 타입을 json으로 설정
            /* res.end는 매개변수로 문자열이어야 한다. 그러니 Json 형식을 문자열로 변환하는 JSON.stringify를 사용하여 변환하는 코드이다. */
            const products = JSON.stringify([
                {
                    name: "농구공",
                    price: 5000
                }
            ]);
            res.end(products); //요청에 대한 반환
        } 
    }
    res.end("Good Bye");
});

server.listen(port, hostname); /* 서버의 요청을 기다리는 명령어 */

console.log('servser on')