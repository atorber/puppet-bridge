/*
{
    "TypeName": "AddMsg",   消息类型
    "Appid": "wx_wR_U4zPj2M_OTS3BCyoE4",  设备ID
    "Wxid": "wxid_phyyedw9xap22",  所属微信的wxid
    "Data":
    {
        "MsgId": 1040356107,    消息ID
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
            "string": "<?xml version=\"1.0\"?>\n<msg>\n\t<appmsg appid=\"\" sdkver=\"0\">\n\t\t<title>hhh.xlsx</title>\n\t\t<des />\n\t\t<action />\n\t\t<type>6</type>\n\t\t<showtype>0</showtype>\n\t\t<soundtype>0</soundtype>\n\t\t<mediatagname />\n\t\t<messageext />\n\t\t<messageaction />\n\t\t<content />\n\t\t<contentattr>0</contentattr>\n\t\t<url />\n\t\t<lowurl />\n\t\t<dataurl />\n\t\t<lowdataurl />\n\t\t<appattach>\n\t\t\t<totallen>8939</totallen>\n\t\t\t<attachid>@cdn_3057020100044b304902010002043904752002032f7e350204aa0dd83a020465a0e897042430373538386564322d353866642d343234342d386563652d6236353536306438623936610204011800050201000405004c56f900_3f28b0cbd65a86c3a980f3e22808c0fe_1</attachid>\n\t\t\t<emoticonmd5 />\n\t\t\t<fileext>xlsx</fileext>\n\t\t\t<cdnattachurl>3057020100044b304902010002043904752002032f7e350204aa0dd83a020465a0e897042430373538386564322d353866642d343234342d386563652d6236353536306438623936610204011800050201000405004c56f900</cdnattachurl>\n\t\t\t<aeskey>3f28b0cbd65a86c3a980f3e22808c0fe</aeskey>\n\t\t\t<encryver>0</encryver>\n\t\t\t<overwrite_newmsgid>1789783684714859663</overwrite_newmsgid>\n\t\t\t<fileuploadtoken>v1_paVQtd+CWGr2I3eOg71E6KBpQf0yY9RFQkqDPwT4yMnnbawqveao1vAE0qCOhWcIPkMGZavimUTDFcImr+SaManD8pKVQbBPTUvSmA6UsXgZWqQDOT00VLx7U/hoP3/CwveN2Lk56nxcef/XJiGKrOpAHKHcZvccaGk9/68wsBCOyanya/9xgdHTYxyQp4IadiSe</fileuploadtoken>\n\t\t</appattach>\n\t\t<extinfo />\n\t\t<sourceusername />\n\t\t<sourcedisplayname />\n\t\t<thumburl />\n\t\t<md5>84c6737fe9549270c9b3ca4f6fc88f6f</md5>\n\t\t<statextstr />\n\t</appmsg>\n\t<fromusername>wxid_phyyedw9xap22</fromusername>\n\t<scene>0</scene>\n\t<appinfo>\n\t\t<version>1</version>\n\t\t<appname></appname>\n\t</appinfo>\n\t<commenturl></commenturl>\n</msg>\n"
        },
        "Status": 3,
        "ImgStatus": 1,
        "ImgBuf":
        {
            "iLen": 0
        },
        "CreateTime": 1705044119,  消息发送时间
        "MsgSource": "<msgsource>\n\t<alnode>\n\t\t<cf>3</cf>\n\t</alnode>\n\t<sec_msg_node>\n\t\t<uuid>896374a2b5979141804d509256c22f0b_</uuid>\n\t</sec_msg_node>\n\t<signature>v1_n7kZ01bp</signature>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n",
        "PushContent": "朝夕。 : [文件]hhh.xlsx",   消息通知内容
        "NewMsgId": 3617029648443513152,   消息ID
        "MsgSeq": 640356107
    }
}
*/

export interface FileMessageFinish {
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
        "MsgId": 1040356166,    消息ID
        "FromUserName":
        {
            "string": "fmessage"    消息发送人的wxid
        },
        "ToUserName":
        {
            "string": "wxid_0xsqb3o0tsvz22"  消息接收人的wxid
        },
        "MsgType": 37,  消息类型，37是好友添加请求通知
        "Content":
        {
            "string": "<msg fromusername=\"wxid_phyyedw9xap22\" encryptusername=\"v3_020b3826fd03010000000000feba078fc1e760000000501ea9a3dba12f95f6b60a0536a1adb6f6352c38d0916c9c74045d85aa602efa2d81b84adde05d285124e8a54b9fcd039f725d6ac0d3bd651c7c74503a@stranger\" fromnickname=\"朝夕。\" content=\"我是朝夕。\" fullpy=\"chaoxi\" shortpy=\"CX\" imagestatus=\"3\" scene=\"6\" country=\"\" province=\"\" city=\"\" sign=\"\" percard=\"0\" sex=\"1\" alias=\"\" weibo=\"\" albumflag=\"3\" albumstyle=\"0\" albumbgimgid=\"\" snsflag=\"273\" snsbgimgid=\"http://shmmsns.qpic.cn/mmsns/FzeKA69P5uIdqPfQxp59LvOohoE2iaiaj86IBH1jl0F76aGvg8AlU7giaMtBhQ3bPibunbhVLb3aEq4/0\" snsbgobjectid=\"14216284872728580667\" mhash=\"d36f4cc1c8bba1df41b93d2215133cdb\" mfullhash=\"d36f4cc1c8bba1df41b93d2215133cdb\" bigheadimgurl=\"http://wx.qlogo.cn/mmhead/ver_1/G3G6r1OBfCIO40FTribZ3WvrLQbnMibfT5PyRaxeyjXgLqA8M94lKic3ibOztlrawo2xpVQaH7V6yhYATia3GKbVH8MhRbnKQGfNZ4EY8Zc85uy49P5WSZZrntbECUpQfrjRu/0\" smallheadimgurl=\"http://wx.qlogo.cn/mmhead/ver_1/G3G6r1OBfCIO40FTribZ3WvrLQbnMibfT5PyRaxeyjXgLqA8M94lKic3ibOztlrawo2xpVQaH7V6yhYATia3GKbVH8MhRbnKQGfNZ4EY8Zc85uy49P5WSZZrntbECUpQfrjRu/132\" ticket=\"v4_000b708f0b040000010000000000c502ff3b59b31c08394fdaefa0651000000050ded0b020927e3c97896a09d47e6e9eec84bb6bebe542fb120b366298a0157c280337855083f4a87fc4b15cfba311a11720041ce2d9f8a575cf7b432a2c0bebc5ed9c9a70bf7784c54ebbfb816e54e0fda2befcf2f873d162f5ed54108c76ce53310321077ced22420c5fbd199cff57d8e0a583f155e7e558@stranger\" opcode=\"2\" googlecontact=\"\" qrticket=\"\" chatroomusername=\"\" sourceusername=\"\" sourcenickname=\"\" sharecardusername=\"\" sharecardnickname=\"\" cardversion=\"\" extflag=\"0\"><brandlist count=\"0\" ver=\"640356091\"></brandlist></msg>"  请求添加好友微信号的基本信息，可用于添加好友
        },
        "Status": 3,
        "ImgStatus": 1,
        "ImgBuf":
        {
            "iLen": 0
        },
        "CreateTime": 1705045979,  消息发送时间
        "MsgSource": "<msgsource>\n\t<signature>v1_GOrHWRNL</signature>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n",
        "NewMsgId": 1109510141823131559,   消息ID
        "MsgSeq": 640356166
    }
}
*/

export interface FriendRequest {
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
    "Appid": "wx_wR_U4zPj2M_OTS3BCyoE4",
    "TypeName": "ModContacts",
    "Data":
    {
        "UserName":
        {
            "string": "wxid_0xsqb3o0tsvz22"
        },
        "NickName":
        {
            "string": "chaoxi。"
        },
        "PyInitial":
        {
            "string": "CX"
        },
        "QuanPin":
        {
            "string": "chaoxi"
        },
        "Sex": 1,
        "ImgBuf":
        {
            "iLen": 0
        },
        "BitMask": 4294967295,
        "BitVal": 3,
        "ImgFlag": 1,
        "Remark":
        {},
        "RemarkPyinitial":
        {},
        "RemarkQuanPin":
        {},
        "ContactType": 0,
        "RoomInfoCount": 0,
        "DomainList": [
        {}],
        "ChatRoomNotify": 0,
        "AddContactScene": 0,
        "Province": "Jiangsu",
        "City": "Nanjing",
        "Signature": "......",
        "PersonalCard": 0,
        "HasWeiXinHdHeadImg": 1,
        "VerifyFlag": 0,
        "Level": 6,
        "Source": 14,
        "WeiboFlag": 0,
        "AlbumStyle": 0,
        "AlbumFlag": 3,
        "SnsUserInfo":
        {
            "SnsFlag": 1,
            "SnsBgimgId": "http://shmmsns.qpic.cn/mmsns/FzeKA69P5uIdqPfQxp59LvOohoE2iaiaj86IBH1jl0F76aGvg8AlU7giaMtBhQ3bPibunbhVLb3aEq4/0",
            "SnsBgobjectId": 14216284872728580667,
            "SnsFlagEx": 7297
        },
        "Country": "CN",
        "BigHeadImgUrl": "https://wx.qlogo.cn/mmhead/ver_1/qqncCu2avRYruPcQbav3PrwaGSS31QgN6dqW8q1XuDKjgiaAuwoFPw3kN8Cj3zIBL36M93R2Xwib0IddUK3gqbFeezEiaA8K2mMdibT5VUDDrbn7F7M1Mxicmows9cdYNOicjI/0",
        "SmallHeadImgUrl": "https://wx.qlogo.cn/mmhead/ver_1/qqncCu2avRYruPcQbav3PrwaGSS31QgN6dqW8q1XuDKjgiaAuwoFPw3kN8Cj3zIBL36M93R2Xwib0IddUK3gqbFeezEiaA8K2mMdibT5VUDDrbn7F7M1Mxicmows9cdYNOicjI/132",
        "CustomizedInfo":
        {
            "BrandFlag": 0
        },
        "EncryptUserName": "v3_020b3826fd03010000000000feba078fc1e760000000501ea9a3dba12f95f6b60a0536a1adb6f6352c38d0916c9c74045d85aa602efa2d81b84adde05d285124e8a54b9fcd039f725d6ac0d3bd651c7c74503a@stranger",
        "AdditionalContactList":
        {
            "LinkedinContactItem":
            {}
        },
        "ChatroomMaxCount": 0,
        "DeleteFlag": 0,
        "Description": "\b\u0000\u0018\u0000\"\u0000(\u00008\u0000",
        "ChatroomStatus": 0,
        "Extflag": 0,
        "ChatRoomBusinessType": 0
    }
}
*/

export interface ModContacts {
    TypeName: string
    Appid: string
    Data: {
        UserName: {
            string: string
        }
        NickName: {
            string: string
        }
        PyInitial: {
            string: string
        }
        QuanPin: {
            string: string
        }
        Sex: number,
        ImgBuf: {
            iLen: number
        }
        BitMask: number
        BitVal: number
        ImgFlag: number
        Remark: {}
        RemarkPyinitial: {}
        RemarkQuanPin: {}
        ContactType: number
        RoomInfoCount: number
        DomainList: [{}]
        ChatRoomNotify: number
        AddContactScene: number
        Province: string
        City: string
        Signature: string
        PersonalCard: number
        HasWeiXinHdHeadImg: number
        VerifyFlag: number
        Level: number
        Source: number
        WeiboFlag: number
        AlbumStyle: number
        AlbumFlag: number
        SnsUserInfo: {
            SnsFlag: number
            SnsBgimgId: string
            SnsBgobjectId: number
            SnsFlagEx: number
        }
        Country: string
        BigHeadImgUrl: string
        SmallHeadImgUrl: string
        CustomizedInfo: {
            BrandFlag: number
        }
        EncryptUserName: string
        AdditionalContactList: {
            LinkedinContactItem: {}
        }
        ChatroomMaxCount: number
        DeleteFlag: number
        Description: string
        ChatroomStatus: number
        Extflag: number
        ChatRoomBusinessType: number
    }
}

/*
{
    "TypeName": "AddMsg",   消息类型
    "Appid": "wx_wR_U4zPj2M_OTS3BCyoE4",  设备ID
    "Wxid": "wxid_phyyedw9xap22",  所属微信的wxid
    "Data":
    {
        "MsgId": 1040356119,    消息ID
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
            "string": "<msg><appmsg appid=\"\" sdkver=\"\"><title><![CDATA[邀请你加入群聊]]></title><des><![CDATA[\"朝夕。\"邀请你加入群聊\"Dromara-SMS4J短信融合\"，进入可查看详情。]]></des><action>view</action><type>5</type><showtype>0</showtype><content></content><url><![CDATA[https://support.weixin.qq.com/cgi-bin/mmsupport-bin/addchatroombyinvite?ticket=AXsLYmiiEo2srduLzYSmog%3D%3D]]></url><thumburl><![CDATA[http://wx.qlogo.cn/mmcrhead/B2EfAOZfS1iaGsFHkJKrP2EN0RbrbBFnQLuqy6iaT8g50SWyibc3pPcrcBibfUbnPdArNdbY00hXGScb8iakSHicBJryzxW7GVCBkI/0]]></thumburl><lowurl></lowurl><appattach><totallen>0</totallen><attachid></attachid><fileext></fileext></appattach><extinfo></extinfo></appmsg><appinfo><version></version><appname></appname></appinfo></msg>"
        },
        "Status": 3,
        "ImgStatus": 0,
        "ImgBuf":
        {
            "iLen": 0
        },
        "CreateTime": 1705045206,  消息发送时间
        "MsgSource": "<msgsource>\n\t<signature>v1_uHiWbihr</signature>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n",
        "NewMsgId": 2331390497668538400,   消息ID
        "MsgSeq": 640356119
    }
}
群邀请消息
*/

export interface RoomInvite {
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
        "MsgId": 1040356153,    消息ID
        "FromUserName":
        {
            "string": "39238473509@chatroom"   所在群聊的ID
        },
        "ToUserName":
        {
            "string": "wxid_0xsqb3o0tsvz22"  消息接收人的wxid
        },
        "MsgType": 10000,
        "Content":
        {
            "string": "你被\"朝夕。\"移出群聊"
        },
        "Status": 4,
        "ImgStatus": 1,
        "ImgBuf":
        {
            "iLen": 0
        },
        "CreateTime": 1705045790,  消息发送时间
        "MsgSource": "<msgsource>\n\t<signature>v1_f7Xny9H/</signature>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n",
        "NewMsgId": 5759605552965664254,   消息ID
        "MsgSeq": 640356153
    }
}
*/

export interface RoomRemove {
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
        "MsgId": 1040356143,    消息ID
        "FromUserName":
        {
            "string": "34757816141@chatroom"    所在群聊的ID
        },
        "ToUserName":
        {
            "string": "wxid_0xsqb3o0tsvz22"  消息接收人的wxid
        },
        "MsgType": 10002,
        "Content":
        {
            "string": "34757816141@chatroom:\n<sysmsg type=\"sysmsgtemplate\">\n\t<sysmsgtemplate>\n\t\t<content_template type=\"tmpl_type_profile\">\n\t\t\t<plain><![CDATA[]]></plain>\n\t\t\t<template><![CDATA[你将\"$kickoutname$\"移出了群聊]]></template>\n\t\t\t<link_list>\n\t\t\t\t<link name=\"kickoutname\" type=\"link_profile\">\n\t\t\t\t\t<memberlist>\n\t\t\t\t\t\t<member>\n\t\t\t\t\t\t\t<username><![CDATA[wxid_8pvka4jg6qzt22]]></username>\n\t\t\t\t\t\t\t<nickname><![CDATA[白开水加糖]]></nickname>\n\t\t\t\t\t\t</member>\n\t\t\t\t\t</memberlist>\n\t\t\t\t</link>\n\t\t\t</link_list>\n\t\t</content_template>\n\t</sysmsgtemplate>\n</sysmsg>\n"
        },
        "Status": 4,
        "ImgStatus": 1,
        "ImgBuf":
        {
            "iLen": 0
        },
        "CreateTime": 1705045666,  消息发送时间
        "MsgSource": "<msgsource>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n",
        "NewMsgId": 7100572668516374210,   消息ID
        "MsgSeq": 640356143
    }
}
*/

export interface RoomKickout {
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
        "MsgId": 1040356158,    消息ID
        "FromUserName":
        {
            "string": "39238473509@chatroom"    所在群聊的ID
        },
        "ToUserName":
        {
            "string": "wxid_0xsqb3o0tsvz22"  消息接收人的wxid
        },
        "MsgType": 10002,
        "Content":
        {
            "string": "39238473509@chatroom:\n<sysmsg type=\"sysmsgtemplate\">\n    <sysmsgtemplate>\n    <content_template type=\"new_tmpl_type_succeed_contact\">\n        <plain><![CDATA[]]></plain>\n        <template><![CDATA[群主\"$identity$\"已解散该群聊]]></template>\n        <link_list>\n        <link name=\"identity\" type=\"link_profile\">\n                <memberlist>\n                <member>\n                    <username><![CDATA[wxid_phyyedw9xap22]]></username>\n                    <nickname><![CDATA[朝夕。]]></nickname>\n                </member>\n                </memberlist>\n        </link>\n        </link_list>\n    </content_template>\n    </sysmsgtemplate>\n</sysmsg>"
        },
        "Status": 4,
        "ImgStatus": 1,
        "ImgBuf":
        {
            "iLen": 0
        },
        "CreateTime": 1705045834,  消息发送时间
        "MsgSource": "<msgsource>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n",
        "NewMsgId": 6869316888754169027,   消息ID
        "MsgSeq": 640356158
    }
}
*/

export interface RoomDismiss {
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
        "MsgId": 1040356129,    消息ID
        "FromUserName":
        {
            "string": "34757816141@chatroom"    所在群聊的ID
        },
        "ToUserName":
        {
            "string": "wxid_0xsqb3o0tsvz22"  消息接收人的wxid
        },
        "MsgType": 10000,
        "Content":
        {
            "string": "你修改群名为“GeWe test1”"
        },
        "Status": 4,
        "ImgStatus": 1,
        "ImgBuf":
        {
            "iLen": 0
        },
        "CreateTime": 1705045517,  消息发送时间
        "MsgSource": "<msgsource>\n\t<signature>v1_3uPmlxJG</signature>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n",
        "NewMsgId": 6984814725261047392,   消息ID
        "MsgSeq": 640356129
    }
}
*/

export interface RoomRename {
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
         "MsgId": 1040356125,    消息ID
         "FromUserName":
         {
             "string": "34757816141@chatroom"    所在群聊的ID
         },
         "ToUserName":
         {
             "string": "wxid_0xsqb3o0tsvz22"  消息接收人的wxid
         },
         "MsgType": 10000,
         "Content":
         {
             "string": "你已成为新群主"
         },
         "Status": 4,
         "ImgStatus": 1,
         "ImgBuf":
         {
             "iLen": 0
         },
         "CreateTime": 1705045441,  消息发送时间
         "MsgSource": "<msgsource>\n\t<signature>v1_iqIx6JkV</signature>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n",
         "NewMsgId": 7268255507978211143,   消息ID
         "MsgSeq": 640356125
     }
 }
*/

export interface RoomOwner {
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
         "MsgId": 1040356125,    消息ID
         "FromUserName":
         {
             "string": "34757816141@chatroom"    所在群聊的ID
         },
         "ToUserName":
         {
             "string": "wxid_0xsqb3o0tsvz22"  消息接收人的wxid
         },
         "MsgType": 10000,
         "Content":
         {
             "string": "你已成为新群主"
         },
         "Status": 4,
         "ImgStatus": 1,
         "ImgBuf":
         {
             "iLen": 0
         },
         "CreateTime": 1705045441,  消息发送时间
         "MsgSource": "<msgsource>\n\t<signature>v1_iqIx6JkV</signature>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n",
         "NewMsgId": 7268255507978211143,   消息ID
         "MsgSeq": 640356125
     }
 }
群信息变更
*/

export interface RoomInfoChange {
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
        "MsgId": 1040356133,    消息ID
        "FromUserName":
        {
            "string": "wxid_0xsqb3o0tsvz22"    发布人的wxid
        },
        "ToUserName":
        {
            "string": "34757816141@chatroom"   所在群聊的ID
        },
        "MsgType": 10002,
        "Content":
        {
            "string": "<sysmsg type=\"mmchatroombarannouncememt\">\n    <mmchatroombarannouncememt>\n        <content><![CDATA[群公告哈1]]></content>\n        <xmlcontent><![CDATA[<group_notice_item type=\"18\">\n\t<edittime>1705045558</edittime>\n\t<ctrlflag>127</ctrlflag>\n\t<version>1</version>\n\t<source sourcetype=\"6\" sourceid=\"7c79fed82a0037648954bba6d5ca2025\">\n\t\t<fromusr>wxid_0xsqb3o0tsvz22</fromusr>\n\t\t<tousr>34757816141@chatroom</tousr>\n\t\t<sourceid>7c79fed82a0037648954bba6d5ca2025</sourceid>\n\t</source>\n\t<datalist count=\"2\">\n\t\t<dataitem datatype=\"8\" dataid=\"bf9b1a59a2589cfadbf44eafb7c67da2\" htmlid=\"WeNoteHtmlFile\">\n\t\t\t<datafmt>.htm</datafmt>\n\t\t\t<cdn_dataurl>http://wxapp.tc.qq.com/264/20303/stodownload?m=145a874d4eb1bb0b85af928331a168aa&amp;filekey=3033020101041f301d02020108040253480410145a874d4eb1bb0b85af928331a168aa020120040d00000004627466730000000132&amp;hy=SH&amp;storeid=265a0ee36000a9c94f3064bb50000010800004f4f534825960b01e676a0b3b&amp;bizid=1023</cdn_dataurl>\n\t\t\t<cdn_thumbkey>24808ae91ac7d636c99a1b340a1f9253</cdn_thumbkey>\n\t\t\t<cdn_datakey>8fac8374ded0d5e8d5038b1ec2b77a62</cdn_datakey>\n\t\t\t<fullmd5>ef033738f28bb3c80cd5e7290fdbfdcf</fullmd5>\n\t\t\t<head256md5>ef033738f28bb3c80cd5e7290fdbfdcf</head256md5>\n\t\t\t<fullsize>20</fullsize>\n\t\t</dataitem>\n\t\t<dataitem datatype=\"1\" dataid=\"eb7fad2f1c28512d1e6a8069c7b159b7\" htmlid=\"-1\">\n\t\t\t<datadesc>群公告哈1</datadesc>\n\t\t\t<dataitemsource sourcetype=\"6\" />\n\t\t</dataitem>\n\t</datalist>\n\t<weburlitem>\n\t\t<appmsgshareitem>\n\t\t\t<itemshowtype>-1</itemshowtype>\n\t\t</appmsgshareitem>\n\t</weburlitem>\n\t<announcement_id>wxid_0xsqb3o0tsvz22_34757816141@chatroom_1705045558_2028281562</announcement_id>\n</group_notice_item>\n]]></xmlcontent>\n        <announcement_id><![CDATA[wxid_0xsqb3o0tsvz22_34757816141@chatroom_1705045558_2028281562]]></announcement_id>\n    </mmchatroombarannouncememt>\n</sysmsg>"
        },
        "Status": 3,
        "ImgStatus": 1,
        "ImgBuf":
        {
            "iLen": 0
        },
        "CreateTime": 1705045559,  消息发送时间
        "MsgSource": "<msgsource>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n",
        "NewMsgId": 8056409355261218186,   消息ID
        "MsgSeq": 640356133
    }
}
*/

export interface RoomAnnouncement {
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
         "MsgId": 1040356135,    消息ID
         "FromUserName":
         {
             "string": "34757816141@chatroom"   所在群聊的ID
         },
         "ToUserName":
         {
             "string": "wxid_0xsqb3o0tsvz22"
         },
         "MsgType": 10002,
         "Content":
         {
             "string": "34757816141@chatroom:\n<sysmsg type=\"roomtoolstips\">\n<todo>\n  <op>0</op>\n\n  <todoid><![CDATA[related_msgid_7881232272539128387]]></todoid>\n  <username><![CDATA[roomannouncement@app.origin]]></username>\n  <path><![CDATA[]]></path>\n  <time>1705045591</time>\n  <custominfo><![CDATA[]]></custominfo>\n  <title><![CDATA[群公告]]></title>\n  <creator><![CDATA[wxid_0xsqb3o0tsvz22]]></creator>\n  <related_msgid><![CDATA[7881232272539128387]]></related_msgid>\n  <manager><![CDATA[wxid_0xsqb3o0tsvz22]]></manager>\n  <nreply>0</nreply>\n  <scene><![CDATA[altertodo_set]]></scene>\n  <oper><![CDATA[wxid_0xsqb3o0tsvz22]]></oper>\n  <sharekey><![CDATA[]]></sharekey>\n  <sharename><![CDATA[]]></sharename>\n\n\n  \n\n\n  \n  \n  \n  <template><![CDATA[${wxid_0xsqb3o0tsvz22}将你的消息设置为群待办]]></template>\n  \n  \n  \n\n  \n\n  \n\n</todo>\n</sysmsg>"
         },
         "Status": 4,
         "ImgStatus": 1,
         "ImgBuf":
         {
             "iLen": 0
         },
         "CreateTime": 1705045591,  消息发送时间
         "MsgSource": "<msgsource>\n\t<tmp_node>\n\t\t<publisher-id></publisher-id>\n\t</tmp_node>\n</msgsource>\n",
         "NewMsgId": 1765700414095721113,   消息ID
         "MsgSeq": 640356135
     }
 }
*/

export interface RoomTodo {
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
    "TypeName": "DelContacts",   消息类型
    "Appid": "wx_wR_U4zPj2M_OTS3BCyoE4",  设备ID
    "Wxid": "wxid_phyyedw9xap22",  所属微信的wxid
    "Data":
    {
        "UserName":
        {
            "string": "wxid_phyyedw9xap22"   删除的好友wxid
        },
        "DeleteContactScen": 0
    }
}
*/

export interface DelContacts {
    TypeName: string
    Appid: string
    Wxid: string
    Data: {
        UserName: {
            string: string
        }
        DeleteContactScen: number
    }
}

/*
{
    "TypeName": "DelContacts",   消息类型
    "Appid": "wx_wR_U4zPj2M_OTS3BCyoE4",  设备ID
    "Wxid": "wxid_phyyedw9xap22",  所属微信的wxid
    "Data":
    {
        "UserName":
        {
            "string": "34559815390@chatroom"   退出的群聊ID
        },
        "DeleteContactScen": 0
    }
}
*/

export interface DelRoom {
    TypeName: string
    Appid: string
    Wxid: string
    Data: {
        UserName: {
            string: string
        }
        DeleteContactScen: number
    }
}

/*
{
    "TypeName": "Offline",   消息类型
    "Appid": "wx_wR_U4zPj2M_OTS3BCyoE4",  设备ID
    "Wxid": "wxid_phyyedw9xap22"  掉线号的wxid
}
*/

export interface Offline {
    TypeName: string
    Appid: string
    Wxid: string
}
