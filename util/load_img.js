// 加载图片
var imgs = ['b_c.png', 'b_j.png', 'b_m.png', 'b_p.png', 'b_s.png', 'b_x.png', 'b_z.png', 'bg.png', 'bg.jpg', 'dot.png', 'r_box.png',
  'r_c.png', 'r_j.png', 'r_m.png', 'r_p.png', 'r_s.png', 'r_x.png', 'r_z.png'];

var imgObjects = [];
var loadCount = 0;
function listener() {
    loadCount++;
    if (loadCount >= imgs.length) {
        main();
    }
}

imgs.forEach(function (imgurl) {
    var img = new Image();
    img.addEventListener('load', listener);
    img.src = './img/' + imgurl;
    imgObjects.push(img);
});