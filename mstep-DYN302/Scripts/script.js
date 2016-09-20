function MSTEP_hello00() {
    //document.getElementById("MyDiv").innerText = "こんにちは HTML + JavaScript + CSS Web リソースです。";

    document.getElementById("MyDiv").innerHTML =
        "こんにちは HTML + JavaScript + CSS Web リソースです。<br/>"
        + "「" + parent.Xrm.Page.getAttribute("name").getValue() + "」レコードのフォームです。";
}

function MSTEP_hello01() {
    // 「取引先企業名」フィールドの値の取得
    var name = Xrm.Page.getAttribute("name").getValue();

    // 「業種」フィールド（オプションセット）の選択された値の取得
    var industrycode = Xrm.Page.getAttribute("industrycode").getValue();

    if (industrycode == 100000016) // 「情報・通信」
    {
        // 「説明」フィールドに値を設定
        Xrm.Page.getAttribute("description").setValue(name + " はICT企業です");
    }
}

function MSTEP_hello02() {
    // 「企業形態」フィールドの値の取得
    var ownershipcode = Xrm.Page.getAttribute("ownershipcode").getValue();

    if (ownershipcode == 1) // 「公開企業」
    {
        // 「取引先企業番号」フィールドを表示
        Xrm.Page.getAttribute("accountnumber").controls.forEach(
            function (control, i){
                control.setVisible(true);
            });
    } else
    {
        // 「取引先企業番号」フィールドを非表示
        Xrm.Page.getAttribute("accountnumber").controls.forEach(
            function (control, i) {
                control.setVisible(false);
            });
    }
}

function MSTEP_hello03() {
    // フィルターの定義
    // ・所有者 が現在のユーザーと等しい
    // ・状態 が次の値と等しい アクティブ
    // <filter type="and">
    //   <condition attribute="ownerid" operator="eq-userid" />
    //   <condition value="0" attribute="statecode" operator="eq" />
    // </filter>
    var filter = '<filter type="and"><condition attribute="ownerid" operator="eq-userid" />      <condition value="0" attribute="statecode" operator="eq" /></filter>';

    // 「取引先企業の親会社」検索（Lookup）フィールドにイベント ハンドラーの追加
    Xrm.Page.getControl("parentaccountid").addPreSearch(
        function () {
            // 「取引先企業の親会社」検索（Lookup）フィールドのレコードの抽出条件を追加
            Xrm.Page.getControl("parentaccountid").addCustomFilter(filter, "account");
        });
}

function MSTEP_hello04() {
    // 「予算金額」フィールドの値が null でなければ
    if (Xrm.Page.getAttribute("budgetamount").getValue() != null) {
        // アクティブなステージを前に移動
        Xrm.Page.data.process.moveNext();
    }
}

function MSTEP_hello05() {
    // 「関係内容」フィールドの値で判断
    if (Xrm.Page.getAttribute("customertypecode").getValue() == 3) { // 「顧客」
        Xrm.Page.ui.tabs.forEach(
            function (tab, i) {
                if (tab.getLabel() == "プロファイル" || tab.getLabel() == "連絡方法") {
                    // タブを表示
                    tab.setVisible(true);
                }
            });
    } else {
        Xrm.Page.ui.tabs.forEach(
            function (tab, i) {
                if (tab.getLabel() == "プロファイル" || tab.getLabel() == "連絡方法") {
                    // タブを非表示
                    tab.setVisible(false);
                }
            });
    }
}

function MSTEP_hello06() {
    Xrm.Page.ui.controls.forEach(
        function (control, i) {
            // 「最近の営業案件」サブグリッドのみ対象
            if (control.getControlType() == "subgrid"
                && control.getLabel() == "最近の営業案件") {
                // 選択されている行の取得
                control.getGrid().getSelectedRows().forEach(
                    function (selectedRow, i) {
                        var id = selectedRow.getData().getEntity().getId();
                        var primaryAttValue =
                            selectedRow.getData().getEntity().getPrimaryAttributeValue();
                        // アラート ダイアログを表示
                        Xrm.Utility.alertDialog(id + ":\n" + primaryAttValue);
                    });
            }
        });
}

function MSTEP_hello07() {
    var parameters = {};
    // 現在表示されている「取引先企業」レコードが「会社」検索（Lookup）フィールドに
    // 設定されている状態の新規「取引先担当者」レコードを作成するためのパラメーターを設定する
    parameters["parentcustomerid"] = Xrm.Page.data.entity.getId();
    parameters["parentcustomeridname"] = Xrm.Page.data.entity.getPrimaryAttributeValue();
    parameters["parentcustomeridtype"] = Xrm.Page.data.entity.getEntityName();
    parameters["description"] = "スクリプトにより既定値が設定されているレコード";

    // パラメーターが設定された状態の新規「取引先担当者」レコードのフォームをオープン
    Xrm.Utility.openEntityForm("contact", null, parameters);
}

function MSTEP_hello08() {
    // GUID の文字列から"{" と"}"を取り除く
    var id = Xrm.Page.data.entity.getId().replace("{", "").replace("}", "");

    // 現在表示している取引先企業レコードに関連する「メモ」レコードの作成
    MSTEP_WebAPI_create("annotations",
        {
            "subject": "スクリプトで作成したメモ",
            "notetext": "スクリプトで作成したメモです。",
            "objectid_account@odata.bind": "/accounts(" + id + ")"
        })
    .then(function (uri) {
        console.log("作成されたレコードの Uri: " + uri);
    })
    .catch(function (error) {
        console.log(error.message);
    });
}

function MSTEP_WebAPI_create(entitySetName, entity) {
    /// <summary>Create a new entity</summary>
    /// <param name="entitySetName" type="String">The name of the entity set for the entity you want to create.</param>
    /// <param name="entity" type="Object">An object with the properties for the entity you want to create.</param>       
    if (!typeof entitySetName === "string") {
        throw new Error("MSTEP_WebAPI_create entitySetName parameter must be a string.");
    }
    if ((entity === null) || (typeof entity === "undefined")) {
        throw new Error("MSTEP_WebAPI_create entity parameter must not be null or undefined.");
    }

    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open("POST", encodeURI(MSTEP_WebAPI_getWebAPIPath() + entitySetName), true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Prefer", "odata.include-annotations=*");
        req.onreadystatechange = function () {
            if (this.readyState == 4 /* complete */) {
                req.onreadystatechange = null;
                if (this.status == 204) {
                    resolve(req.getResponseHeader("OData-EntityId"));
                }
                else {
                    reject(MSTEP_WebAPI_errorHandler(req.response));
                }
            }
        };
        req.send(JSON.stringify(entity));
    });
}

function MSTEP_WebAPI_errorHandler(resp) {
    try {
        return JSON.parse(resp).error;
    } catch (e) {
        return new Error("Unexpected Error")
    }
}

function MSTEP_WebAPI_getClientUrl() {
    //Get the organization URL
    if (typeof GetGlobalContext == "function" &&
        typeof GetGlobalContext().getClientUrl == "function") {
        return GetGlobalContext().getClientUrl();
    }
    else {
        //If GetGlobalContext is not defined check for Xrm.Page.context;
        if (typeof Xrm != "undefined" &&
            typeof Xrm.Page != "undefined" &&
            typeof Xrm.Page.context != "undefined" &&
            typeof Xrm.Page.context.getClientUrl == "function") {
            try {
                return Xrm.Page.context.getClientUrl();
            } catch (e) {
                throw new Error("Xrm.Page.context.getClientUrl is not available.");
            }
        }
            //else { throw new Error("Context is not available."); }
        else { return document.location.origin; }
    }
}
function MSTEP_WebAPI_getWebAPIPath() {
    return MSTEP_WebAPI_getClientUrl() + "/api/data/v8.1/";
}
