/**
 * Created by ly-zhangxianggeng on 2015/11/17.
 * 0.7 参考成熟的功能，改善代码
 * 1.增加功能选项（是否为必选项验证）
 * 2.增加默认验证（是否为空）
 * 3.增加错误提示信息方式选择
 * 4.努力实现用户自定义方式
 * 0.8第一次使用，需要总结
 * 1.个人使用，验证模式较少不够完善，提供自定义模式
 * 2.重复代码过多，需要精简
 * 3.使用时，重复代码过多，需要优化
 * 本版本第一次引用到具体页面上汽车维修页面的表单验证
 * 1.增加是否为空验证方法
 * 2.实现用户自定义错误提示信息以及验证正则
 * 0.9更改内容
 * 1.去除重复代码
 * 2.结构合理化  -使用return的方法完成各函数间的数据传递，而不是使用全局变量
 * 3.调用方式增加回调函数
 * 4.对于返回提示消息的问题，是作为属性还是作为返回值？返回到的span为指定的错误显示
 * 5.增加显示错误优先级
 */
;(function($) {
    $.fn.formCheck = function(options) {
        return this.each(function () {
            // 这里开始写功能需求
            //重写默认值信息
            var defaultOptions={
                //验证模式
                checkModel:'nameCheck',
                //验证规则 包括ref 是否必选
                 required:true,//是否为必选项，为bool值，若为是，作为验证判断
                 // 若为否，仅当非空的做判断
                //触发模式
                //submitModel:'',
                 nMin:1,//仅当其验证名字时起作用，
                 // 考虑取消或者可以延伸到所有验证，或者单独写入名字验证中
                 nMax:4,
                 ref:'',//自定义验证正则
                //自定义消息内容
                passMsg:'ispass',
                msg:'请正确输入',
                emptyMsg:'不能为空'
                //showError:'showErrorFollow',
                //clearError:'clearErrorFollow'
            };
            //默认的返回消息数组
            var arrMsg={
                nameCheck:{
                    namePassMsg:'isPass',
                    nameMsg:'请输入正确的姓名',
                    nameEmptyMsg:'请输入姓名'
                },
                phoneCheck:{
                    phonePassMsg:'isPass',
                    phoneMsg:'请输入正确的电话号码',
                    phoneEmptyMsg:'请输入电话号码'
                },
                IDCheck:{
                    IDPassMsg:'isPass',
                    IDMsg:'请输入正确的身份证号码',
                    IDEmptyMsg:'请输入身份证号码'
                },
                emailCheck:{
                    emailPassMsg:'isPass',
                    emailMsg:'请输入正确格式的邮箱',
                    emailEmptyMsg:'请输入邮箱'
                },
                userNameCheck:{
                    userNamePassMsg:'isPass',
                    userNameMsg:'请输入正确格式的用户名',
                    userNameEmptyMsg:'请输入用户名'
                },
                notEmptyCheck:{
                    notEmptyPassMsg:'isPass',
                    notEmptyMsg:'此项不能为空',
                    notEmptyEmptyMsg:'您未输入，此项不能为空'
                },
                passwordCheck:{
                    passwordPassMsg:'isPass',
                    passwordMsg:'请输入正确格式的密码',
                    passwordEmptyMsg:'密码不能为空'
                }
            };
            var obj= $.extend({},defaultOptions,options);
            var isPass=false;
            var isEmpty=false;
            var typeError=false;
            var s='';
            var refSelf=obj.ref;
            var This=this;

            //触发验证方式
            $(This).on('click',function(){
                isPass=false;
                isEmpty=false;
                typeError=false;
                s='';
               // obj.clearError();
                $(This).attr('data-xg-msg','验证中,请稍后...') ;
               // console.log(obj.checkModel);
            });
            $(This).on('blur',function(){
                forCheck();
                showResult();
            });
            //判断是否为input框或者div,以获得目标验证字符串
            function thisTypeVal(){
                if($(This).val().length>0){
                    return $(This).val();
                }else{
                    return $(This).text();
                }
            }
            //判断验证结果，返回属性性的值
            function typeCheck(PassMsg,Msg,EmptyMsg){
                if(!isPass&&!isEmpty){
                    $(This).attr('data-xg-msg',Msg) ;
                   // obj.showError(Msg);
                    $(This).attr('data-xg-res','typeError') ;
                    //console.log('typeError');
                }else if(!isPass){
                    $(This).attr('data-xg-msg',EmptyMsg) ;
                    $(This).attr('data-xg-res','isEmpty') ;
                    //obj.showError(EmptyMsg);
                   // console.log('isEmpty');
                }else{
                    $(This).attr('data-xg-msg',PassMsg) ;
                    $(This).attr('data-xg-res','isPass') ;
                    //obj.showError(PassMsg);
                   // console.log('isPass');
                }
            }
            /*判断类型，以确定返回消息为默认值，或是用户自定义*/
            function chooseMsg(PassMsg,Msg,EmptyMsg){
                if(options.passMsg){}else{obj.passMsg=PassMsg;}
                if(options.msg){}else{obj.msg=Msg;}
                if(options.emptyMsg){}else{obj.emptyMsg=EmptyMsg;}
            }

            /*判断函数
             *
             * */
             function forCheck(){
                s=thisTypeVal();
                s=trim(s);
                switch (obj.checkModel){
                    case 'nameCheck':
                        isPass=chnName(s,obj.nMin,obj.nMax);
                         break;
                    case 'phoneCheck':
                        isPass=phnNumber(s);
                        break;
                    case 'IDCheck':
                        isPass=idConfir(s);
                        break;
                    case 'emailCheck':
                        isPass=emailConfir(s);
                        break;
                    case 'userNameCheck':
                        isPass=userNameConfir(s);
                        break;
                    case 'notEmptyCheck':
                        isPass=thisNotEmpty(s);
                        break;
                    case 'passwordCheck':
                        isPass=passwordConfir(s);
                        break;
                    default :
                        console.log('验证模式错误！')
                        break;
                }
                 //通过模式判断对应的提示信息
                 var arrMsgNews=[];
                 for(var key in arrMsg){
                     if(key==obj.checkModel) {
                         for(var key2 in arrMsg[key]) {
                             arrMsgNews.push(arrMsg[key][key2]);
                         }
                         chooseMsg(arrMsgNews[0],arrMsgNews[1],arrMsgNews[2]);
                     }
                 }
                 typeCheck(obj.passMsg,obj.msg,obj.emptyMsg);
            }
            ///////////////////////////////错误信息显示模块//////////////////////////////////////////////////////
            function showResult(){
                    var $tips=$(This).parents('.needCheck').find('.u-xg-tips');
               // console.log($(This).parentsUntil('.needCheck'));
                    console.log($tips);

                if(obj.required){
                    if(($(This).attr('data-xg-res'))&&($(This).attr('data-xg-res'))!='isPass'){//判断条件如果没通过 则显示
                        $tips.text($(This).attr('data-xg-msg')).show();//显示提示;
                    }else{
                        $tips.text($(This).attr('data-xg-msg')).hide();//隐藏提示;
                    }
                }else{
                    if(($(This).attr('data-xg-res'))&&($(This).attr('data-xg-res'))=='typeError'){//判断条件如果没通过 则显示
                        $tips.text($(This).attr('data-xg-msg')).show();//显示提示;
                    }else{
                        $tips.text($(This).attr('data-xg-msg')).hide();//隐藏提示;
                    }
                }
            }
            ///////////////////////////////返回通过////////////////////////////////////////////////////////////////////

            /*去前后的空白符
             *
             * */
            /*去掉开头结尾空格*/
            function trim(str){
                var reg=/^\s*(.*?)\s*$/;
                str=str.replace(reg,"$1");
                return str;
            }
            /*中文姓名验证
             *参数nMin,nMax 为需要的姓名字数
             */
            function chnName(s,nMin,nMax){
                s+='';
                var  ref=refSelf?refSelf:'/^[\u4e00-\u9fa5]{'+nMin+','+nMax+'}$/';
                if(s){
                    isEmpty=false;
                    return  s.match(eval(ref))?true:false;
                }else{
                    isEmpty=true;
                    return false;
                }
            }
            /*手机验证
             *
             *
             */
            function phnNumber(s){
                s+='';
                var  refphone=refSelf?refSelf: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
                //console.log(refphone);
                if(s){
                    isEmpty=false;
                    return  s.match(refphone)?true: false;
                }else{
                    isEmpty=true;
                    return false;
                }
            }
            /*身份证验证
             *
             */
            function idConfir(s){
                s+='';
                //身份证正则表达式(15位)
                var isIDCard1=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
                //身份证正则表达式(18位)
                var isIDCard2=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}(\d|x|X)$/;
                if(s){
                    isEmpty=false;
                    if(s.match(isIDCard1)||s.match(isIDCard2)){ return true;
                    }else{ return false;}
                }else{
                    isEmpty=true;
                    return false;
                }
            }
            /*邮箱验证
             *
             */
            function  emailConfir(s){
                s+='';
                var emailName=refSelf?refSelf:/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                if(s){
                    isEmpty=false;
                    return   s.match(emailName)?true: false;
                }else{
                    isEmpty=true;
                    return false;
                }
            }
            /*用户名验证
             *
             * */
            function  userNameConfir(s){
                s+='';
                var userName=refSelf?refSelf:/^[a-zA-Z0-9]{6,16}$/;
                if(s){
                    isEmpty=false;
                    return   s.match(userName)?true: false;
                }else{
                    isEmpty=true;
                    return false;
                }
            }
           /*为空验证
            *
            * */
            function  thisNotEmpty(s){
                s+='';
                var thisvalue=refSelf?refSelf:/^\S*$/;
                if(s){
                    isEmpty=false;
                    return   s.match(thisvalue)?true: false;
                }else{
                    isEmpty=true;
                    return false;
                }
            }
            /*密码验证
             *
             * */
            function  passwordConfir(s){
                s+='';
                var password=refSelf?refSelf:/(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*.,;'"/?+=-]).{6,16}/;
                if(s){
                    isEmpty=false;
                    return   s.match(password)?true: false;
                }else{
                    isEmpty=true;
                    return false;
                }
            }
        })
    };
})( jQuery );