# formCheck
表单验证插件，用于在失去焦点时触发显示提示信息
###注意事项
1.在引用插件之前，须引用jQuery文件
2.本插件提供中文姓名，电话号码，身份证号，邮箱，标准用户名，非空，密码验证
3.案例
HTML代码
```
<div class="needCheck">
	<label>姓&nbsp;&nbsp;名</label>    <input  class="demoName" type="text" name="name" value=""> <br>
        <span class="u-xg-tips"></span>
</div>
```

>其中，needCheck属性用于限定input及提示文字span的范围，需要成为他们的父元素
>u-xg-tips属性用于显示提示文字

js代码
```
$('.demoName').formCheck(
          {
              checkModel:'nameCheck'
          }
  );
```