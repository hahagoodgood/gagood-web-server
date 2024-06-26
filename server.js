const express = require("express");
const cors = require("cors"); //node 서버에서의 cors 이슈를 해결
const app = express();
const models = require("./models"); //sequeilze init을 통해 설치된 models를 이용하여 sequelize 실행
const multer = require("multer"); //파일 처리 라이브러리 multer
const upload = multer({
  storage: multer.diskStorage({
    /* 파일 저장 경로 */
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    /* 파일 저장 이름  */
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
}); //이미지를 저장하는 파일 uploads/
const port = 8080;

app.use(express.json()); //express서버 설정
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/banners", (req, res) => {
  models.Banner.findAll({
    limit: 5,
  })
    .then((result) => {
      res.send({
        banners: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("에러가 발생하였습니다.");
    });
});

//get방식으로 서버요청시 사용되는 함수의 람다식 표현
app.get("/products", (req, res) => {
  models.Product.findAll({
    order: [["createdAt", "DESC"]], //정렬하는 기준 order by
    attributes: ["id", "name", "price", "createdAt", "seller", "imageUrl"], //전송할 속성 값
  })
    .then((result) => {
      console.log("PRODUCTS :", result);
      res.send({ products: result });
    })
    .catch((error) => {
      console.error(error);
      res.send("에러 발생");
      res.status(400).send("에러 발생");
    });
});

//post방식으로 서버요청시 사용되는 함수의 람다식 표현
app.post("/products", (req, res) => {
  const body = req.body;
  const { name, description, price, seller, imageUrl } = body;
  if (!name || !description || !price || !seller || !imageUrl) {
    res.status(400).send("모든 필드를 입력해주세요");
  }
  models.Product.create({
    //모델을 받아 객체 생성
    name, //key값이랑 변수명이 같기에 "name": name을 축약해서 표현
    description,
    price,
    seller,
    imageUrl,
  })
    .then((result) => {
      console.log("상품 생성 결과 : ", result);
      res.send({
        result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("상품 업로드에 문제가 발생했습니다");
    });
});

app.get("/products/:id", (req, res) => {
  const params = req.params; //request 객체의 파라미터 값을 저장하는 변수
  const { id } = params;
  models.Product.findOne({
    where: {
      id: id,
    },
  })
    .then((result) => {
      console.log("PRODUCT :", result);
      res.send({
        product: result,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send("상품 조회에 에러가 발생했습니다.");
    });
});

//이미지를 보낼때 이미지 파일 multer에서 설정한 곳에 multer에서 single사용하여 저장하고 저장한 이미지 경로를 반환
app.post("/image", upload.single("image"), (req, res) => {
  const file = req.file;
  console.log(file);
  res.send({
    imageUrl: file.path,
  });
});

/* 서버의 요청을 기다리는 명령어 */
app.listen(port, () => {
  console.log("그랩의 쇼핑몰 서버가 돌아가고 있습니다.");
  models.sequelize
    .sync() //db와 동기화 해주는 작업
    .then(() => {
      console.log("DB 연결 성공!");
    })
    .catch((err) => {
      console.error(err);
      console.log("DB 연결 에러");
      process.exit();
    });
});
