/*
 {
     "TypeName": "AddMsg",    消息类型
     "Appid": "wx_wR_U4zPj2M_OTS3BCyoE4",  设备ID
     "Wxid": "wxid_phyyedw9xap22",  所属微信的wxid
     "Data":
     {
         "MsgId": 1040356095,   消息ID
         "FromUserName":
         {
             "string": "wxid_phyyedw9xap22"  消息发送人的wxid
         },
         "ToUserName":
         {
             "string": "wxid_0xsqb3o0tsvz22"  消息接收人的wxid
         },
         "MsgType": 1,   消息类型 1是文本消息
         "Content":
         {
             "string": "123" # 消息内容
         },
         "Status": 3,
         "ImgStatus": 1,
         "ImgBuf":
         {
             "iLen": 0
         },
         "CreateTime": 1705043418,  消息发送时间
         "MsgSource": "<msgsource>\n\t<alnode>\n\t\t<fr>1</fr>\n\t</alnode>\n\t<signature>v1_volHXhv4</signature>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n",
         "PushContent": "朝夕。 : 123",  消息通知内容
         "NewMsgId": 7773749793478223190,  消息ID
         "MsgSeq": 640356095
     }
 }
*/

export interface MessageText {
    TypeName: string
    Appid: string
    Wxid: string
    Data: {
        MsgId: number
        FromUserName: {
            string: string
        }
        ToUserName: {
            string: string
        }
        MsgType: number
        Content: {
            string: string
        }
        Status: number
        ImgStatus: number
        ImgBuf: {
            iLen: number
        }
        CreateTime: number
        MsgSource: string
        PushContent: string
        NewMsgId: number
        MsgSeq: number
    }
}

/*
{
    "TypeName": "AddMsg",   消息类型
    "Appid": "wx_wR_U4zPj2M_OTS3BCyoE4",  设备ID
    "Wxid": "wxid_phyyedw9xap22",  所属微信的wxid
    "Data":
    {
        "MsgId": 1040356099,    消息ID
        "FromUserName":
        {
            "string": "wxid_phyyedw9xap22"   消息发送人的wxid
        },
        "ToUserName":
        {
            "string": "wxid_0xsqb3o0tsvz22"  消息接收人的wxid
        },
        "MsgType": 3,   消息类型 3是图片消息
        "Content":
        {
            "string": "<?xml version=\"1.0\"?>\n<msg>\n\t<img aeskey=\"9b7011c38d1af088f579eda23e3b9cad\" encryver=\"1\" cdnthumbaeskey=\"9b7011c38d1af088f579eda23e3b9cad\" cdnthumburl=\"3057020100044b304902010002043904752002032f7e350204aa0dd83a020465a0e6de042438323365313535662d373035372d343264632d383132302d3861323332316131646334660204011418020201000405004c4ec500\" cdnthumblength=\"2146\" cdnthumbheight=\"76\" cdnthumbwidth=\"120\" cdnmidheight=\"0\" cdnmidwidth=\"0\" cdnhdheight=\"0\" cdnhdwidth=\"0\" cdnmidimgurl=\"3057020100044b304902010002043904752002032f7e350204aa0dd83a020465a0e6de042438323365313535662d373035372d343264632d383132302d3861323332316131646334660204011418020201000405004c4ec500\" length=\"2998\" md5=\"2a4cb28868b9d450a135b1a85b5ba3dd\" />\n\t<platform_signature></platform_signature>\n\t<imgdatahash></imgdatahash>\n</msg>\n"   图片的cdn信息，可用此字段做转发图片
        },
        "Status": 3,
        "ImgStatus": 2,
        "ImgBuf":
        {
            "iLen": 2146,
            "buffer": "/9j/4AAQSkZJRgABAQAASABIAAD/4QBM..." # 缩略图的base64
        },
        "CreateTime": 1705043678,  消息发送时间
        "MsgSource": "<msgsource>\n\t<alnode>\n\t\t<cf>2</cf>\n\t</alnode>\n\t<sec_msg_node>\n\t\t<uuid>5b04ea0181f86c7f3d126e9a7fe5038b_</uuid>\n\t</sec_msg_node>\n\t<signature>v1_5WGxwSEj</signature>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n",
        "PushContent": "朝夕。 : [图片]",   消息通知内容
        "NewMsgId": 6906713067183447582,   消息ID
        "MsgSeq": 640356099
    }
}
*/

export interface MessageImage {
    TypeName: string
    Appid: string
    Wxid: string
    Data: {
        MsgId: number
        FromUserName: {
            string: string
        }
        ToUserName: {
            string: string
        }
        MsgType: number
        Content: {
            string: string
        }
        Status: number
        ImgStatus: number
        ImgBuf: {
            iLen: number
            buffer: string
        }
        CreateTime: number
        MsgSource: string
        PushContent: string
        NewMsgId: number
        MsgSeq: number
    }
}

/*
{
    "TypeName": "AddMsg",   消息类型
    "Appid": "wx_wR_U4zPj2M_OTS3BCyoE4",  设备ID
    "Wxid": "wxid_phyyedw9xap22",  所属微信的wxid
    "Data":
    {
        "MsgId": 1040356100,    消息ID
        "FromUserName":
        {
            "string": "wxid_phyyedw9xap22"   消息发送人的wxid
        },
        "ToUserName":
        {
            "string": "wxid_0xsqb3o0tsvz22"  消息接收人的wxid
        },
        "MsgType": 34,   消息类型，34是语音消息
        "Content":
        {
            "string": "<msg><voicemsg endflag=\"1\" cancelflag=\"0\" forwardflag=\"0\" voiceformat=\"4\" voicelength=\"2540\" length=\"3600\" bufid=\"0\" aeskey=\"e98b50658e7b3153caf2ebaf1caf190a\" voiceurl=\"3052020100044b304902010002048399cc8402032df731020414e461b4020465a0e746042436373366653962342d383362312d346365612d396134352d35333934386664306164363102040114000f020100040013d16b11\" voicemd5=\"\" clientmsgid=\"490e77adc00658795ba14f7368fe3679wxid_0xsqb3o0tsvz22_29_1705043780\" fromusername=\"wxid_phyyedw9xap22\" /></msg>"   语音消息的下载信息，可用于下载语音文件
        },
        "Status": 3,
        "ImgStatus": 1,
        "ImgBuf":
        {
            "iLen": 3600,
            "buffer": "AiMhU0lMS19WMxMApzi9JA+qToPB..."  语音文件的base64，并非所有语音消息都有本字段
        },
        "CreateTime": 1705043782,   消息发送时间
        "MsgSource": "<msgsource>\n\t<signature>v1_j+rf/Jnp</signature>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n",
        "PushContent": "朝夕。 : [语音]",   消息通知内容
        "NewMsgId": 1428830975092239121,   消息ID
        "MsgSeq": 640356100
    }
}
*/

export interface MessageVoice {
    TypeName: string
    Appid: string
    Wxid: string
    Data: {
        MsgId: number
        FromUserName: {
            string: string
        }
        ToUserName: {
            string: string
        }
        MsgType: number
        Content: {
            string: string
        }
        Status: number
        ImgStatus: number
        ImgBuf: {
            iLen: number
            buffer: string
        }
        CreateTime: number
        MsgSource: string
        PushContent: string
        NewMsgId: number
        MsgSeq: number
    }
}

/*
{
    "TypeName": "AddMsg",   消息类型
    "Appid": "wx_wR_U4zPj2M_OTS3BCyoE4",  设备ID
    "Wxid": "wxid_phyyedw9xap22",  所属微信的wxid
    "Data":
    {
        "MsgId": 1040356101,    消息ID
        "FromUserName":
        {
            "string": "wxid_phyyedw9xap22"   消息发送人的wxid
        },
        "ToUserName":
        {
            "string": "wxid_0xsqb3o0tsvz22"  消息接收人的wxid
        },
        "MsgType": 43,  消息类型，43是视频消息
        "Content":
        {
            "string": "<?xml version=\"1.0\"?>\n<msg>\n\t<videomsg aeskey=\"4b2fe0afbde392ba6df340e127c138bd\" cdnvideourl=\"3057020100044b304902010002043904752002032df731020415e461b4020465a0e7a7042463313864306138382d356639662d346663302d626438302d6462653936396437313161330204051400040201000405004c531100\" cdnthumbaeskey=\"4b2fe0afbde392ba6df340e127c138bd\" cdnthumburl=\"3057020100044b304902010002043904752002032df731020415e461b4020465a0e7a7042463313864306138382d356639662d346663302d626438302d6462653936396437313161330204051400040201000405004c531100\" length=\"611755\" playlength=\"3\" cdnthumblength=\"7873\" cdnthumbwidth=\"224\" cdnthumbheight=\"398\" fromusername=\"wxid_phyyedw9xap22\" md5=\"e1c3b99dae0639b4ce4d22b245cff0af\" newmd5=\"d0ee9e80798d763f0955da407a65d34c\" isplaceholder=\"0\" rawmd5=\"\" rawlength=\"0\" cdnrawvideourl=\"\" cdnrawvideoaeskey=\"\" overwritenewmsgid=\"0\" originsourcemd5=\"\" isad=\"0\" />\n</msg>\n"  视频消息的cdn信息，可用此字段做转发视频
        },
        "Status": 3,
        "ImgStatus": 1,
        "ImgBuf":
        {
            "iLen": 0
        },
        "CreateTime": 1705043879,  消息发送时间
        "MsgSource": "<msgsource>\n\t<bizflag>0</bizflag>\n\t<sec_msg_node>\n\t\t<uuid>ce3ebc6d2893c7a2669ac5d2eaa4aadf_</uuid>\n\t</sec_msg_node>\n\t<signature>v1_kk/psF9W</signature>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n",
        "PushContent": "朝夕。 : [视频]",   消息通知内容
        "NewMsgId": 6628526085342711793,   消息ID
        "MsgSeq": 640356101
    }
}
*/

export interface MessageVideo {
    TypeName: string
    Appid: string
    Wxid: string
    Data: {
        MsgId: number
        FromUserName: {
            string: string
        }
        ToUserName: {
            string: string
        }
        MsgType: number
        Content: {
            string: string
        }
        Status: number
        ImgStatus: number
        ImgBuf: {
            iLen: number
        }
        CreateTime: number
        MsgSource: string
        PushContent: string
        NewMsgId: number
        MsgSeq: number
    }
}

/*
{
    "TypeName": "AddMsg",   消息类型
    "Appid": "wx_wR_U4zPj2M_OTS3BCyoE4",  设备ID
    "Wxid": "wxid_phyyedw9xap22",  所属微信的wxid
    "Data":
    {
        "MsgId": 1040356102,    消息ID
        "FromUserName":
        {
            "string": "wxid_phyyedw9xap22"    消息发送人的wxid
        },
        "ToUserName":
        {
            "string": "wxid_0xsqb3o0tsvz22"  消息接收人的wxid
        },
        "MsgType": 47,  消息类型，47是emoji消息
        "Content":
        {
            "string": "<msg><emoji fromusername = \"wxid_phyyedw9xap22\" tousername = \"wxid_0xsqb3o0tsvz22\" type=\"2\" idbuffer=\"media:0_0\" md5=\"cc56728d56c730ddae52baffe941ed86\" len = \"211797\" productid=\"\" androidmd5=\"cc56728d56c730ddae52baffe941ed86\" androidlen=\"211797\" s60v3md5 = \"cc56728d56c730ddae52baffe941ed86\" s60v3len=\"211797\" s60v5md5 = \"cc56728d56c730ddae52baffe941ed86\" s60v5len=\"211797\" cdnurl = \"http://wxapp.tc.qq.com/262/20304/stodownload?m=cc56728d56c730ddae52baffe941ed86&amp;filekey=30350201010421301f02020106040253480410cc56728d56c730ddae52baffe941ed860203033b55040d00000004627466730000000132&amp;hy=SH&amp;storeid=2631f5928000984ff000000000000010600004f50534801c67b40b77857716&amp;bizid=1023\" designerid = \"\" thumburl = \"\" encrypturl = \"http://wxapp.tc.qq.com/262/20304/stodownload?m=6de689e5bacb77458ad66cba2b19eab6&amp;filekey=30350201010421301f020201060402534804106de689e5bacb77458ad66cba2b19eab60203033b60040d00000004627466730000000132&amp;hy=SH&amp;storeid=2631f5928000bc81d000000000000010600004f50534818865b40b778fc253&amp;bizid=1023\" aeskey= \"bc91f3add23de00486985d0744defd26\" externurl = \"http://wxapp.tc.qq.com/262/20304/stodownload?m=dafdca0576bb5fc0430de8f87c95910a&amp;filekey=30350201010421301f02020106040253480410dafdca0576bb5fc0430de8f87c95910a020300a6e0040d00000004627466730000000132&amp;hy=SH&amp;storeid=2631f59290000d418000000000000010600004f5053482a1c5960976dd29a3&amp;bizid=1023\" externmd5 = \"4a6825f3a710f7edcaa4a6f0c49fe650\" width= \"240\" height= \"240\" tpurl= \"\" tpauthkey= \"\" attachedtext= \"\" attachedtextcolor= \"\" lensid= \"\" emojiattr= \"\" linkid= \"\" desc= \"\" ></emoji> <gameext type=\"0\" content=\"0\" ></gameext></msg>"  可解析xml中的md5用与发送emoji消息
        },
        "Status": 3,
        "ImgStatus": 2,
        "ImgBuf":
        {
            "iLen": 0
        },
        "CreateTime": 1705043947,  消息发送时间
        "MsgSource": "<msgsource>\n\t<signature>v1_vy/xC7WS</signature>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n",
        "PushContent": "朝夕。 : [动画表情]",   消息通知内容
        "NewMsgId": 6674256223577965652,   消息ID
        "MsgSeq": 640356102
    }
}
*/

export interface MessageEmoji {
    TypeName: string
    Appid: string
    Wxid: string
    Data: {
        MsgId: number
        FromUserName: {
            string: string
        }
        ToUserName: {
            string: string
        }
        MsgType: number
        Content: {
            string: string
        }
        Status: number
        ImgStatus: number
        ImgBuf: {
            iLen: number
        }
        CreateTime: number
        MsgSource: string
        PushContent: string
        NewMsgId: number
        MsgSeq: number
    }
}

/*
{
    "TypeName": "AddMsg",   消息类型
    "Appid": "wx_wR_U4zPj2M_OTS3BCyoE4",  设备ID
    "Wxid": "wxid_phyyedw9xap22",  所属微信的wxid
    "Data":
    {
        "MsgId": 1040356105,    消息ID
        "FromUserName":
        {
            "string": "wxid_phyyedw9xap22"    消息发送人的wxid
        },
        "ToUserName":
        {
            "string": "wxid_0xsqb3o0tsvz22"  消息接收人的wxid
        },
        "MsgType": 49,
        "Content":
        {
            "string": "<?xml version=\"1.0\"?>\n<msg>\n\t<appmsg appid=\"\" sdkver=\"0\">\n\t\t<title>尔滨，又有好消息！</title>\n\t\t<des />\n\t\t<action />\n\t\t<type>5</type>\n\t\t<showtype>0</showtype>\n\t\t<soundtype>0</soundtype>\n\t\t<mediatagname />\n\t\t<messageext />\n\t\t<messageaction />\n\t\t<content />\n\t\t<contentattr>0</contentattr>\n\t\t<url>http://mp.weixin.qq.com/s?__biz=MzA4NDI3NjcyNA==&amp;mid=2650011300&amp;idx=1&amp;sn=52739c3d39c030394da972e3d83efc98&amp;chksm=86ed931f730a3e19a5edc840896d9bf1ad1f8b60cdccafea6a9e7a38a0a33f261877d334622b&amp;scene=0&amp;xtrack=1#rd</url>\n\t\t<lowurl />\n\t\t<dataurl />\n\t\t<lowdataurl />\n\t\t<appattach>\n\t\t\t<totallen>0</totallen>\n\t\t\t<attachid />\n\t\t\t<emoticonmd5 />\n\t\t\t<fileext />\n\t\t\t<cdnthumburl>3057020100044b304902010002048399cc8402032f7e350204a810d83a020465a0e829042462343663343435612d333737392d346230612d616434622d6263383038633562643562340204051408030201000405004c53d900</cdnthumburl>\n\t\t\t<cdnthumbmd5>add1b4bcf9cc50c6a8f14ff334bc3d5c</cdnthumbmd5>\n\t\t\t<cdnthumblength>83741</cdnthumblength>\n\t\t\t<cdnthumbwidth>1000</cdnthumbwidth>\n\t\t\t<cdnthumbheight>426</cdnthumbheight>\n\t\t\t<cdnthumbaeskey>37889a1e22c1e58ebd4e6589b999f63e</cdnthumbaeskey>\n\t\t\t<aeskey />\n\t\t</appattach>\n\t\t<extinfo />\n\t\t<sourceusername>gh_6651e07e4b2d</sourceusername>\n\t\t<sourcedisplayname>新华社</sourcedisplayname>\n\t\t<thumburl>https://mmbiz.qpic.cn/mmbiz_jpg/azXQmS1HA7mOP6LHArYqZ5ypK4iajvBdfhNxzyANcQ1eW7ec6yZVj7tv8Lt6tWftSNckDz3j4FqkP04TxARG8dQ/640?wxtype=jpeg&amp;wxfrom=0</thumburl>\n\t\t<md5 />\n\t\t<statextstr />\n\t\t<mmreadershare>\n\t\t\t<itemshowtype>0</itemshowtype>\n\t\t</mmreadershare>\n\t</appmsg>\n\t<fromusername>wxid_phyyedw9xap22</fromusername>\n\t<scene>0</scene>\n\t<appinfo>\n\t\t<version>1</version>\n\t\t<appname></appname>\n\t</appinfo>\n\t<commenturl></commenturl>\n</msg>\n" 可用此字段做转发链接
        },
        "Status": 3,
        "ImgStatus": 2,
        "ImgBuf":
        {
            "iLen": 0
        },
        "CreateTime": 1705044033,  消息发送时间
        "MsgSource": "<msgsource>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n\t<alnode>\n\t\t<fr>4</fr>\n\t</alnode>\n\t<sec_msg_node>\n\t\t<uuid>ba15c632e8fa89ed84bd027f09495591_</uuid>\n\t</sec_msg_node>\n\t<signature>v1_ptaEL1bv</signature>\n</msgsource>\n",
        "PushContent": "朝夕。 : [链接]尔滨，又有好消息！",   消息通知内容
        "NewMsgId": 1623411326098221490,   消息ID
        "MsgSeq": 640356105
    }
}
*/

export interface MessageLink {
    TypeName: string
    Appid: string
    Wxid: string
    Data: {
        MsgId: number
        FromUserName: {
            string: string
        }
        ToUserName: {
            string: string
        }
        MsgType: number
        Content: {
            string: string
        }
        Status: number
        ImgStatus: number
        ImgBuf: {
            iLen: number
        }
        CreateTime: number
        MsgSource: string
        PushContent: string
        NewMsgId: number
        MsgSeq: number
    }
}

/*
{
    "TypeName": "AddMsg",   消息类型
    "Appid": "wx_wR_U4zPj2M_OTS3BCyoE4",  设备ID
    "Wxid": "wxid_phyyedw9xap22",  所属微信的wxid
    "Data":
    {
        "MsgId": 1040356106,    消息ID
        "FromUserName":
        {
            "string": "wxid_phyyedw9xap22"    消息发送人的wxid
        },
        "ToUserName":
        {
            "string": "wxid_0xsqb3o0tsvz22"  消息接收人的wxid
        },
        "MsgType": 49,
        "Content":
        {
            "string": "<msg>\n        <appmsg appid=\"\" sdkver=\"0\">\n                <title><![CDATA[hhh.xlsx]]></title>\n                <type>74</type>\n                <showtype>0</showtype>\n                <appattach>\n                        <totallen>8939</totallen>\n                        <fileext><![CDATA[xlsx]]></fileext>\n                        <fileuploadtoken>v1_paVQtd+CWGr2I3eOg71E6KBpQf0yY9RFQkqDPwT4yMnnbawqveao1vAE0qCOhWcIPkMGZavimUTDFcImr+SaManD8pKVQbBPTUvSmA6UsXgZWqQDOT00VLx7U/hoP3/CwveN2Lk56nxcef/XJiGKrOpAHKHcZvccaGk9/68wsBCOyanya/9xgdHTYxyQp4IadiSe</fileuploadtoken>\n                        <status>0</status>\n                </appattach>\n                <md5><![CDATA[84c6737fe9549270c9b3ca4f6fc88f6f]]></md5>\n                <laninfo><![CDATA[]]></laninfo>\n        </appmsg>\n        <fromusername>wxid_phyyedw9xap22</fromusername>\n</msg>"
        },
        "Status": 3,
        "ImgStatus": 1,
        "ImgBuf":
        {
            "iLen": 0
        },
        "CreateTime": 1705044119,  消息发送时间
        "MsgSource": "<msgsource>\n\t<signature>v1_WyLyIcy+</signature>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n",
        "PushContent": "朝夕。 : [文件]hhh.xlsx",   消息通知内容
        "NewMsgId": 1789783684714859663,   消息ID
        "MsgSeq": 640356106
    }
}
*/

export interface MessageFile {
    TypeName: string
    Appid: string
    Wxid: string
    Data: {
        MsgId: number
        FromUserName: {
            string: string
        }
        ToUserName: {
            string: string
        }
        MsgType: number
        Content: {
            string: string
        }
        Status: number
        ImgStatus: number
        ImgBuf: {
            iLen: number
        }
        CreateTime: number
        MsgSource: string
        PushContent: string
        NewMsgId: number
        MsgSeq: number
    }
}

/*
 {
     "TypeName": "AddMsg",   消息类型
     "Appid": "wx_wR_U4zPj2M_OTS3BCyoE4",  设备ID
     "Wxid": "wxid_phyyedw9xap22",  所属微信的wxid
     "Data":
     {
         "MsgId": 1040356108,    消息ID
         "FromUserName":
         {
             "string": "wxid_phyyedw9xap22"    消息发送人的wxid
         },
         "ToUserName":
         {
             "string": "wxid_0xsqb3o0tsvz22"  消息接收人的wxid
         },
         "MsgType": 42,  消息类型，42是名片消息
         "Content":
         {
             "string": "<?xml version=\"1.0\"?>\n<msg bigheadimgurl=\"http://wx.qlogo.cn/mmhead/ver_1/BPlUtib1uw6EVTDoTj9WMCaOoqI7Ps1kfX8edibNia5BibAfVtSr3mrJRyQib25zbaNsrIloqGdiayibodBsn7M6p7W8ByqAAQ4kpI1ZoPwtqMtNdw/0\" smallheadimgurl=\"http://wx.qlogo.cn/mmhead/ver_1/BPlUtib1uw6EVTDoTj9WMCaOoqI7Ps1kfX8edibNia5BibAfVtSr3mrJRyQib25zbaNsrIloqGdiayibodBsn7M6p7W8ByqAAQ4kpI1ZoPwtqMtNdw/132\" username=\"v3_020b3826fd0301000000000086ef26a2122053000000501ea9a3dba12f95f6b60a0536a1adb6f6352c38d0916c9c74045d85aa396ffcd36a12359708dc161f2fbbfb058ffd5b003a870579a7f7998fee3f9575727a270dd3c9c47854b62f4ccfa6b0bf@stranger\" nickname=\"Ashley\" fullpy=\"Ashley\" shortpy=\"\" alias=\"\" imagestatus=\"4\" scene=\"17\" province=\"安道尔\" city=\"安道尔\" sign=\"\" sex=\"2\" certflag=\"0\" certinfo=\"\" brandIconUrl=\"\" brandHomeUrl=\"\" brandSubscriptConfigUrl=\"\" brandFlags=\"0\" regionCode=\"AD\" biznamecardinfo=\"\" antispamticket=\"v4_000b708f0b040000010000000000ae274636e9919bd3a02b5eeba0651000000050ded0b020927e3c97896a09d47e6e9e459d64bb6fff666e0d660959708ff19f60b838033259f198b332a791eba4334d175a3fde07558245fb38d284b314aa20eb8d387d1bffa5873b9477f1c01632f7a0e4a72890e931226250b34e25f46d3d5e8bc5570975947fa8e0a434173278ed52ab153ee5ec3dbfe1d22f2cb114d591beb6727b8f4601eb3b52ef9627e6ba8256dbaf8aefff785a750b69c3a39e85885dc8818b1bbc1354f2595c3d3629361daec6f3e83d6f4615f6c3df463b9c11990eb44bc3d707037f6b46b31b47a573c7d8bbaa437ac11f96541df26810dbf0895b780a4d8355e3abfab0a8f0501bd4bb363134b7861a3cfc43@stranger\" />\n"  名片中微信号的基本信息，可用于添加好友
         },
         "Status": 3,
         "ImgStatus": 1,
         "ImgBuf":
         {
             "iLen": 0
         },
         "CreateTime": 1705044829,  消息发送时间
         "MsgSource": "<msgsource>\n\t<bizflag>0</bizflag>\n\t<alnode>\n\t\t<fr>2</fr>\n\t</alnode>\n\t<signature>v1_bawbB33Z</signature>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n",
         "PushContent": "朝夕。 : [名片]Ashley",   消息通知内容
         "NewMsgId": 766322251431765776,   消息ID
         "MsgSeq": 640356108
     }
 }
*/

export interface MessageCard {
    TypeName: string
    Appid: string
    Wxid: string
    Data: {
        MsgId: number
        FromUserName: {
            string: string
        }
        ToUserName: {
            string: string
        }
        MsgType: number
        Content: {
            string: string
        }
        Status: number
        ImgStatus: number
        ImgBuf: {
            iLen: number
        }
        CreateTime: number
        MsgSource: string
        PushContent: string
        NewMsgId: number
        MsgSeq: number
    }
}

/*
{
    "TypeName": "AddMsg",   消息类型
    "Appid": "wx_wR_U4zPj2M_OTS3BCyoE4",  设备ID
    "Wxid": "wxid_phyyedw9xap22",  所属微信的wxid
    "Data":
    {
        "MsgId": 1040356109,    消息ID
        "FromUserName":
        {
            "string": "wxid_phyyedw9xap22"    消息发送人的wxid
        },
        "ToUserName":
        {
            "string": "wxid_0xsqb3o0tsvz22"  消息接收人的wxid
        },
        "MsgType": 49,
        "Content":
        {
            "string": "<?xml version=\"1.0\"?>\n<msg>\n\t<appmsg appid=\"\" sdkver=\"0\">\n\t\t<title>腾讯云助手</title>\n\t\t<des>腾讯云助手</des>\n\t\t<type>33</type>\n\t\t<url>https://mp.weixin.qq.com/mp/waerrpage?appid=wxe2039b83454e49ed&amp;type=upgrade&amp;upgradetype=3#wechat_redirect</url>\n\t\t<appattach>\n\t\t\t<cdnthumburl>3057020100044b304902010002048399cc8402032df731020414e461b4020465a0eb8f042463626430353633382d376263632d346161642d396234372d3435613131336339326231640204051808030201000405004c550500</cdnthumburl>\n\t\t\t<cdnthumbmd5>e1284d4ae13ebd9bb2cde5251cdd05e4</cdnthumbmd5>\n\t\t\t<cdnthumblength>52357</cdnthumblength>\n\t\t\t<cdnthumbwidth>720</cdnthumbwidth>\n\t\t\t<cdnthumbheight>576</cdnthumbheight>\n\t\t\t<cdnthumbaeskey>d4142726bc730088f0fa44c9161a0992</cdnthumbaeskey>\n\t\t\t<aeskey>d4142726bc730088f0fa44c9161a0992</aeskey>\n\t\t\t<encryver>0</encryver>\n\t\t\t<filekey>wxid_0xsqb3o0tsvz22_38_1705044879</filekey>\n\t\t</appattach>\n\t\t<sourceusername>gh_44fc2ced7f87@app</sourceusername>\n\t\t<sourcedisplayname>腾讯云助手</sourcedisplayname>\n\t\t<md5>e1284d4ae13ebd9bb2cde5251cdd05e4</md5>\n\t\t<weappinfo>\n\t\t\t<username><![CDATA[gh_44fc2ced7f87@app]]></username>\n\t\t\t<appid><![CDATA[wxe2039b83454e49ed]]></appid>\n\t\t\t<type>2</type>\n\t\t\t<version>594</version>\n\t\t\t<weappiconurl><![CDATA[http://mmbiz.qpic.cn/mmbiz_png/ibdJpKHJ0IksRJXo4ib9nia65YNcIEibhQUONorXibKBoLBX7zqw3eVM6KibrCVPhgV8AeP9BTfSfiaM3s1c0ThQ0jbxA/640?wx_fmt=png&wxfrom=200]]></weappiconurl>\n\t\t\t<pagepath><![CDATA[pages/home-tabs/home-page/home-page.html?sampshare=%7B%22i%22%3A%22100022507185%22%2C%22p%22%3A%22pages%2Fhome-tabs%2Fhome-page%2Fhome-page%22%2C%22d%22%3A0%2C%22m%22%3A%22%E8%BD%AC%E5%8F%91%E6%B6%88%E6%81%AF%E5%8D%A1%E7%89%87%22%7D]]></pagepath>\n\t\t\t<shareId><![CDATA[0_wxe2039b83454e49ed_704fc54cfed53ed6c8e85a2cf504a0f5_1705044877_0]]></shareId>\n\t\t\t<appservicetype>0</appservicetype>\n\t\t\t<brandofficialflag>0</brandofficialflag>\n\t\t\t<showRelievedBuyFlag>538</showRelievedBuyFlag>\n\t\t\t<hasRelievedBuyPlugin>0</hasRelievedBuyPlugin>\n\t\t\t<flagshipflag>0</flagshipflag>\n\t\t\t<subType>0</subType>\n\t\t\t<isprivatemessage>0</isprivatemessage>\n\t\t</weappinfo>\n\t</appmsg>\n\t<fromusername>wxid_phyyedw9xap22</fromusername>\n\t<scene>0</scene>\n\t<appinfo>\n\t\t<version>1</version>\n\t\t<appname></appname>\n\t</appinfo>\n\t<commenturl></commenturl>\n</msg>\n"
        },
        "Status": 3,
        "ImgStatus": 2,
        "ImgBuf":
        {
            "iLen": 0
        },
        "CreateTime": 1705044879,  消息发送时间
        "MsgSource": "<msgsource>\n\t<bizflag>0</bizflag>\n\t<alnode>\n\t\t<fr>2</fr>\n\t</alnode>\n\t<sec_msg_node>\n\t\t<uuid>db46d46fe0a926c4b571dfe9d8096bfa_</uuid>\n\t</sec_msg_node>\n\t<signature>v1_DkelOoZN</signature>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n",
        "PushContent": "朝夕。 : [小程序]腾讯云助手",   消息通知内容
        "NewMsgId": 572974861799389774,   消息ID
        "MsgSeq": 640356109
    }
}
*/

export interface MessageMiniProgram {
    TypeName: string
    Appid: string
    Wxid: string
    Data: {
        MsgId: number
        FromUserName: {
            string: string
        }
        ToUserName: {
            string: string
        }
        MsgType: number
        Content: {
            string: string
        }
        Status: number
        ImgStatus: number
        ImgBuf: {
            iLen: number
        }
        CreateTime: number
        MsgSource: string
        PushContent: string
        NewMsgId: number
        MsgSeq: number
    }
}

/*
{
    "TypeName": "AddMsg",   消息类型
    "Appid": "wx_wR_U4zPj2M_OTS3BCyoE4",  设备ID
    "Wxid": "wxid_phyyedw9xap22",  所属微信的wxid
    "Data":
    {
        "MsgId": 1040356110,    消息ID
        "FromUserName":
        {
            "string": "wxid_phyyedw9xap22"    消息发送人的wxid
        },
        "ToUserName":
        {
            "string": "wxid_0xsqb3o0tsvz22"  消息接收人的wxid
        },
        "MsgType": 49, 消息类型 引用消息
        "Content":
        {
            "string": "<?xml version=\"1.0\"?>\n<msg>\n\t<appmsg appid=\"\" sdkver=\"0\">\n\t\t<title>看看这个</title>\n\t\t<des />\n\t\t<action />\n\t\t<type>57</type>\n\t\t<showtype>0</showtype>\n\t\t<soundtype>0</soundtype>\n\t\t<mediatagname />\n\t\t<messageext />\n\t\t<messageaction />\n\t\t<content />\n\t\t<contentattr>0</contentattr>\n\t\t<url />\n\t\t<lowurl />\n\t\t<dataurl />\n\t\t<lowdataurl />\n\t\t<appattach>\n\t\t\t<totallen>0</totallen>\n\t\t\t<attachid />\n\t\t\t<emoticonmd5 />\n\t\t\t<fileext />\n\t\t\t<aeskey />\n\t\t</appattach>\n\t\t<extinfo />\n\t\t<sourceusername />\n\t\t<sourcedisplayname />\n\t\t<thumburl />\n\t\t<md5 />\n\t\t<statextstr />\n\t\t<refermsg>\n\t\t\t<type>49</type>\n\t\t\t<svrid>3617029648443513152</svrid>\n\t\t\t<fromusr>wxid_phyyedw9xap22</fromusr>\n\t\t\t<chatusr>wxid_phyyedw9xap22</chatusr>\n\t\t\t<displayname>朝夕。</displayname>\n\t\t\t<content>&lt;msg&gt;&lt;appmsg appid=\"\"  sdkver=\"0\"&gt;&lt;title&gt;hhh.xlsx&lt;/title&gt;&lt;des&gt;&lt;/des&gt;&lt;action&gt;&lt;/action&gt;&lt;type&gt;6&lt;/type&gt;&lt;showtype&gt;0&lt;/showtype&gt;&lt;soundtype&gt;0&lt;/soundtype&gt;&lt;mediatagname&gt;&lt;/mediatagname&gt;&lt;messageext&gt;&lt;/messageext&gt;&lt;messageaction&gt;&lt;/messageaction&gt;&lt;content&gt;&lt;/content&gt;&lt;contentattr&gt;0&lt;/contentattr&gt;&lt;url&gt;&lt;/url&gt;&lt;lowurl&gt;&lt;/lowurl&gt;&lt;dataurl&gt;&lt;/dataurl&gt;&lt;lowdataurl&gt;&lt;/lowdataurl&gt;&lt;appattach&gt;&lt;totallen&gt;8939&lt;/totallen&gt;&lt;attachid&gt;@cdn_3057020100044b304902010002043904752002032f7e350204aa0dd83a020465a0e897042430373538386564322d353866642d343234342d386563652d6236353536306438623936610204011800050201000405004c56f900_3f28b0cbd65a86c3a980f3e22808c0fe_1&lt;/attachid&gt;&lt;emoticonmd5&gt;&lt;/emoticonmd5&gt;&lt;fileext&gt;xlsx&lt;/fileext&gt;&lt;cdnattachurl&gt;3057020100044b304902010002043904752002032f7e350204aa0dd83a020465a0e897042430373538386564322d353866642d343234342d386563652d6236353536306438623936610204011800050201000405004c56f900&lt;/cdnattachurl&gt;&lt;aeskey&gt;3f28b0cbd65a86c3a980f3e22808c0fe&lt;/aeskey&gt;&lt;encryver&gt;0&lt;/encryver&gt;&lt;overwrite_newmsgid&gt;1789783684714859663&lt;/overwrite_newmsgid&gt;&lt;fileuploadtoken&gt;v1_paVQtd+CWGr2I3eOg71E6KBpQf0yY9RFQkqDPwT4yMnnbawqveao1vAE0qCOhWcIPkMGZavimUTDFcImr+SaManD8pKVQbBPTUvSmA6UsXgZWqQDOT00VLx7U/hoP3/CwveN2Lk56nxcef/XJiGKrOpAHKHcZvccaGk9/68wsBCOyanya/9xgdHTYxyQp4IadiSe&lt;/fileuploadtoken&gt;&lt;/appattach&gt;&lt;extinfo&gt;&lt;/extinfo&gt;&lt;sourceusername&gt;&lt;/sourceusername&gt;&lt;sourcedisplayname&gt;&lt;/sourcedisplayname&gt;&lt;thumburl&gt;&lt;/thumburl&gt;&lt;md5&gt;84c6737fe9549270c9b3ca4f6fc88f6f&lt;/md5&gt;&lt;statextstr&gt;&lt;/statextstr&gt;&lt;/appmsg&gt;&lt;fromusername&gt;&lt;/fromusername&gt;&lt;appinfo&gt;&lt;version&gt;0&lt;/version&gt;&lt;appname&gt;&lt;/appname&gt;&lt;isforceupdate&gt;1&lt;/isforceupdate&gt;&lt;/appinfo&gt;&lt;/msg&gt;</content>\n\t\t\t<msgsource>&lt;msgsource&gt;\n\t&lt;alnode&gt;\n\t\t&lt;cf&gt;3&lt;/cf&gt;\n\t&lt;/alnode&gt;\n\t&lt;sec_msg_node&gt;\n\t\t&lt;uuid&gt;896374a2b5979141804d509256c22f0b_&lt;/uuid&gt;\n\t&lt;/sec_msg_node&gt;\n&lt;/msgsource&gt;\n</msgsource>\n\t\t</refermsg>\n\t</appmsg>\n\t<fromusername>wxid_phyyedw9xap22</fromusername>\n\t<scene>0</scene>\n\t<appinfo>\n\t\t<version>1</version>\n\t\t<appname></appname>\n\t</appinfo>\n\t<commenturl></commenturl>\n</msg>\n"
        },
        "Status": 3,
        "ImgStatus": 1,
        "ImgBuf":
        {
            "iLen": 0
        },
        "CreateTime": 1705044946,  消息发送时间
        "MsgSource": "<msgsource>\n\t<sec_msg_node>\n\t\t<uuid>ea25ade83dc4b9ec91060ca3e1a0f5a2_</uuid>\n\t</sec_msg_node>\n\t<signature>v1_oTWRYdd1</signature>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n",
        "PushContent": "看看这个",   消息通知内容
        "NewMsgId": 4334300109515885085,   消息ID
        "MsgSeq": 640356110
    }
}
*/

export interface messageReference {
    TypeName: string
    Appid: string
    Wxid: string
    Data: {
        MsgId: number
        FromUserName: {
            string: string
        }
        ToUserName: {
            string: string
        }
        MsgType: number
        Content: {
            string: string
        }
        Status: number
        ImgStatus: number
        ImgBuf: {
            iLen: number
        }
        CreateTime: number
        MsgSource: string
        PushContent: string
        NewMsgId: number
        MsgSeq: number
    }
}

/*
 {
     "TypeName": "AddMsg",   消息类型
     "Appid": "wx_wR_U4zPj2M_OTS3BCyoE4",  设备ID
     "Wxid": "wxid_phyyedw9xap22",  所属微信的wxid
     "Data":
     {
         "MsgId": 1040356112,    消息ID
         "FromUserName":
         {
             "string": "wxid_phyyedw9xap22"    消息发送人的wxid
         },
         "ToUserName":
         {
             "string": "wxid_0xsqb3o0tsvz22"  消息接收人的wxid
         },
         "MsgType": 49,
         "Content":
         {
             "string": "<msg>\n<appmsg appid=\"\" sdkver=\"\">\n<title><![CDATA[微信转账]]></title>\n<des><![CDATA[收到转账0.10元。如需收钱，请点此升级至最新版本]]></des>\n<action></action>\n<type>2000</type>\n<content><![CDATA[]]></content>\n<url><![CDATA[https://support.weixin.qq.com/cgi-bin/mmsupport-bin/readtemplate?t=page/common_page__upgrade&text=text001&btn_text=btn_text_0]]></url>\n<thumburl><![CDATA[https://support.weixin.qq.com/cgi-bin/mmsupport-bin/readtemplate?t=page/common_page__upgrade&text=text001&btn_text=btn_text_0]]></thumburl>\n<lowurl></lowurl>\n<extinfo>\n</extinfo>\n<wcpayinfo>\n<paysubtype>1</paysubtype>\n<feedesc><![CDATA[￥0.10]]></feedesc>\n<transcationid><![CDATA[53010000124165202401122702555054]]></transcationid>\n<transferid><![CDATA[1000050001202401120020624149917]]></transferid>\n<invalidtime><![CDATA[1705131384]]></invalidtime>\n<begintransfertime><![CDATA[1705044984]]></begintransfertime>\n<effectivedate><![CDATA[1]]></effectivedate>\n<pay_memo><![CDATA[]]></pay_memo>\n<receiver_username><![CDATA[wxid_0xsqb3o0tsvz22]]></receiver_username>\n<payer_username><![CDATA[]]></payer_username>\n\n\n</wcpayinfo>\n</appmsg>\n</msg>"
         },
         "Status": 3,
         "ImgStatus": 1,
         "ImgBuf":
         {
             "iLen": 0
         },
         "CreateTime": 1705044984,  消息发送时间
         "MsgSource": "<msgsource>\n\t<signature>v1_eDcIna+F</signature>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n",
         "PushContent": "朝夕。 : [转账]",   消息通知内容
         "NewMsgId": 7290406378327063279,   消息ID
         "MsgSeq": 640356112
     }
 }
*/

export interface MessageTransfer {
    TypeName: string
    Appid: string
    Wxid: string
    Data: {
        MsgId: number
        FromUserName: {
            string: string
        }
        ToUserName: {
            string: string
        }
        MsgType: number
        Content: {
            string: string
        }
        Status: number
        ImgStatus: number
        ImgBuf: {
            iLen: number
        }
        CreateTime: number
        MsgSource: string
        PushContent: string
        NewMsgId: number
        MsgSeq: number
    }
}

/*
 {
     "TypeName": "AddMsg",   消息类型
     "Appid": "wx_wR_U4zPj2M_OTS3BCyoE4",  设备ID
     "Wxid": "wxid_phyyedw9xap22",  所属微信的wxid
     "Data":
     {
         "MsgId": 1040356113,    消息ID
         "FromUserName":
         {
             "string": "wxid_phyyedw9xap22"    消息发送人的wxid
         },
         "ToUserName":
         {
             "string": "wxid_0xsqb3o0tsvz22"  消息接收人的wxid
         },
         "MsgType": 49,
         "Content":
         {
             "string": "<msg>\n\t<appmsg appid=\"\" sdkver=\"\">\n\t\t<des><![CDATA[我给你发了一个红包，赶紧去拆!]]></des>\n\t\t<url><![CDATA[https://wxapp.tenpay.com/mmpayhb/wxhb_personalreceive?showwxpaytitle=1&msgtype=1&channelid=1&sendid=1000039901202401127291056629415&ver=6&sign=af71ceb7b4da8a553a4dc6a02f3fe570678a7d0c69e6c00751a2af91d87f6b2f15ecc91900a7c610a929ade80091ff26a043a46d78ef84f35ccff0bff3003268fc22b8be5cdfe325cd86f7b526154e2b]]></url>\n\t\t<lowurl><![CDATA[]]></lowurl>\n\t\t<type><![CDATA[2001]]></type>\n\t\t<title><![CDATA[微信红包]]></title>\n\t\t<thumburl><![CDATA[https://wx.gtimg.com/hongbao/1800/hb.png]]></thumburl>\n\t\t<wcpayinfo>\n\t\t\t<templateid><![CDATA[7a2a165d31da7fce6dd77e05c300028a]]></templateid>\n\t\t\t<url><![CDATA[https://wxapp.tenpay.com/mmpayhb/wxhb_personalreceive?showwxpaytitle=1&msgtype=1&channelid=1&sendid=1000039901202401127291056629415&ver=6&sign=af71ceb7b4da8a553a4dc6a02f3fe570678a7d0c69e6c00751a2af91d87f6b2f15ecc91900a7c610a929ade80091ff26a043a46d78ef84f35ccff0bff3003268fc22b8be5cdfe325cd86f7b526154e2b]]></url>\n\t\t\t<iconurl><![CDATA[https://wx.gtimg.com/hongbao/1800/hb.png]]></iconurl>\n\t\t\t<receivertitle><![CDATA[恭喜发财，大吉大利]]></receivertitle>\n\t\t\t<sendertitle><![CDATA[恭喜发财，大吉大利]]></sendertitle>\n\t\t\t<scenetext><![CDATA[微信红包]]></scenetext>\n\t\t\t<senderdes><![CDATA[查看红包]]></senderdes>\n\t\t\t<receiverdes><![CDATA[领取红包]]></receiverdes>\n\t\t\t<nativeurl><![CDATA[wxpay://c2cbizmessagehandler/hongbao/receivehongbao?msgtype=1&channelid=1&sendid=1000039901202401127291056629415&sendusername=wxid_phyyedw9xap22&ver=6&sign=af71ceb7b4da8a553a4dc6a02f3fe570678a7d0c69e6c00751a2af91d87f6b2f15ecc91900a7c610a929ade80091ff26a043a46d78ef84f35ccff0bff3003268fc22b8be5cdfe325cd86f7b526154e2b&total_num=1]]></nativeurl>\n\t\t\t<sceneid><![CDATA[1002]]></sceneid>\n\t\t\t<innertype><![CDATA[0]]></innertype>\n\t\t\t<paymsgid><![CDATA[1000039901202401127291056629415]]></paymsgid>\n\t\t\t<scenetext>微信红包</scenetext>\n\t\t\t<locallogoicon><![CDATA[c2c_hongbao_icon_cn]]></locallogoicon>\n\t\t\t<invalidtime><![CDATA[1705131411]]></invalidtime>\n\t\t\t<broaden />\n\t\t</wcpayinfo>\n\t</appmsg>\n\t<fromusername><![CDATA[wxid_phyyedw9xap22]]></fromusername>\n</msg>\n"
         },
         "Status": 3,
         "ImgStatus": 1,
         "ImgBuf":
         {
             "iLen": 0
         },
         "CreateTime": 1705045011,  消息发送时间
         "MsgSource": "<msgsource>\n\t<pushkey />\n\t<ModifyMsgAction />\n\t<signature>v1_Js6wJde/</signature>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n",
         "PushContent": "朝夕。 : [红包]恭喜发财，大吉大利",   消息通知内容
         "NewMsgId": 5517720959405775296,   消息ID
         "MsgSeq": 640356113
     }
 }
*/

export interface MessageRedPacket {
    TypeName: string
    Appid: string
    Wxid: string
    Data: {
        MsgId: number
        FromUserName: {
            string: string
        }
        ToUserName: {
            string: string
        }
        MsgType: number
        Content: {
            string: string
        }
        Status: number
        ImgStatus: number
        ImgBuf: {
            iLen: number
        }
        CreateTime: number
        MsgSource: string
        PushContent: string
        NewMsgId: number
        MsgSeq: number
    }
}

/*
 {
     "TypeName": "AddMsg",   消息类型
     "Appid": "wx_wR_U4zPj2M_OTS3BCyoE4",  设备ID
     "Wxid": "wxid_phyyedw9xap22",  所属微信的wxid
     "Data":
     {
         "MsgId": 1040356115,    消息ID
         "FromUserName":
         {
             "string": "wxid_phyyedw9xap22"    消息发送人的wxid
         },
         "ToUserName":
         {
             "string": "wxid_0xsqb3o0tsvz22"  消息接收人的wxid
         },
         "MsgType": 49,
         "Content":
         {
             "string": "<?xml version=\"1.0\"?>\n<msg>\n\t<appmsg appid=\"\" sdkver=\"0\">\n\t\t<title>当前微信版本不支持展示该内容，请升级至最新版本。</title>\n\t\t<des />\n\t\t<action />\n\t\t<type>51</type>\n\t\t<showtype>0</showtype>\n\t\t<soundtype>0</soundtype>\n\t\t<mediatagname />\n\t\t<messageext />\n\t\t<messageaction />\n\t\t<content />\n\t\t<contentattr>0</contentattr>\n\t\t<url>https://support.weixin.qq.com/update/</url>\n\t\t<lowurl />\n\t\t<dataurl />\n\t\t<lowdataurl />\n\t\t<appattach>\n\t\t\t<totallen>0</totallen>\n\t\t\t<attachid />\n\t\t\t<emoticonmd5 />\n\t\t\t<fileext />\n\t\t\t<aeskey />\n\t\t</appattach>\n\t\t<extinfo />\n\t\t<sourceusername />\n\t\t<sourcedisplayname />\n\t\t<thumburl />\n\t\t<md5 />\n\t\t<statextstr />\n\t\t<finderFeed>\n\t\t\t<objectId>14264358459626428566</objectId>\n\t\t\t<feedType>4</feedType>\n\t\t\t<nickname>国风锦鲤</nickname>\n\t\t\t<avatar>https://wx.qlogo.cn/finderhead/ver_1/x2LxetmLmgoo9jp69R3wcrtZ0LBLdjVv9vrK9HmPNGEdD1iawdrPffPvMmFUez8pWqRIfs7DtgPiaV5C7DZpibH8b3y0jG178aIict6uPf0Vht4/0</avatar>\n\t\t\t<desc>还招人么？我不要工资#逆水寒cos</desc>\n\t\t\t<mediaCount>1</mediaCount>\n\t\t\t<objectNonceId>8046877030770906689_0_0_0_0_0</objectNonceId>\n\t\t\t<liveId>0</liveId>\n\t\t\t<username>v2_060000231003b20faec8cae08b19c7d2c702e834b077fb74f482543ff67f0cc66363057a5443@finder</username>\n\t\t\t<webUrl />\n\t\t\t<authIconType>0</authIconType>\n\t\t\t<authIconUrl />\n\t\t\t<bizNickname />\n\t\t\t<bizAvatar />\n\t\t\t<bizUsernameV2 />\n\t\t\t<mediaList>\n\t\t\t\t<media>\n\t\t\t\t\t<mediaType>4</mediaType>\n\t\t\t\t\t<url>http://wxapp.tc.qq.com/251/20302/stodownload?encfilekey=Cvvj5Ix3eez3Y79SxtvVL0L7CkPM6dFibFeI6caGYwFFDAZJzcvicKz3jic4UfNeiaWTwH9gTlYiafAxVkMZRXicBUBk2Ms7lauAj6SArUu0P9ddKiaa8IWZzYaaKLf1WddH4G8T0KicxQV3hQPH3pQgEMTscw&amp;a=1&amp;bizid=1023&amp;dotrans=0&amp;hy=SH&amp;idx=1&amp;m=4c4c7f3ed03a14a6b99d0d19176c12ac&amp;upid=290110</url>\n\t\t\t\t\t<thumbUrl>http://wxapp.tc.qq.com/251/20304/stodownload?encfilekey=oibeqyX228riaCwo9STVsGLPj9UYCicgttvO59vjtcQ7Jviaia0q4bnpVP2ia7ibqzacPo0z4nIRtWom80ZXwL64icZO2q6ibVBQLZQftMwU3SHj5uplsIFroHeF0QNcCkXX3RtibaWCHJQjfqZUk&amp;bizid=1023&amp;dotrans=0&amp;hy=SH&amp;idx=1&amp;m=7522250b4d15e5df866bf23da9f117d6&amp;token=oA9SZ4icv8IssuhLtacX13nAzXiaf8y52juKW4ibUDN7a2vn71bbrCR0LZiabddvTsLLMvnELnuAwNxViclRT7wT9IyibzFw1pq9wdichRYaEmb6Js&amp;ctsc=2-20</thumbUrl>\n\t\t\t\t\t<width>1080</width>\n\t\t\t\t\t<height>1920</height>\n\t\t\t\t\t<coverUrl>http://wxapp.tc.qq.com/251/20304/stodownload?encfilekey=oibeqyX228riaCwo9STVsGLPj9UYCicgttvO59vjtcQ7Jviaia0q4bnpVP2ia7ibqzacPo0z4nIRtWom80ZXwL64icZO2q6ibVBQLZQftMwU3SHj5uplsIFroHeF0QNcCkXX3RtibaWCHJQjfqZUk&amp;bizid=1023&amp;dotrans=0&amp;hy=SH&amp;idx=1&amp;m=7522250b4d15e5df866bf23da9f117d6&amp;token=oA9SZ4icv8IssuhLtacX13nAzXiaf8y52juKW4ibUDN7a2vn71bbrCR0LZiabddvTsLLMvnELnuAwNxViclRT7wT9IyibzFw1pq9wdichRYaEmb6Js&amp;ctsc=2-20</coverUrl>\n\t\t\t\t\t<fullCoverUrl>http://wxapp.tc.qq.com/251/20350/stodownload?encfilekey=oibeqyX228riaCwo9STVsGLPj9UYCicgttv1FCQXwResqN75zI4n65zY5tkAficEPWbbClq2VcicqMYaSLK7nrAVMasrIhvsCXJib5cOLib98JgWPr4SP92W6YEkVN5Uv0TKAdyRryQ3Qxk7jU&amp;bizid=1023&amp;dotrans=0&amp;hy=SH&amp;idx=1&amp;m=731b89683dd3cb866cdf96dab70ac183&amp;token=KkOFht0mCXlnmicFbJnvymIJOEfZgzia8PY0ZzOdaIYTJXwfblvK4U1ibntribm1beupHwictGWs9hpMiclyhfSb6766Lnb3ib0j14bENm6u1tHpeo&amp;ctsc=3-20</fullCoverUrl>\n\t\t\t\t\t<videoPlayDuration>10&gt;&gt;</videoPlayDuration>\n\t\t\t\t</media>\n\t\t\t</mediaList>\n\t\t</finderFeed>\n\t</appmsg>\n\t<fromusername>wxid_phyyedw9xap22</fromusername>\n\t<scene>0</scene>\n\t<appinfo>\n\t\t<version>1</version>\n\t\t<appname></appname>\n\t</appinfo>\n\t<commenturl></commenturl>\n</msg>\n"
         },
         "Status": 3,
         "ImgStatus": 1,
         "ImgBuf":
         {
             "iLen": 0
         },
         "CreateTime": 1705045057,  消息发送时间
         "MsgSource": "<msgsource>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n\t<alnode>\n\t\t<fr>4</fr>\n\t</alnode>\n\t<sec_msg_node>\n\t\t<uuid>bb2cbd9d3290e7a3d35f183eaade2213_</uuid>\n\t</sec_msg_node>\n\t<signature>v1_+Tfo41HS</signature>\n</msgsource>\n",
         "PushContent": "你收到了一条消息",   消息通知内容
         "NewMsgId": 5576224237104747184,   消息ID
         "MsgSeq": 640356115
     }
 }
*/

export interface MessageVideoApp {
    TypeName: string
    Appid: string
    Wxid: string
    Data: {
        MsgId: number
        FromUserName: {
            string: string
        }
        ToUserName: {
            string: string
        }
        MsgType: number
        Content: {
            string: string
        }
        Status: number
        ImgStatus: number
        ImgBuf: {
            iLen: number
        }
        CreateTime: number
        MsgSource: string
        PushContent: string
        NewMsgId: number
        MsgSeq: number
    }
}

/*
 {
     "TypeName": "AddMsg",   消息类型
     "Appid": "wx_wR_U4zPj2M_OTS3BCyoE4",  设备ID
     "Wxid": "wxid_phyyedw9xap22",  所属微信的wxid
     "Data":
     {
         "MsgId": 1040356116,    消息ID
         "FromUserName":
         {
             "string": "wxid_phyyedw9xap22"    消息发送人的wxid
         },
         "ToUserName":
         {
             "string": "wxid_0xsqb3o0tsvz22"  消息接收人的wxid
         },
         "MsgType": 10002,
         "Content":
         {
             "string": "<sysmsg type=\"revokemsg\"><revokemsg><session>wxid_phyyedw9xap22</session><msgid>1040356115</msgid><newmsgid>5576224237104747184</newmsgid><replacemsg><![CDATA[\"朝夕。\" 撤回了一条消息]]></replacemsg></revokemsg></sysmsg>"
         },
         "Status": 3,
         "ImgStatus": 1,
         "ImgBuf":
         {
             "iLen": 0
         },
         "CreateTime": 1705045083,  消息发送时间
         "MsgSource": "<msgsource>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n",
         "NewMsgId": 1968256046,   消息ID
         "MsgSeq": 640356116
     }
 }
*/

export interface MessageRevoke {
    TypeName: string
    Appid: string
    Wxid: string
    Data: {
        MsgId: number
        FromUserName: {
            string: string
        }
        ToUserName: {
            string: string
        }
        MsgType: number
        Content: {
            string: string
        }
        Status: number
        ImgStatus: number
        ImgBuf: {
            iLen: number
        }
        CreateTime: number
        MsgSource: string
        NewMsgId: number
        MsgSeq: number
    }
}

/*
{
    "TypeName": "AddMsg",   消息类型
    "Appid": "wx_wR_U4zPj2M_OTS3BCyoE4",  设备ID
    "Wxid": "wxid_phyyedw9xap22",  所属微信的wxid
    "Data":
    {
        "MsgId": 1040356117,    消息ID
        "FromUserName":
        {
            "string": "wxid_phyyedw9xap22"    消息发送人的wxid
        },
        "ToUserName":
        {
            "string": "wxid_0xsqb3o0tsvz22"  消息接收人的wxid
        },
        "MsgType": 10002,
        "Content":
        {
            "string": "<sysmsg type=\"pat\">\n<pat>\n  <fromusername>wxid_phyyedw9xap22</fromusername>\n  <chatusername>wxid_0xsqb3o0tsvz22</chatusername>\n  <pattedusername>wxid_0xsqb3o0tsvz22</pattedusername>\n  <patsuffix><![CDATA[]]></patsuffix>\n  <patsuffixversion>0</patsuffixversion>\n\n\n\n\n  <template><![CDATA[\"${wxid_phyyedw9xap22}\" 拍了拍我]]></template>\n\n\n\n\n</pat>\n</sysmsg>"
        },
        "Status": 3,
        "ImgStatus": 1,
        "ImgBuf":
        {
            "iLen": 0
        },
        "CreateTime": 1705045115,  消息发送时间
        "MsgSource": "<msgsource>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n",
        "NewMsgId": 5709690173850254331,   消息ID
        "MsgSeq": 640356117
    }
}
*/

export interface MessagePat {
    TypeName: string
    Appid: string
    Wxid: string
    Data: {
        MsgId: number
        FromUserName: {
            string: string
        }
        ToUserName: {
            string: string
        }
        MsgType: number
        Content: {
            string: string
        }
        Status: number
        ImgStatus: number
        ImgBuf: {
            iLen: number
        }
        CreateTime: number
        MsgSource: string
        NewMsgId: number
        MsgSeq: number
    }
}

/*
{
    "TypeName": "AddMsg",   消息类型
    "Appid": "wx_wR_U4zPj2M_OTS3BCyoE4",  设备ID
    "Wxid": "wxid_phyyedw9xap22",  所属微信的wxid
    "Data":
    {
        "MsgId": 1040356118,    消息ID
        "FromUserName":
        {
            "string": "wxid_phyyedw9xap22"    消息发送人的wxid
        },
        "ToUserName":
        {
            "string": "wxid_0xsqb3o0tsvz22"  消息接收人的wxid
        },
        "MsgType": 48, 消息类型，48是地理位置消息
        "Content":
        {
            "string": "<?xml version=\"1.0\"?>\n<msg>\n\t<location x=\"39.903740\" y=\"116.397827\" scale=\"15\" label=\"北京市东城区东长安街\" maptype=\"roadmap\" poiname=\"北京天安门广场\" poiid=\"qqmap_8314157447236438749\" buildingId=\"\" floorName=\"\" poiCategoryTips=\"旅游景点:风景名胜\" poiBusinessHour=\"随升降国旗时间调整,可登陆天安门地区管委会官网查询升降旗时刻表,或官方电话咨询\" poiPhone=\"010-63095745;010-86409123\" poiPriceTips=\"\" isFromPoiList=\"true\" adcode=\"110101\" cityname=\"北京市\" />\n</msg>\n"
        },
        "Status": 3,
        "ImgStatus": 1,
        "ImgBuf":
        {
            "iLen": 0
        },
        "CreateTime": 1705045153,  消息发送时间
        "MsgSource": "<msgsource>\n\t<bizflag>0</bizflag>\n\t<signature>v1_KgQA8C+H</signature>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n",
        "PushContent": "朝夕。分享了一个地理位置",   消息通知内容
        "NewMsgId": 2112726776406556053,   消息ID
        "MsgSeq": 640356118
    }
}
*/

export interface MessageLocation {
    TypeName: string
    Appid: string
    Wxid: string
    Data: {
        MsgId: number
        FromUserName: {
            string: string
        }
        ToUserName: {
            string: string
        }
        MsgType: number
        Content: {
            string: string
        }
        Status: number
        ImgStatus: number
        ImgBuf: {
            iLen: number
        }
        CreateTime: number
        MsgSource: string
        PushContent: string
        NewMsgId: number
        MsgSeq: number
    }
}
