/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function grabPixels() {
    grabbed = []
    var map = document.getElementById('map')
    var zone = document.getElementById('zone')
    var playground = document.getElementById('tap')
    var visu = document.getElementById('cap')
    html2canvas(map, {
        onrendered: function(canvas) {processPixels(canvas, zone.offsetLeft, zone.offsetTop, zone.clientWidth, zone.clientHeight, visu, playground)},
        width: map.clientWidth,
        height: map.clientHeight,
        useCORS: true
    })
}

function processPixels(canvas, sx, sy, sw, sh, visu, playground) {
    var sctx = canvas.getContext("2d")
    var vctx = visu.getContext("2d")
    var dctx = playground.getContext("2d")
    // copy from source to destination context
    var sz = 20
    var step = sz/3
    var data = sctx.getImageData(sx, sy, sw, sh)
    vctx.putImageData(data, 0, 0)
    for (var y=0,dy=0; y+sz<=data.height; y+=step,dy+=sz+1)
        for (var x=0,dx=0; x+sz<=data.width; x+=step,dx+=sz+1) {
            tile = sctx.getImageData(sx+Math.floor(x), sy+Math.floor(y), sz, sz)
            //dctx.drawImage(canvas, x, y, sz, sz, dx, dy, sz, sz)
            dctx.putImageData(tile, dx, dy)
            grabbed.push(imageData2MLEngineFormat(tile))
        }
    document.getElementById("jap").innerText = JSON.stringify(grabbed)
}

function imageData2MLEngineFormat(image) {
    obj = []
    // outputting image in [x, y, rgb] format
    for (var x=0; x<image.width; x++)
        for (var y = 0; y < image.width; y++) {
            var offset = x + image.width * y * 4
            var r = image.data[offset]
            var g = image.data[offset + 1]
            var b = image.data[offset + 2]
            var a = image.data[offset + 3]
            obj.push([r, g, b])
        }
    return obj
}