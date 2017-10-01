(function( w ) {//2系列适配其他环境的写法也挺不错的，不过我就还是喜欢在里面写，毕竟是经典(￣▽￣)"

    var version = '1.0.0';//假装还有2.0.0版本  囧rz

    // 工厂
    function jQuery( selector ) {
        return new jQuery.fn.init( selector );//别被这句话蒙住了，我也不想这么写，好绕啊~~但是挨不住原作者脑洞大啊！！！
    }

    // 替换原型 + 原型简称，可以说祖师爷是有点奇葩了，没办法别人是祖师爷咯,,ԾㅂԾ,,
    jQuery.fn = jQuery.prototype = {
        constructor: jQuery,//一般替换了原型还是要指明一下构造函数，别让别人当孤儿，，，，孤儿

        // 获取版本号
        jquery: version,

        // 代表所有实例默认的选择器，也代表实例是一个jQuery类型的对象，可能这就是多余的吧---就像我注释里面的废话一样~~~~~~
        selector: '',

        // 代表所有实例默认的长度
        length: 0,

        // 把实例转换为数组返回
        toArray: function() {
            return [].slice.call( this );//call谁谁怀孕~~~呃呃呃好好说话，call谁谁接盘(●'◡'●)喜当爹orz
        },

        // 获取指定下标的元素，获取的是原生DOM
        
            /*
             * 1、如果传入null或undefined，那么转换为数组返回
             * 2、如果传入的是正数，按照指定的下标获取元素返回
             * 3、如果传入的是负数，按照下标倒着( this.length + 负数 )获取元素返回，佩服我自己哈哈哈
             * */

        get: function( i ) {
            return i == null?
                this.toArray() :
                ( i >= 0? this[ i ] : this[ this.length + i ] );//实例对象里面存的就是原生对象，eq和get的区别就是包不包装，方便原生操作
        },

        // 遍历实例
        each: function( fn ) {
            return jQuery.each( this, fn );//静态方法来遍历的，方法在下面
        },

        // 通过实例得到一个新数组
        map: function( fn ) {
            return jQuery.map( this, fn );//这个也在下面
        },

        slice: function() {
            // 因为slice的参数会有变化，所以需要是arguments，
            // 要把arguments中的每一项传给数组的slice，所以需要借用apply平铺传递过去，
            // 最后把slice返回数组，通过jQuery工厂保证成实例返回。
            return jQuery( [].slice.apply( this, arguments ) );//-->jq还有个名字，叫做，多写一句算我输=。=
        },

        // 获取指定下标的元素，获取的是jQuery类型的实例对象，步骤还是要写正式点，毕竟我是要成为海贼王的男人，，，呸 一点也不成熟，成为合格程序猿的猿人= =
      
            /*
             * 1、如果传入null或undefined，返回一个新实例，
             * 2、如果传入的是正数，按照指定的下标获取元素，再包装成新实例返回
             * 3、如果传入的是负数，按照下标倒着( this.length + 负数 )获取元素，再包装成新实例返回
             * */

            // null、undefined得到新实例
     
        eq: function( i ) {
            return i == null? jQuery() : jQuery( this.get( i ) );//你看是不是和get就差一个包装嘛，没骗你噻
        },

        // 获取实例中的第一个元素，是jQuery类型的实例对象，看名字就写出来的代码，不得不佩服jq作者的偷懒功力！
        first: function() {
            return this.eq( 0 );
        },

        // 获取实例中的最后一个元素，是jQuery类型的实例对象。
        last: function() {
            return this.eq( -1 );
        },

        // 原型上的方法供实例调用，
        // 即实例.push，在调用过程中，push内的this就指向了实例，
        // 所以这里不需要通过call和apply改变this指向即可借用数组的方法
        push: [].push,
        sort: [].sort,
        splice: [].splice
    }

    // 给jQuery和原型分别添加extend方法，这个混入也是很叼的，我觉得这算是jq中比较重要的理念之一
    jQuery.extend = jQuery.fn.extend = function( obj ) {
        var i = 1, key,
            arg = arguments,
            target = arg[ 0 ],
            argLen = arg.length;

        if( argLen === 1 ) {
            target = this;//如果obj里面只有一个对象，直接赋值给this即可
            i = 0;//i<1跳过下面的循环
        }

        // 遍历得到后面所有的对象
        for( ; i < argLen; i++ ) {

            // 遍历每一个对象所有的属性
            for( key in arg[ i ] ) {
                target[ key ] = arg[ i ][ key ];//动态赋值给this
            }
        }

        // 给谁混入返回谁
        return target;
    }

    // 给jQuery添加一些静态方法
    jQuery.extend({

        // 遍历对象或类数组
        each: function( obj, fn ) {
            var i, len, key;

            if ( jQuery.isLikeArray( obj ) ) {//复用静态判断类数组的方法
                for ( i = 0, len = obj.length; i < len; i++ ) {
                    if ( fn.call( obj[ i ], i, obj[ i ] ) === false ) {//给外部暴露一个终止循环的入口
                        break;
                    }
                }
            }else {
                for ( key in obj ) {
                    if ( fn.call( obj[ key ], key, obj[ key ] ) === false ) {//和上面一样的
                        break;
                    }
                }
            }

            return obj;//遍历并且操作完obj之后把obj返回，将链式编程发扬光大O(∩_∩)O
        },

        // map实现
        map: function( obj, fn ) {

            /*
             * 1、先判断obj是不是数组或者伪数组，
             * 2、如果是，则通过i的方式遍历这个对象
             * 3、如果不是，则通过for in的方式遍历这个对象
             * 4、在遍历的过程中，把每一次遍历到key和val分别传给回调。
             * 5、在给回调传参的时候，需要收集回调的返回值，最后把所有的返回值构成新数组返回。
             * */
            var i, len, key, result = [];

            if( 'length' in obj ) {//如果这个对象有length属性的话，不好意思你是类数组，我要开始操作你了
                for ( i = 0, len = obj.length; i < len; i++ ) {
                    result.push( fn.call( obj[ i ], obj[ i ], i ) );//这句话想了多久才撸清楚，泪目/(ㄒoㄒ)/~~
                }
            }else {
                for ( key in obj ) {
                    result.push( fn.call( obj[ key ], obj[ key ], key ) );
                }
            }

            return result;//当然不能忘了链式编程了-。-
        },

        // 去掉首尾空白字符
        trim: function( str ) {

            // null、undefined、NaN、0、false、''
            if ( !str ) {//免得报错
                return str;
            }

            // 优先使用原生的
            if ( str.trim ) {
                return str.trim();
            }

            return str.replace( /^\s+|\s+$/g, '');//正则表达式，我觉得正则表达式是框架大佬们用得最牛逼的技术之一，博大精深啊！

        },

        // 判断是不是html片段，这些方法外部也可以用，自己常用的方法都可以挂载在这里面，希望自己也能有一天把这个静态扩大到10000行 哈哈哈哈哈
        isHTML: function( html ) {
            return !!html &&//取两次非也是为了免得报错
                html.charAt(0) === '<' &&
                html.charAt( html.length - 1 ) === '>' &&
                html.length >= 3;//这里return不是链式编程哈，忘了写了，这里主要是用来判断用的，返回的是布尔值！！所以写法就有点彪悍
        },

        isFunction: function( fn ) {
            return typeof fn === 'function';//一句式编程，看着就舒服  哈哈哈哈
        },
        // 判断是不是window
        isWindow: function( w ) {//一般这个！！就是为了避免null、undefined、NaN、0、false、''这些来干扰判断的，！！就可以避免了
            return !!w && w.window === w;//window对象里面存了一个window属性是指向自己的，可能他也是怕别人冒充自己用来辨别用的，所有就这么写了
        },

        // 判断是不是对象
        isObject: function( obj ) {

            // 防止typeof对null的误判，null也是一个对象好尴尬啊
            if ( obj === null ) {
                return false;
            }

            // 如果是object或function，那就是对象
            if ( typeof obj === 'object' || typeof obj === 'function' ) {
                return true;
            }

            return false;//我想了半天，这个一句式编程不好写，所以干脆就这么写了！哈哈哈 不准笑
        },

        // 判断是不是字符串
        isString: function( str ) {
            return typeof str === 'string';
        },

        // 判断是不是真数组或伪数组
        isLikeArray: function( arr ) {

            // Function、window、!Object这些就是复用上面的那些方法来判断，拿出来写直接复用确实挺方便的！
            if ( jQuery.isFunction( arr ) || jQuery.isWindow( arr ) || !jQuery.isObject( arr ) ) {
                return false;
            }

            // 判断是不是真数组，写到这里我就想到了误判类型，页面嵌入frame会导致误判，只有tostring判断最准确，所以我就不去管其他判断方法了，只用这个！
            if ( ({}).toString.call( arr ) === '[object Array]' ) {
                return true;
            }

            // 判断是不是伪数组，我都不知道是有length属性就算是类数组还是需要判断他其他属性，反正只有length属性的也没有操作的必要，干脆就判断一下其他属性，嗯，一定没错!
            if ( 'length' in arr && ( arr.length === 0 || arr.length - 1 in arr ) ) {
                return true;
            }

            return false;
        },

        ready: function( fn ) {
            //哇！！！！！终于到这里了，好烦啊，查了好多资料，希望不要有bug！！！！！！
            // 先统一判断DOMContentloaded有没有触发，
            // 通过document.readyState === 'complete'判断
            // 如果为true，fn可以直接调用。

            // 如果为false，那么判断支不支持addEventListener，
            // 如果支持，绑定DOMContentLoaded事件

            // 如果不支持，使用attchEvent绑定onreadystatechang事件,
            // 注意，需要在里面判断document.readyState === 'complete'才执行fn。
            // 防止fn多次执行。

            // DOM已经构造完毕，fn可以直接执行
            if ( document.readyState === 'complete' ) {
                fn();
            }

            // 如果DOM没有构造完毕，那么判断addEventListener是否兼容
            else if( document.addEventListener ) {
                document.addEventListener( 'DOMContentLoaded', fn );
            }

            // 如果不兼容addEventListener，那么采取attachEvent的方式，
            // 同时事件变为了onreadystatechange，为了防止这个事件多次触发造成的fn多次执行，
            // 所以需要一个包装函数来进行过滤。
            else {
                document.attachEvent( 'onreadystatechange', function() {
                    if( document.readyState === 'complete' ) {//这里有坑，把我坑了的，里面还要判断一下ready state才行，所以说ie活该被pass，害我写这么久！！！！
                        fn();
                    }
                } );
            }
        }
    });

    // 这是真正的构造函数，同时把构造函数放在了原型中，这个骚操作在我第一次看jq的时候是把我看蒙蔽了的，不过确实很牛逼！
    var init = jQuery.fn.init = function( selector ) {

        // null、undefined、NaN、0、false、''
        if ( !selector ) {
            return this;
        }

        // function
        if ( jQuery.isFunction( selector ) ) {

            // 打包给ready静态方法处理，好好的ready不用，非要简写，不过难不倒大爷我!!!(喜欢简写的那个人就是我哈哈哈哈嗝~~~)
            jQuery.ready( selector );
        }

        // string ==> ( html || selector )这样注释应该可以少打字，好累啊整理思路！！！
        else if( jQuery.isString( selector ) ) {

            // 为了用户友好体验，先去掉首尾空白字符，谁叫我们是苦逼的码农呢~~~不对啊，用jq的也是程序员，凭什么我要让他有友好体验！！f**k，我自己用，不给别人用
            selector = jQuery.trim( selector );

            // html
            if( jQuery.isHTML( selector ) ) {

                // 利用一个临时的div来创建DOM，
                // 然后把创建好的DOM依次push给实例，机智如我!!
                var tempDiv = document.createElement( 'div' );
                tempDiv.innerHTML = selector;
                [].push.apply( this, tempDiv.childNodes );//我想想，硬塞进去的话，this是不是就直接被我塞成数组了，先试试再说吧！

            }

            // selector
            else {

                try {
                    [].push.apply( this, document.querySelectorAll( selector ) );//qs好像有性能问题，但是我自己用就将就了，反正jq都快被封装到底层了~~
                }catch(e) {
                    // 如果报错了，那么手动补一个length属性，代表没有获取到任何元素，哈哈哈  真的是，每次catch的时候都有一种自欺欺人的感觉哈哈哈！！！1
                    this.length = 0;
                }
            }
        }

        // array || likeArray
        else if( jQuery.isLikeArray( selector ) ) {
            [].push.apply( this, [].slice.call( selector ) );//假数组是不能被平铺的，转换成真数组才可以平铺，没办法，偷懒就得好好转换一下！
        }

        // 其它----我也不知道其他还有些什么类型的东西了，js高程还没有看完，不知道还有哪些情况没考虑到，只有处理一下咯!
        else {
            this[0] = selector;
            this.length = 1;
        }
    };

    // 替换init的原型为工厂的原型，这样外界就可以通过工厂给实例扩展方法，这些绕来绕去方便操作的就是绕昏人的地方，也是jq的精髓之一，所以我的注释也得写得精髓一点！
    init.prototype = jQuery.fn;

    // 暴露工厂和工厂的简称
    w.jQuery = w.$ = jQuery;//我觉得应该还可以多整几个，比如说~~~~~~我也想不出来了，应该不允许超过三个库共存吧，库多了也不好，就给两个名字可以限制一下其他库！应该是这样！

}( window ));