(function(){

    function getTimeString(num){
        var d = new Date();
        d.setTime(num);
        var day = [
            d.getFullYear(),
            pad(d.getMonth() + 1),
            pad(d.getDate())
        ].join('-');
        var time = [
            pad(d.getHours()),
            pad(d.getMinutes()),
            pad(d.getSeconds())
        ].join(':');
        return day + ' ' + time;
    }

    function pad(str){
        return ('0' + str).substr(-2);
    }

    function getDiff(item, last){
        return [
            item.root, 'diff',
            last + '-' + item.time + '.png'
        ].join('/');
    }

    var router = {
        show: function(path){
            $.get('/info', {path: path}, function(data){
                if(data.status === 0){
                    var html = '<table><tr>';
                    var last;
                    data.object.list.forEach(function(item){
                        var attr = last ? ' data-diff="' + getDiff(item, last) + '"' : '';
                        html += '<td>';
                        html += '<div class="screenshot">';
                        html += '<div class="title">' + getTimeString(item.time) + '</div>';
                        html += '<img src="/' + item.screenshot + '"' + attr + '>';
                        html += '</div>';
                        html += '</td>';
                        last = item.time;
                    });
                    html += '</tr></table>';
                    $('#list').html(html);
                    $('#diff').html('');
                } else {
                    console.error(data.message);
                }
            }, 'json');
        }
    };

    function onhashchange(){
        var hash = location.hash;
        if(/^#!\//.test(hash)){
            hash = hash.substring(3);
            var pos = hash.indexOf('/');
            var method = 'index';
            var param = '';
            if(pos > 0){
                method = hash.substring(0, pos);
                param = hash.substring(pos + 1);
            }
            if(router.hasOwnProperty(method)){
                router[method](param);
            }
        }
    }
    if ('addEventListener' in window) {
        window.addEventListener('hashchange', onhashchange, false);
    } else {
        window.onhashchange = onhashchange;
    }
    onhashchange();

    $('#list').click('img[data-diff]', function(e){
        var diff = $(e.target).attr('data-diff');
        if(diff){
            $('#diff').html('<img src="/' + diff + '">');
        } else {
            $('#diff').html('<span>没有对比数据</span>');
        }
    });
})();