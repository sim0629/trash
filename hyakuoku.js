(function() {
  'use strict';
  var app = angular.module('hyakuoku', ['ngCookies']);

  app.filter('hkColorBackgroundStyle', [
    'hkColor',
    function(hkColor) {
      return function(rgb) {
        return {
          'background-color': hkColor.rgb2color(rgb),
        };
      };
    }
  ]);

  app.factory('hkDish', [
    '$cookieStore', 'hkColor',
    function($cookieStore, hkColor) {
      var Dish = function() {
        this.rgb = [0, 0, 0];
        this.price = '0';
        this.name = '';
      };

      var newDish = function() {
        return new Dish();
      };

      var saveDishes = function(dishes) {
        $cookieStore.put('hkDishes', dishes);
      };

      var loadDishes = function() {
        var dishes = $cookieStore.get('hkDishes');
        if(!angular.isArray(dishes)) return;
        return dishes;
      };

      var findSimilarDish = function(uv) {
        var dishes = loadDishes();
        var i;
        var min_distance = Infinity, min_i = -1;
        for(i = 0; i < dishes.length; i++) {
          var dish_uv = hkColor.rgb2yuv(dishes[i].rgb).slice(1);
          var distance = Math.pow(uv[0] - dish_uv[0], 2) + Math.pow(uv[1] - dish_uv[1], 2);
          if(distance < min_distance) {
            min_distance = distance;
            min_i = i;
          }
        }
        return dishes[min_i];
      };

      return {
        newDish: newDish,
        saveDishes: saveDishes,
        loadDishes: loadDishes,
        findSimilarDish: findSimilarDish,
      };
    }
  ]);

  app.factory('hkColor', [
    function() {
      var rgb2yuv = function(rgb) {
        var r = rgb[0];
        var g = rgb[1];
        var b = rgb[2];
        return [
          ((  66 * r + 129 * g +  25 * b + 128) >> 8) + 16,
          (( -38 * r -  74 * g + 112 * b + 128) >> 8) + 128,
          (( 112 * r -  94 * g -  18 * b + 128) >> 8) + 128,
        ];
      };
      var yuv2rgb = function(yuv) {
        var y = yuv[0];
        var u = yuv[1];
        var v = yuv[2];
        var c = y - 16;
        var d = u - 128;
        var e = v - 128;
        var clip = function(n) {
          return Math.max(0, Math.min(255, n));
        };
        return [
          clip(( 298 * c           + 409 * e + 128) >> 8),
          clip(( 298 * c - 100 * d - 208 * e + 128) >> 8),
          clip(( 298 * c + 516 * d           + 128) >> 8),
        ];
      };
      var rgb2color = function(rgb) {
        return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
      };
      return {
        rgb2yuv: rgb2yuv,
        yuv2rgb: yuv2rgb,
        rgb2color: rgb2color,
      };
    }
  ]);

  app.directive('hkImg', [
    function() {
      return {
        restrict: 'A',
        scope: {
          hkImgLoaded: '&',
        },
        link: function($scope, $element, $attrs) {
          var canvas = $element[0];
          if(canvas.nodeName.toLowerCase() != 'canvas')
            throw 'hk-img: element is not a canvas';
          var image = new Image();
          image.src = $attrs.hkImg;
          image.onload = function() {
            canvas.width = image.width;
            canvas.height = image.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);
            if($scope.hkImgLoaded)
              $scope.hkImgLoaded({ 'id': $attrs.id });
            $scope.$apply();
          };
        },
      };
    }
  ]);

  app.controller('hk.SampleController', [
    '$scope', 'hkColor', 'hkDish',
    function($scope, hkColor, hkDish) {
      $scope.dishes = [];
      $scope.selectedIndex = -1;
      $scope.isSampling = false;
      var startX, startY;
      var endX, endY;

      $scope.getSquareStyle = function() {
        var panel = document.getElementById('sample-panel');
        var panelRect = panel.getBoundingClientRect();
        var left = Math.min(startX, endX) - panelRect.left;
        var top = Math.min(startY, endY) - panelRect.top;
        var width = Math.abs(startX - endX);
        var height = Math.abs(startY - endY);
        return {
          'left': left + 'px',
          'top': top + 'px',
          'width': width + 'px',
          'height': height + 'px',
        };
      };

      $scope.startSampling = function(event) {
        $scope.isSampling = true;
        startX = event.clientX;
        startY = event.clientY;
        endX = event.clientX;
        endY = event.clientY;
      };

      $scope.moveSampling = function(event) {
        if(!$scope.isSampling) return;
        endX = event.clientX;
        endY = event.clientY;
      };

      $scope.endSampling = function(event) {
        $scope.isSampling = false;
        sampleColor();
      };

      $scope.convertSample = function(id) {
        var canvas = document.getElementById(id);
        var ctx = canvas.getContext('2d');
        var origData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var convData = ctx.createImageData(canvas.width, canvas.height);
        var i, yuv, dish;
        for(i = 0; i < origData.data.length; i += 4) {
          yuv = hkColor.rgb2yuv([
            origData.data[i + 0],
            origData.data[i + 1],
            origData.data[i + 2],
          ]);
          dish = hkDish.findSimilarDish(yuv.slice(1));
          convData.data[i + 0] = dish.rgb[0];
          convData.data[i + 1] = dish.rgb[1];
          convData.data[i + 2] = dish.rgb[2];
          convData.data[i + 3] = 255;
        }
        ctx.putImageData(convData, 0, 0);
      };

      $scope.addItem = function() {
        $scope.dishes.push(hkDish.newDish());
      };

      $scope.removeItem = function(index) {
        if(index < $scope.selectedIndex)
          $scope.selectedIndex--;
        else if(index === $scope.selectedIndex)
          $scope.selectedIndex = -1;
        $scope.dishes.splice(index, 1);
      };

      $scope.selectItem = function(index) {
        $scope.selectedIndex = index;
      };

      var sampleColor = function() {
        if($scope.selectedIndex < 0) return;
        var canvas = document.getElementById('sample');
        var ctx = canvas.getContext('2d');
        var square = $scope.getSquareStyle();
        var data = ctx.getImageData(
          parseInt(square.left),
          parseInt(square.top),
          parseInt(square.width) + 1,
          parseInt(square.height) + 1
        ).data;
        var o;
        var u = [], v = [];
        for(o = 0; o < data.length; o += 4) {
          var rgb = [
            data[o + 0],
            data[o + 1],
            data[o + 2],
          ];
          var yuv = hkColor.rgb2yuv(rgb);
          u.push(yuv[1]);
          v.push(yuv[2]);
        }
        u.sort();
        v.sort();
        var mid_u = u[parseInt(u.length / 2)];
        var mid_v = v[parseInt(v.length / 2)];
        var sample_rgb = hkColor.yuv2rgb([128, mid_u, mid_v]);
        $scope.dishes[$scope.selectedIndex].rgb = sample_rgb;
      };

      $scope.saveDishes = function() {
        hkDish.saveDishes($scope.dishes);
      };

      var loadDishes = function() {
        $scope.dishes = hkDish.loadDishes();
      };

      loadDishes();
    }
  ]);

  app.controller('hk.PileController', [
    '$scope', 'hkColor', 'hkDish',
    function($scope, hkColor, hkDish) {
      var imageData;

      $scope.getImageData = function(id) {
        var canvas = document.getElementById(id);
        var width = canvas.width, height = canvas.height;
        var ctx = canvas.getContext('2d');
        imageData = ctx.getImageData(0, 0, width, height);
      };

      var apply = function(id, converter) {
        var canvas = document.getElementById(id);
        var width = canvas.width, height = canvas.height;
        var ctx = canvas.getContext('2d');
        var convData = ctx.createImageData(width, height);
        var i, yuv, yuv_c, rgb;
        for(i = 0; i < imageData.data.length; i += 4) {
          yuv = hkColor.rgb2yuv([
            imageData.data[i + 0],
            imageData.data[i + 1],
            imageData.data[i + 2],
          ]);
          yuv_c = converter(yuv);
          rgb = hkColor.yuv2rgb(yuv_c);
          convData.data[i + 0] = rgb[0];
          convData.data[i + 1] = rgb[1];
          convData.data[i + 2] = rgb[2];
          convData.data[i + 3] = 255;
        }
        ctx.putImageData(convData, 0, 0);
      };

      $scope.applyY = function(id) {
        apply(id, function(yuv) {
          return [yuv[0], 128, 128];
        });
      };

      $scope.applyBin = function(id) {
        apply(id, function(yuv) {
          return [yuv[0] < 128 ? 0 : 255, 128, 128];
        });
      };

      $scope.applyQuad = function(id) {
        apply(id, function(yuv) {
          return [parseInt(yuv[0] / 64) * 64, 128, 128];
        });
      };

      $scope.applyUV = function(id) {
        apply(id, function(yuv) {
          return [128, yuv[1], yuv[2]];
        });
      };

      $scope.applySample = function(id) {
        apply(id, function(yuv) {
          var dish = hkDish.findSimilarDish(yuv.slice(1));
          yuv = hkColor.rgb2yuv(dish.rgb);
          return [128, yuv[1], yuv[2]];
        });
      };

      $scope.applySGM = function(id) {
        apply(id, function(yuv) {
          return [yuv[0] < 128 ? 128 : 255, yuv[1], yuv[2]];
        });
      };

      $scope.applyOrig = function(id) {
        var canvas = document.getElementById(id);
        var width = canvas.width, height = canvas.height;
        var ctx = canvas.getContext('2d');
        ctx.putImageData(imageData, 0, 0);
      };
    }
  ]);
})();
