/* 베너의 이미지를 관리하는 데이터베이스 입니다.  */

module.exports = function (sequelize, dataTypes){
    const banner = sequelize.define("Banner", {
        /* 배너 이미지가 저장되어져 있는 경로가 저장되는 속성입니다. */
        imageUrl:{
            type: dataTypes.STRING(300),
            allowNull: false,
        },
        /* 배너를 클릭할때 이동하는 경로를 나타내는 속성입니다. */
        href: {
            type:dataTypes.STRING(200),
            allowNull: false,
        }
    })
    return banner;
}