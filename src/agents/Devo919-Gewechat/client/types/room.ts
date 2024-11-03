export interface Member {
    wxid: string
    nickName: string
    inviterUserName: string
    memberFlag: number
    displayName: string
    bigHeadImgUrl: string
    smallHeadImgUrl: string
}

export interface Room {
    chatroomId: string
    nickName: string
    pyInitial: string
    quanPin: string
    sex: number
    remark: string
    remarkPyInitial: string
    remarkQuanPin: string
    chatRoomNotify: number
    chatRoomOwner: string
    smallHeadImgUrl: string
    memberList: Member[]
}
