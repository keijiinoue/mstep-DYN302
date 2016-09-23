// 非サポートであるが実装可能な JavaScript を使ったカスタマイズ
// フォーム上のコンポーネントに色付け
// Dynamics CRM のサポートされるカスタマイズではない。
function run() {
    parent.$('.ms-crm-InlineTabHeader').css("background", "#DDDDAA");
    parent.$('.ms-crm-InlineTabBody-Read').css("border", "solid 1px #DDDDAA");
    parent.$('.ms-crm-Inline-Value').css("border", "solid 1px #AAAAAA");
    parent.$('.ms-crm-List-Row-Lite').css({ "border-bottom": "solid", "border-bottom-width": "1px", "border-bottom-color": "#DDDDDD" });

    /* F12 でデバッグする場合はこちら
    $('.ms-crm-InlineTabHeader').css("background", "#DDDDAA");
    $('.ms-crm-InlineTabBody-Read').css("border", "solid 1px #DDDDAA");
    $('.ms-crm-Inline-Value').css("border", "solid 1px #AAAAAA");
    $('.ms-crm-List-Row-Lite').css({ "border-bottom": "solid", "border-bottom-width": "1px", "border-bottom-color": "#DDDDDD" });
    */
}

